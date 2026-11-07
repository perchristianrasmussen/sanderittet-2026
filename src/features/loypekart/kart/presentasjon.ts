// Kontrolleren for løypepresentasjonen: tilstand, tikkløkke, kamera, HUD og kontroller.
// Logikken følger prototypen (C:\Claude-filer\Løypepresentasjoner\index.html).
import { AttributionControl, LngLat, Map as MapLibreMap, Marker, setWorkerUrl, type GeoJSONSource } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import { CFG, RUTEFARGE } from '../motor/konfig.ts';
import { angDiff, easeIO, fmtInt, fmtKm, type LngLat as Punkt } from '../motor/geo.ts';
import { along, buildRoute, parseGpx, type Rute } from '../motor/rute.ts';
import { buildProfile, eleAt, gradAt, type Dem, type Profil } from '../motor/hoyde.ts';
import { buildEvents, type Hendelse } from '../motor/hendelser.ts';
import { faseTider, followCam, followSecFor, introCam, mix, outroCam, ramp, targetBearing, type Fase, type Kamera, type Oversikt } from '../motor/kamera.ts';
import { grad, lagStil } from './stil.ts';
import { loadDem } from './dem.ts';

// v6 finner workeren relativt til sin egen fil, som ikke finnes etter bundling
setWorkerUrl(workerUrl);

export interface Kilde {
  gpx: string;
  tittel?: string;
  disiplin?: string;
  /** Løypefargen fra indeksen (start | green | blue | red | orange | shortcut). Uten farge: rød. */
  farge?: string;
}

export interface PresentasjonValg extends Kilde {
  /** Les ?gpx= fra adressen (slug eller URL) og sett dokumenttittelen. */
  lesUrlParameter?: boolean;
  /** Inne i en vanlig side: kartet tar ikke imot mus, tastene virker bare når presentasjonen har fokus, og ingen dra-og-slipp. */
  innebygd?: boolean;
  finnLoype?: (q: string) => Kilde | undefined;
}

type LiveHendelse = Hendelse & { fired?: boolean; el?: HTMLElement };

const domParser = (t: string) => new DOMParser().parseFromString(t, 'application/xml');

// Hex-token til rgba for canvas
function medAlfa(hex: string, a: number) {
  const h = hex.trim().replace('#', '');
  const n = parseInt(h.length === 3 ? [...h].map((c) => c + c).join('') : h, 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

// Bland en hex-farge mot en annen (t = 0: a, t = 1: b)
function bland(a: string, b: string, t: number) {
  const tall = (hex: string) => {
    const h = hex.trim().replace('#', '');
    const n = parseInt(h.length === 3 ? [...h].map((c) => c + c).join('') : h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  };
  const [x, y] = [tall(a), tall(b)];
  return '#' + x.map((v, i) => Math.round(v + (y[i] - v) * t).toString(16).padStart(2, '0')).join('');
}

/** Fargene løypa tegnes med: strek (gradient), glød, og prikk/fremdrift i HUD-en. */
interface Linjefarger {
  done: readonly [string, string];
  glow: readonly [string, string];
  prikk: string;
  lys: string;
}

export function startPresentasjon(root: HTMLElement, valg: PresentasjonValg) {
  const $ = <T extends HTMLElement = HTMLElement>(ref: string) => root.querySelector<T>(`[data-ref="${ref}"]`)!;
  const css = getComputedStyle(root);
  const token = (navn: string, reserve: string) => css.getPropertyValue(navn).trim() || reserve;
  const farge = { red: token('--red', '#c8241a'), redLight: token('--red-light', '#e8342a'), font: token('--font-cond', 'sans-serif') };

  // Løypefargen styrer streken, rytteren og fremdriften i høydeprofilen. Etiketter, topplinjer og
  // bannere er klubbens TV-grafikk og forblir røde. Rød (og ukjent) beholder prototypens nyanser.
  const rod: Linjefarger = { done: RUTEFARGE.done, glow: RUTEFARGE.glow, prikk: farge.red, lys: farge.redLight };
  let linje = rod;
  function settLinjefarge(nokkel?: string) {
    const base = nokkel && nokkel !== 'red' ? css.getPropertyValue(`--route-${nokkel}`).trim() : '';
    if (!/^#[0-9a-f]{3,6}$/i.test(base)) linje = rod;
    else {
      const lys = bland(base, '#ffffff', 0.3);
      linje = { done: [bland(base, '#000000', 0.12), lys], glow: [medAlfa(base, 0.45), medAlfa(lys, 0.8)], prikk: base, lys };
    }
    root.style.setProperty('--loype', linje.prikk);
  }

  let R: Rute | null = null; // rutemodell
  let P: Profil | null = null; // høydeprofil
  let EVENTS: LiveHendelse[] = [];

  // ---------- Kart ----------
  const map = new MapLibreMap({
    container: $('map'),
    style: lagStil(),
    center: CFG.startCenter,
    zoom: CFG.startZoom,
    maxPitch: CFG.maxPitch,
    attributionControl: false,
    fadeDuration: 0,
    canvasContextAttributes: { antialias: true },
    // Kameraet styres av presentasjonen; innebygd skal ikke hjulet stjele sidens rulling
    interactive: !valg.innebygd,
  });
  map.addControl(new AttributionControl({ compact: true }), 'bottom-left');
  map.on('error', (e) => console.warn('Kartfeil:', e.error?.message || e));

  const riderEl = document.createElement('div');
  riderEl.className = 'rider';
  const rider = new Marker({ element: riderEl, opacityWhenCovered: '1' });
  let pins: Marker[] = [];

  // ---------- Tilstand og kamera ----------
  const S = {
    ready: false,
    playing: false,
    t: 0,
    last: null as number | null,
    speed: 1,
    bear: 0,
    ov: null as Oversikt | null,
    endCam: null as Kamera | null,
    followSec: 30,
    phase: 'loading' as Fase,
    bannerTimer: 0,
    raf: 0,
  };

  function setPhase(ph: Fase) {
    if (S.phase !== ph) {
      S.phase = ph;
      root.dataset.phase = ph;
    }
  }

  function computeOverview() {
    if (!R) return;
    const b: [Punkt, Punkt] = [
      [R.bbox[0], R.bbox[1]],
      [R.bbox[2], R.bbox[3]],
    ];
    const w = root.clientWidth,
      h = root.clientHeight;
    const cam = map.cameraForBounds(b, { padding: { top: h * 0.2, bottom: h * 0.26, left: w * 0.12, right: w * 0.12 } }) || map.cameraForBounds(b, { padding: 10 });
    if (!cam?.center) return;
    S.ov = { center: LngLat.convert(cam.center).toArray(), zoom: Math.min(cam.zoom ?? CFG.startZoom, 17.2) };
  }

  function render(dt: number) {
    if (!R || !S.ov) return;
    const t = S.t,
      { T1, T2, T3, T4 } = faseTider(S.followSec);
    let cam: Kamera,
      d = 0;
    if (t < T1) {
      setPhase('intro');
      cam = introCam(S.ov, t / T1);
    } else if (t < T2) {
      setPhase('trans');
      S.bear = targetBearing(R, 0);
      cam = mix(introCam(S.ov, 1), followCam(R, 0, S.bear), easeIO((t - T1) / CFG.transSec));
    } else if (t < T3) {
      setPhase('follow');
      d = R.L * ramp((t - T2) / S.followSec);
      S.bear += angDiff(S.bear, targetBearing(R, d)) * (1 - Math.exp(-dt * 1.8));
      cam = followCam(R, d, S.bear);
    } else {
      d = R.L;
      if (!S.endCam) S.endCam = followCam(R, R.L, S.bear);
      if (t < T4) {
        setPhase('outro');
        cam = mix(S.endCam, outroCam(S.ov, R), easeIO((t - T3) / CFG.outroSec));
      } else {
        setPhase('done');
        cam = outroCam(S.ov, R);
        S.playing = false;
        syncButtons();
      }
    }
    map.jumpTo(cam);
    updateProgress(d);
  }

  function updateProgress(d: number) {
    if (!R || !P) return;
    const p = d / R.L;
    map.setPaintProperty('route-done', 'line-gradient', grad(p, ...linje.done));
    map.setPaintProperty('route-glow', 'line-gradient', grad(p, ...linje.glow));
    rider.setLngLat(along(R, d, false));
    $('sDist').textContent = fmtKm(d);
    $('sEle').textContent = fmtInt(eleAt(P, R, d));
    const g = gradAt(P, R, d);
    $('sGrad').textContent = Number.isFinite(g) ? (g > 0.5 ? '+' : '') + Math.round(g) : '–';
    if (S.phase === 'follow')
      for (const e of EVENTS)
        if (!e.fired && d >= e.d) {
          e.fired = true;
          showBanner(e.k, e.v);
        }
    // Pinner vises bare når kameraet nærmer seg dem
    for (const e of EVENTS)
      if (e.el) {
        const ahead = e.d - d;
        e.el.classList.toggle('on', S.phase === 'follow' && ahead > -60 && ahead < 320);
      }
    drawProfile(d);
  }

  function showBanner(k: string, v?: string) {
    $('bK').textContent = k;
    $('bV').textContent = v || '';
    $('bV').style.display = v ? '' : 'none';
    const b = $('banner');
    b.classList.add('show');
    clearTimeout(S.bannerTimer);
    S.bannerTimer = window.setTimeout(() => b.classList.remove('show'), 2400 / Math.max(S.speed, 0.5));
  }

  // ---------- Høydeprofil-tegning ----------
  const prof = $<HTMLCanvasElement>('prof');
  function sizeProfile() {
    const r = prof.getBoundingClientRect(),
      dpr = devicePixelRatio || 1;
    prof.width = Math.round(r.width * dpr);
    prof.height = Math.round(r.height * dpr);
  }
  function drawProfile(d: number) {
    const g = prof.getContext('2d')!,
      w = prof.width,
      h = prof.height,
      k = devicePixelRatio || 1;
    g.clearRect(0, 0, w, h);
    if (!P || !R) return;
    const Pr = P,
      Rr = R;
    const pl = 50 * k,
      pr = 16 * k,
      pt = 28 * k,
      pb = 22 * k;
    const X = (dd: number) => pl + (dd / Rr.L) * (w - pl - pr);
    g.font = `600 ${11 * k}px ${farge.font}`;
    g.textBaseline = 'middle';

    if (!Pr.has) {
      g.fillStyle = 'rgba(255,255,255,.5)';
      g.fillText('Ingen høydedata tilgjengelig', pl, h / 2);
      g.fillStyle = linje.prikk;
      g.fillRect(pl, h - pb, X(d) - pl, 3 * k);
      return;
    }
    const range = Math.max(12, Pr.max - Pr.min),
      lo = Pr.min - range * 0.12,
      hi = Pr.max + range * 0.08;
    const Y = (ee: number) => pt + (1 - (ee - lo) / (hi - lo)) * (h - pt - pb);
    const path = () => {
      g.beginPath();
      g.moveTo(X(0), h - pb);
      Pr.d.forEach((dd, i) => g.lineTo(X(dd), Y(Pr.e[i])));
      g.lineTo(X(Rr.L), h - pb);
      g.closePath();
    };

    // Grunnlinjer
    g.strokeStyle = 'rgba(255,255,255,.08)';
    g.lineWidth = 1 * k;
    for (const v of [Pr.min, Pr.max]) {
      g.beginPath();
      g.moveTo(pl, Y(v));
      g.lineTo(w - pr, Y(v));
      g.stroke();
    }
    g.fillStyle = 'rgba(255,255,255,.55)';
    g.textAlign = 'right';
    g.fillText(fmtInt(Pr.max) + ' m', pl - 8 * k, Y(Pr.max));
    g.fillText(fmtInt(Pr.min) + ' m', pl - 8 * k, Y(Pr.min));

    // Hele profilen
    path();
    g.fillStyle = 'rgba(255,255,255,.09)';
    g.fill();
    g.strokeStyle = 'rgba(255,255,255,.4)';
    g.lineWidth = 1.5 * k;
    g.stroke();

    // Fremdrift
    g.save();
    g.beginPath();
    g.rect(0, 0, X(d), h);
    g.clip();
    path();
    const gr = g.createLinearGradient(0, pt, 0, h - pb);
    gr.addColorStop(0, medAlfa(linje.prikk, 0.85));
    gr.addColorStop(1, medAlfa(linje.prikk, 0.12));
    g.fillStyle = gr;
    g.fill();
    g.strokeStyle = linje.lys;
    g.lineWidth = 2.5 * k;
    g.stroke();
    g.restore();

    // Splitter
    g.textAlign = 'center';
    for (const e of EVENTS)
      if (e.kind === 'split') {
        const x = X(e.d);
        g.setLineDash([3 * k, 3 * k]);
        g.strokeStyle = 'rgba(255,255,255,.45)';
        g.lineWidth = 1 * k;
        g.beginPath();
        g.moveTo(x, pt - 8 * k);
        g.lineTo(x, h - pb);
        g.stroke();
        g.setLineDash([]);
        g.fillStyle = '#fff';
        g.fillText((e.pin ?? '').replace('SPLIT ', 'S'), x, pt - 16 * k);
      }
    // Km-merker
    g.fillStyle = 'rgba(255,255,255,.55)';
    const stepKm = Rr.L > 6000 ? 1000 : Rr.L > 2500 ? 500 : 250;
    for (let m = 0; m <= Rr.L; m += stepKm) g.fillText((m / 1000).toFixed(stepKm < 1000 ? 2 : 0).replace('.', ','), X(m), h - pb / 2);

    // Rytter
    const x = X(d),
      y = Y(eleAt(Pr, Rr, d));
    g.beginPath();
    g.arc(x, y, 6 * k, 0, Math.PI * 2);
    g.fillStyle = '#fff';
    g.fill();
    g.beginPath();
    g.arc(x, y, 3.5 * k, 0, Math.PI * 2);
    g.fillStyle = linje.prikk;
    g.fill();
  }

  // ---------- Oppsett ----------
  function pinEl(cls: string, text: string) {
    const el = document.createElement('div');
    el.className = 'pin ' + cls;
    el.innerHTML = '<div class="l"></div><div class="s"></div><div class="d"></div>';
    el.firstChild!.textContent = text;
    return el;
  }

  async function setupRoute(text: string, fileName: string, over: Omit<Kilde, 'gpx'> = {}) {
    S.ready = false;
    S.playing = false;
    $('loading').classList.remove('gone');
    $('loadMsg').textContent = 'Laster løype og terreng…';
    const raw = parseGpx(text, domParser);
    if (raw.length < 2) {
      $('loadMsg').textContent = 'Fant ingen punkter i GPX-filen';
      return;
    }
    const rute = buildRoute(raw, fileName);
    if (over.tittel) rute.name = over.tittel;
    if (over.disiplin) rute.disc = over.disiplin;
    settLinjefarge(over.farge);
    R = rute;

    map.getSource<GeoJSONSource>('route')?.setData({ type: 'Feature', properties: {}, geometry: { type: 'LineString', coordinates: rute.coords } });

    let dem: Dem | null = null;
    try {
      dem = await loadDem(rute.bbox);
    } catch (e) {
      console.warn('Klarte ikke å hente høydedata', e);
    }
    const prof = buildProfile(rute, dem);
    P = prof;
    EVENTS = buildEvents(rute, prof);
    S.followSec = followSecFor(rute.L);

    // Tekst
    for (const ref of ['discTag', 'discTag2']) $(ref).textContent = rute.disc;
    $('courseName').textContent = rute.name;
    $('sumName').textContent = rute.name;
    $('courseSub').textContent = [fmtKm(rute.L) + ' km', prof.has ? fmtInt(prof.climb) + ' høydemeter' : null, rute.isLoop ? 'Rundløype' : 'A–B'].filter(Boolean).join('  ·  ');
    $('sumLen').textContent = fmtKm(rute.L);
    $('sumClimb').textContent = fmtInt(prof.climb);
    $('sumMax').textContent = fmtInt(prof.max);
    $('sumSteep').textContent = fmtInt(prof.steep);
    if (valg.lesUrlParameter) document.title = rute.name + ' ' + rute.disc;

    // Markører
    pins.forEach((m) => m.remove());
    pins = [];
    pins.push(new Marker({ element: pinEl('start', rute.isLoop ? 'START / MÅL' : 'START'), anchor: 'bottom' }).setLngLat(rute.coords[0]).addTo(map));
    if (!rute.isLoop) pins.push(new Marker({ element: pinEl('start', 'MÅL'), anchor: 'bottom' }).setLngLat(rute.coords[rute.coords.length - 1]).addTo(map));
    for (const e of EVENTS)
      if (e.pin) {
        e.el = pinEl(e.kind + ' ev', e.pin);
        pins.push(new Marker({ element: e.el, anchor: 'bottom' }).setLngLat(along(rute, e.d, false)).addTo(map));
      }
    rider.setLngLat(rute.coords[0]).addTo(map);

    map.resize();
    computeOverview();
    sizeProfile();
    restart(false);
    if (S.ov) map.jumpTo(introCam(S.ov, 0));
    updateProgress(0);

    // Vent til fliser er lastet før vi starter
    await new Promise<void>((res) => {
      let done = false;
      const fin = () => {
        if (!done) {
          done = true;
          res();
        }
      };
      map.once('idle', fin);
      setTimeout(fin, 5000);
    });
    $('loading').classList.add('gone');
    S.ready = true;
    S.playing = true;
    S.last = null;
    syncButtons();
  }

  function restart(play = true) {
    S.t = 0;
    S.endCam = null;
    S.bear = 0;
    S.last = null;
    EVENTS.forEach((e) => (e.fired = false));
    $('banner').classList.remove('show');
    setPhase('intro');
    if (play) {
      S.playing = true;
      syncButtons();
    }
  }

  function syncButtons() {
    $('bPlay').textContent = S.playing ? 'Pause' : S.phase === 'done' ? 'Spill igjen' : 'Spill av';
  }

  function tick(now: number) {
    S.raf = requestAnimationFrame(tick);
    const real = S.last == null ? 0 : Math.min(0.1, (now - S.last) / 1000);
    S.last = now;
    if (!S.ready || !S.playing) return;
    const dt = real * S.speed;
    S.t += dt;
    render(dt);
  }
  S.raf = requestAnimationFrame(tick);

  // ---------- Kontroller ----------
  function togglePlay() {
    if (!S.ready) return;
    if (S.phase === 'done') return restart(true);
    S.playing = !S.playing;
    S.last = null;
    syncButtons();
  }
  const toggleClean = () => root.classList.toggle('clean');
  $('bPlay').onclick = togglePlay;
  $('bRestart').onclick = () => S.ready && restart(true);
  $<HTMLSelectElement>('bSpeed').onchange = (e) => (S.speed = parseFloat((e.target as HTMLSelectElement).value));
  $('bBase').onclick = () => {
    const topo = map.getLayoutProperty('topo', 'visibility') !== 'visible';
    map.setLayoutProperty('topo', 'visibility', topo ? 'visible' : 'none');
    map.setLayoutProperty('sat', 'visibility', topo ? 'none' : 'visible');
    $('bBase').textContent = topo ? 'Flyfoto' : 'Topo';
  };
  $('bClean').onclick = toggleClean;

  const onKey = (e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement | null)?.tagName ?? '';
    if (tag === 'SELECT') return;
    // Mellomrom på en knapp eller lenke gjør knappens egen jobb
    if (e.code === 'Space' && (tag === 'BUTTON' || tag === 'A')) return;
    if (e.code === 'Space') {
      e.preventDefault();
      togglePlay();
    } else if (e.key === 'r' || e.key === 'R') S.ready && restart(true);
    else if (e.key === 'h' || e.key === 'H') toggleClean();
  };
  const tastMal: HTMLElement | Window = valg.innebygd ? root : window;
  tastMal.addEventListener('keydown', onKey as EventListener);

  function onResize() {
    map.resize();
    if (!R) return;
    sizeProfile();
    computeOverview();
    if (S.ready && !S.playing) render(0); // tegn stillbildet på nytt
  }
  const ro = new ResizeObserver(onResize);
  ro.observe($('map'));

  // Dra og slipp en annen GPX
  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    root.classList.add('dragging');
  };
  const onDragLeave = (e: DragEvent) => {
    const t = e.target as HTMLElement;
    if (t === document.documentElement || t.dataset.ref === 'drop') root.classList.remove('dragging');
  };
  const onDrop = async (e: DragEvent) => {
    e.preventDefault();
    root.classList.remove('dragging');
    const f = [...(e.dataTransfer?.files ?? [])].find((f) => /\.gpx$/i.test(f.name));
    if (f) setupRoute(await f.text(), f.name);
  };
  if (!valg.innebygd) {
    addEventListener('dragover', onDragOver);
    addEventListener('dragleave', onDragLeave);
    addEventListener('drop', onDrop);
  }

  // ---------- Start ----------
  map.on('load', async () => {
    const q = valg.lesUrlParameter ? new URLSearchParams(location.search).get('gpx') : null;
    const kilde: Kilde = q ? (valg.finnLoype?.(q) ?? { gpx: q }) : valg;
    try {
      const res = await fetch(encodeURI(kilde.gpx));
      if (!res.ok) throw new Error(String(res.status));
      await setupRoute(await res.text(), kilde.gpx.split('/').pop() ?? kilde.gpx, kilde);
    } catch (err) {
      $('loadMsg').textContent = 'Fant ikke GPX-filen. Dra en GPX-fil inn i vinduet.';
      console.warn(err);
    }
  });

  return {
    map,
    destroy() {
      cancelAnimationFrame(S.raf);
      clearTimeout(S.bannerTimer);
      ro.disconnect();
      tastMal.removeEventListener('keydown', onKey as EventListener);
      removeEventListener('dragover', onDragOver);
      removeEventListener('dragleave', onDragLeave);
      removeEventListener('drop', onDrop);
      map.remove();
    },
  };
}
