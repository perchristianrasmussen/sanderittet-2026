// Oversiktskartet: alle løypene i 2D, med løypevelger, fremheving og valg i adressen (?vis=).
// Listen med avkrysningsbokser er rendret av Loypeoversikt.astro; her kobles den til kartet.
import { AttributionControl, FullscreenControl, LngLatBounds, Map as MapLibreMap, NavigationControl, Popup, setWorkerUrl, type ExpressionSpecification, type GeoJSONSource, type MapMouseEvent } from 'maplibre-gl';
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?url';
import type { FeatureCollection } from 'geojson';
import { CFG } from '../motor/konfig.ts';
import { fmtKm } from '../motor/geo.ts';
import { RUTEFARGER, type LoypeInfo } from '../motor/katalog.ts';
import { lagOversiktStil, OVERSIKT_LAG as LAG, type Fargekart } from './stil.ts';

setWorkerUrl(workerUrl);

export interface OversiktValg {
  /** URL til GeoJSON med alle løypene (tilGeoJson) */
  geojson: string;
  loyper: LoypeInfo[];
  /** Les og skriv ?vis= i adressen */
  brukAdresse?: boolean;
}

const PARAM = 'vis';

const NORSK = {
  'CooperativeGesturesHandler.WindowsHelpText': 'Hold Ctrl og rull for å zoome i kartet',
  'CooperativeGesturesHandler.MacHelpText': 'Hold ⌘ og rull for å zoome i kartet',
  'CooperativeGesturesHandler.MobileHelpText': 'Bruk to fingre for å flytte kartet',
  'NavigationControl.ZoomIn': 'Zoom inn',
  'NavigationControl.ZoomOut': 'Zoom ut',
  'FullscreenControl.Enter': 'Vis kartet i fullskjerm',
  'FullscreenControl.Exit': 'Avslutt fullskjerm',
  'AttributionControl.ToggleAttribution': 'Vis eller skjul kildene',
  'Popup.Close': 'Lukk',
  'Map.Title': 'Løypekart',
};

// Pil som peker mot høyre; symbol-laget roterer den langs løypa
function lagPil(): ImageData {
  const s = 32,
    cv = document.createElement('canvas');
  cv.width = cv.height = s;
  const g = cv.getContext('2d')!;
  g.lineJoin = g.lineCap = 'round';
  g.beginPath();
  g.moveTo(11, 8);
  g.lineTo(21, 16);
  g.lineTo(11, 24);
  g.strokeStyle = 'rgba(7,9,13,0.85)';
  g.lineWidth = 8;
  g.stroke();
  g.strokeStyle = '#fff';
  g.lineWidth = 4;
  g.stroke();
  return g.getImageData(0, 0, s, s);
}

export function startOversikt(root: HTMLElement, valg: OversiktValg) {
  const $ = <T extends HTMLElement = HTMLElement>(ref: string) => root.querySelector<T>(`[data-ref="${ref}"]`);
  const css = getComputedStyle(root);
  const farger = Object.fromEntries(RUTEFARGER.map((f) => [f, css.getPropertyValue(`--route-${f}`).trim() || '#888'])) as Fargekart;
  farger.ukjent = css.getPropertyValue('--line-strong').trim() || '#7a8499';

  const alle = valg.loyper.map((l) => l.slug);
  const info = new Map(valg.loyper.map((l) => [l.slug, l]));
  const standard = valg.loyper.filter((l) => l.vises).map((l) => l.slug);
  const roligBevegelse = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Tilstand ----------
  function lesAdresse(): string[] {
    if (!valg.brukAdresse) return standard;
    const q = new URLSearchParams(location.search).get(PARAM);
    if (q === null) return standard;
    return q.split(',').filter((s) => info.has(s));
  }
  const synlige = new Set(lesAdresse());
  let fokus: string | null = null;
  let lastet = false; // stilen er lastet og løypene lagt inn

  // ---------- Kart ----------
  const map = new MapLibreMap({
    container: $('map')!,
    style: lagOversiktStil(farger),
    center: CFG.startCenter,
    zoom: 15,
    minZoom: 10,
    maxZoom: 19,
    attributionControl: false,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
    cooperativeGestures: true,
    locale: NORSK,
  });
  map.touchZoomRotate.disableRotation();
  map.keyboard.disableRotation();
  map.addControl(new NavigationControl({ showCompass: false }), 'top-right');
  map.addControl(new FullscreenControl({ container: root.querySelector<HTMLElement>('[data-ref="ramme"]') ?? undefined }), 'top-right');
  map.addControl(new AttributionControl({ compact: true }), 'bottom-right');
  map.on('error', (e) => console.warn('Kartfeil:', e.error?.message || e));

  const iListe = (slugs: Iterable<string>): ExpressionSpecification => ['in', ['get', 'slug'], ['literal', [...slugs]]];

  function tegn() {
    if (!lastet) return;
    const vis = iListe(synlige);
    const hel: ExpressionSpecification = ['all', vis, ['!', ['get', 'stiplet']]];
    const stiplet: ExpressionSpecification = ['all', vis, ['get', 'stiplet']];
    map.setFilter(LAG.kant, vis);
    map.setFilter(LAG.hel, hel);
    map.setFilter(LAG.stiplet, stiplet);
    map.setFilter(LAG.treff, vis);

    // Fremhevet løype: tegnes over de andre med kant og retningspiler, resten dempes
    const f = fokus && synlige.has(fokus) ? fokus : null;
    const denne: ExpressionSpecification = ['==', ['get', 'slug'], f ?? ''];
    for (const lag of [LAG.fokusKant, LAG.fokus, LAG.pil]) map.setFilter(lag, denne);
    const opasitet = f ? 0.35 : 1;
    map.setPaintProperty(LAG.hel, 'line-opacity', opasitet);
    map.setPaintProperty(LAG.stiplet, 'line-opacity', opasitet);
    map.setPaintProperty(LAG.kant, 'line-opacity', f ? 0.5 : 0.9);
    if (f) map.setPaintProperty(LAG.fokus, 'line-dasharray', info.get(f)?.stiplet ? [2, 1.2] : [1, 0]);
  }

  function settFokus(slug: string | null) {
    if (slug === fokus) return;
    fokus = slug;
    for (const rad of root.querySelectorAll<HTMLElement>('[data-rad]')) rad.classList.toggle('fokus', rad.dataset.rad === slug);
    tegn();
  }

  // ---------- Utsnitt ----------
  let data: FeatureCollection | null = null;
  function grenser(slugs: string[]) {
    const b = new LngLatBounds();
    for (const ft of data?.features ?? [])
      if (slugs.includes(ft.properties?.slug) && ft.geometry.type === 'LineString') for (const c of ft.geometry.coordinates) b.extend(c as [number, number]);
    return b;
  }
  function tilpass(animer = true) {
    const b = grenser(synlige.size ? [...synlige] : alle);
    if (b.isEmpty()) return;
    const smal = root.clientWidth < 600;
    map.fitBounds(b, { padding: smal ? { top: 64, bottom: 24, left: 20, right: 56 } : { top: 80, bottom: 40, left: 40, right: 72 }, maxZoom: 17, duration: animer && !roligBevegelse ? 600 : 0 });
  }

  // ---------- Velgeren ----------
  const bokser = [...root.querySelectorAll<HTMLInputElement>('input[data-loype]')];

  function synkVelger() {
    for (const b of bokser) b.checked = synlige.has(b.value);
    for (const g of root.querySelectorAll<HTMLElement>('[data-gruppe]')) {
      const iGruppe = bokser.filter((b) => b.closest('[data-gruppe]') === g);
      const pa = iGruppe.filter((b) => b.checked).length;
      g.querySelector<HTMLButtonElement>('[data-alle]')?.toggleAttribute('disabled', pa === iGruppe.length);
      g.querySelector<HTMLButtonElement>('[data-ingen]')?.toggleAttribute('disabled', pa === 0);
    }
    const antall = $('antall');
    if (antall) antall.textContent = synlige.size === 0 ? 'Ingen løyper valgt' : `${synlige.size} av ${alle.length} løyper vises`;
    root.classList.toggle('tom', synlige.size === 0);
  }

  function skrivAdresse() {
    if (!valg.brukAdresse) return;
    const url = new URL(location.href);
    const lik = synlige.size === standard.length && standard.every((s) => synlige.has(s));
    if (lik) url.searchParams.delete(PARAM);
    else url.searchParams.set(PARAM, alle.filter((s) => synlige.has(s)).join(','));
    // Komma trenger ikke kodes i adressen
    history.replaceState(history.state, '', url.toString().replace(/%2C/gi, ','));
  }

  function endret(tilpassUtsnitt = false) {
    synkVelger();
    skrivAdresse();
    tegn();
    if (tilpassUtsnitt && synlige.size) tilpass();
  }

  for (const b of bokser)
    b.addEventListener('change', () => {
      if (b.checked) synlige.add(b.value);
      else synlige.delete(b.value);
      endret();
    });

  root.addEventListener('click', (e) => {
    const knapp = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-alle], button[data-ingen]');
    if (!knapp) return;
    const g = knapp.closest<HTMLElement>('[data-gruppe]');
    for (const b of bokser) if (b.closest('[data-gruppe]') === g) knapp.hasAttribute('data-alle') ? synlige.add(b.value) : synlige.delete(b.value);
    endret();
  });

  // Hold over eller fokuser en rad for å fremheve løypa i kartet
  for (const rad of root.querySelectorAll<HTMLElement>('[data-rad]')) {
    const slug = rad.dataset.rad!;
    rad.addEventListener('pointerenter', () => settFokus(slug));
    rad.addEventListener('pointerleave', () => settFokus(null));
    rad.addEventListener('focusin', () => settFokus(slug));
    rad.addEventListener('focusout', (e) => !rad.contains(e.relatedTarget as Node) && settFokus(null));
  }

  $('tilpass')?.addEventListener('click', () => tilpass());

  const grunnkart = $<HTMLButtonElement>('grunnkart');
  grunnkart?.addEventListener('click', () => {
    const flyfoto = grunnkart.getAttribute('aria-pressed') !== 'true';
    grunnkart.setAttribute('aria-pressed', String(flyfoto));
    map.setLayoutProperty('sat', 'visibility', flyfoto ? 'visible' : 'none');
    map.setLayoutProperty('topo', 'visibility', flyfoto ? 'none' : 'visible');
    map.setPaintProperty(LAG.kant, 'line-color', flyfoto ? 'rgba(7,9,13,0.8)' : '#fff');
  });

  // ---------- Kart: hover og klikk ----------
  const popup = new Popup({ closeButton: true, maxWidth: '280px', className: 'loype-popup', focusAfterOpen: false });

  function loyperVed(e: MapMouseEvent) {
    const r = 6;
    const treff = map.queryRenderedFeatures(
      [
        [e.point.x - r, e.point.y - r],
        [e.point.x + r, e.point.y + r],
      ],
      { layers: [LAG.treff] },
    );
    // Korteste først, samme rekkefølge som listen ellers
    const slugs = [...new Set(treff.map((f) => f.properties.slug as string))];
    return alle.filter((s) => slugs.includes(s));
  }

  map.on('mousemove', LAG.treff, (e) => {
    map.getCanvas().style.cursor = 'pointer';
    const ved = loyperVed(e);
    settFokus(ved.length === 1 ? ved[0] : (ved.includes(fokus ?? '') ? fokus : ved[0] ?? null));
  });
  map.on('mouseleave', LAG.treff, () => {
    map.getCanvas().style.cursor = '';
    settFokus(null);
  });

  // Klikk viser alle løypene som går akkurat der (mange deler sti)
  map.on('click', (e) => {
    const ved = loyperVed(e);
    if (!ved.length) return popup.remove();
    const el = document.createElement('div');
    const tittel = document.createElement('p');
    tittel.className = 'popup-tittel';
    tittel.textContent = ved.length === 1 ? 'Løype her' : `${ved.length} løyper her`;
    const liste = document.createElement('ul');
    for (const slug of ved) {
      const l = info.get(slug)!;
      const li = document.createElement('li');
      li.style.setProperty('--farge', farger[l.farge] ?? farger.ukjent);
      if (l.stiplet) li.classList.add('stiplet');
      const navn = document.createElement('a');
      navn.href = `/loyper/${slug}`;
      navn.className = 'popup-navn';
      navn.textContent = l.navn;
      const meta = document.createElement('span');
      meta.className = 'popup-meta';
      meta.textContent = `${l.disiplin} · ${fmtKm(l.lengde)} km`;
      li.append(navn, meta);
      if (synlige.size > 1) {
        const bare = document.createElement('button');
        bare.type = 'button';
        bare.dataset.visBare = slug;
        bare.textContent = 'Vis bare denne';
        li.append(bare);
      }
      liste.append(li);
    }
    el.append(tittel, liste);
    el.addEventListener('click', (ev) => {
      const b = (ev.target as HTMLElement).closest<HTMLButtonElement>('button[data-vis-bare]');
      if (!b) return;
      synlige.clear();
      synlige.add(b.dataset.visBare!);
      popup.remove();
      endret(true);
    });
    popup.setLngLat(e.lngLat).setDOMContent(el).addTo(map);
  });

  // ---------- Start ----------
  // Hentes én gang her (ikke av MapLibre), så utsnittet kan regnes fra løypene
  const henting = fetch(valg.geojson).then((r) => {
    if (!r.ok) throw new Error(`${valg.geojson}: ${r.status}`);
    return r.json() as Promise<FeatureCollection>;
  });
  map.on('load', async () => {
    map.addImage('pil', lagPil(), { pixelRatio: 2 });
    try {
      data = await henting;
    } catch (err) {
      console.warn(err);
      const melding = $('melding');
      if (melding) melding.textContent = 'Kunne ikke laste løypene. Prøv å laste siden på nytt.';
      return;
    }
    map.getSource<GeoJSONSource>('loyper')?.setData(data);
    lastet = true;
    tegn();
    tilpass(false);
    root.dataset.klar = '';
  });

  // Tilbake/frem i nettleseren endrer ikke adressen vi skriver med replaceState, men en lenke med ?vis= kan
  const onPop = () => {
    synlige.clear();
    for (const s of lesAdresse()) synlige.add(s);
    endret(true);
  };
  if (valg.brukAdresse) addEventListener('popstate', onPop);

  synkVelger();
  root.dataset.aktiv = '';

  return {
    map,
    destroy() {
      removeEventListener('popstate', onPop);
      popup.remove();
      map.remove();
    },
  };
}
