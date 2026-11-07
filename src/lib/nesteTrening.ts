// Regner ut neste trening fra treningsplanen, alltid i norsk tid (Europe/Oslo).
// Ren funksjon uten avhengigheter, slik at den kan kjøres både ved bygg og i nettleseren.

export interface Okt {
  /** ISO-ukedag: 1 = mandag … 7 = søndag */
  ukedag: number;
  gruppe: string;
  /** "HH:MM" */
  start: string;
  slutt: string;
}

export interface Treningsplan {
  okter: Okt[];
  /** Første dag i høstferien per år, "YYYY-MM-DD". Sesongen slutter dagen før. */
  hostferie: Record<string, string>;
  /** ISO-uke som brukes når året mangler i `hostferie`. */
  hostferieUke: number;
}

export type NesteTrening =
  | { state: 'i-dag'; label: string; value: string; datetime: string }
  | { state: 'neste'; label: string; value: string; datetime: string }
  | { state: 'utenfor-sesong'; label: string; value: string; datetime: string };

const DAG_MS = 86_400_000;
const UKEDAGER = ['Man', 'Tir', 'Ons', 'Tor', 'Fre', 'Lør', 'Søn'];
const MANEDER = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];

const oslo = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Oslo',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hourCycle: 'h23',
});

// Dager regnes som heltall (dager siden 1970-01-01) for å slippe tidssoner i datoregningen.
const dagnr = (y: number, m: number, d: number) => Date.UTC(y, m - 1, d) / DAG_MS;
const isoUkedag = (dag: number) => ((new Date(dag * DAG_MS).getUTCDay() + 6) % 7) + 1;
const minutter = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const pad = (n: number) => String(n).padStart(2, '0');

function osloDeler(ms: number) {
  const p: Record<string, number> = {};
  for (const { type, value } of oslo.formatToParts(new Date(ms))) {
    if (type !== 'literal') p[type] = Number(value);
  }
  return { dag: dagnr(p.year, p.month, p.day), min: p.hour * 60 + p.minute, ar: p.year };
}

/** Lokal Oslo-tid som ISO-streng med riktig offset, f.eks. 2027-04-01T18:00+02:00 */
function isoOslo(dag: number, min: number) {
  const gjett = dag * DAG_MS + min * 60_000;
  const forskyvning = (ms: number) => {
    const d = osloDeler(ms);
    return d.dag * DAG_MS + d.min * 60_000 - ms;
  };
  const off = forskyvning(gjett - forskyvning(gjett));
  const dato = new Date(dag * DAG_MS).toISOString().slice(0, 10);
  const fortegn = off < 0 ? '-' : '+';
  const a = Math.abs(off) / 60_000;
  return `${dato}T${pad(Math.floor(min / 60))}:${pad(min % 60)}${fortegn}${pad(Math.floor(a / 60))}:${pad(a % 60)}`;
}

/** Kort dato på norsk, f.eks. «Tor 1. april». */
function kortDato(dag: number) {
  const d = new Date(dag * DAG_MS);
  return `${UKEDAGER[isoUkedag(dag) - 1]} ${d.getUTCDate()}. ${MANEDER[d.getUTCMonth()]}`;
}

/** 1. påskedag etter gregoriansk kalender (anonym gregoriansk algoritme). */
export function paskedag(ar: number) {
  const a = ar % 19;
  const b = Math.floor(ar / 100);
  const c = ar % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mnd = Math.floor((h + l - 7 * m + 114) / 31);
  const dag = ((h + l - 7 * m + 114) % 31) + 1;
  return dagnr(ar, mnd, dag);
}

/** Sesongvindu [fra, til) som dagnummer: fra dagen etter 2. påskedag til høstferien. */
export function sesong(ar: number, plan: Treningsplan) {
  const fra = paskedag(ar) + 2;
  const overstyrt = plan.hostferie[ar];
  let til: number;
  if (overstyrt) {
    const [y, m, d] = overstyrt.split('-').map(Number);
    til = dagnr(y, m, d);
  } else {
    const jan4 = dagnr(ar, 1, 4);
    til = jan4 - (isoUkedag(jan4) - 1) + (plan.hostferieUke - 1) * 7;
  }
  return { fra, til };
}

/** Første økt (dag og starttid) i [fra, til), der økter i dag må slutte etter `naMin`. */
function forsteOkt(okter: Okt[], fra: number, til: number, naMin = -1) {
  for (let dag = fra; dag < til; dag++) {
    const wd = isoUkedag(dag);
    const starter = okter
      .filter((o) => o.ukedag === wd && (dag > fra || minutter(o.slutt) > naMin))
      .map((o) => minutter(o.start));
    if (starter.length) return { dag, min: Math.min(...starter) };
  }
  return null;
}

/**
 * Neste trening for alle grupper, eller bare for `gruppe` (samme tekst som `Okt.gruppe`).
 * Med gruppe står gruppenavnet bak verdien, f.eks. «Man 18:00 · opptil 10 år».
 */
export function nesteTrening(now: Date, plan: Treningsplan, gruppe?: string): NesteTrening {
  const okter = gruppe ? plan.okter.filter((o) => o.gruppe === gruppe) : plan.okter;
  const hale = gruppe ? ` · ${gruppe.charAt(0).toLowerCase()}${gruppe.slice(1)}` : '';
  const na = osloDeler(now.getTime());
  const s = sesong(na.ar, plan);

  if (na.dag >= s.fra && na.dag < s.til) {
    const okt = forsteOkt(okter, na.dag, s.til, na.min);
    if (okt) {
      const tid = `${pad(Math.floor(okt.min / 60))}:${pad(okt.min % 60)}`;
      const datetime = isoOslo(okt.dag, okt.min);
      return okt.dag === na.dag
        ? { state: 'i-dag', label: 'Trening i dag', value: tid + hale, datetime }
        : { state: 'neste', label: 'Neste trening', value: `${UKEDAGER[isoUkedag(okt.dag) - 1]} ${tid}${hale}`, datetime };
    }
  }

  // Utenfor sesong: pek på første trening i neste sesong.
  const neste = na.dag < s.fra ? s : sesong(na.ar + 1, plan);
  const forste = forsteOkt(okter, neste.fra, neste.til);
  const datetime = forste ? isoOslo(forste.dag, forste.min) : new Date(neste.fra * DAG_MS).toISOString().slice(0, 10);
  return { state: 'utenfor-sesong', label: 'Sesongen starter', value: kortDato(forste?.dag ?? neste.fra) + hale, datetime };
}
