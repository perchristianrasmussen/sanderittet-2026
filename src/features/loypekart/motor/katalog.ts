// Løypekatalogen: slår sammen GPX-filene med indeksen (data/loyper.ts), validerer og måler.
// Ren funksjon uten filsystem eller Vite, så den kan testes i Node. data/katalog.ts mater den ved bygg.
import { buildRoute, parseGpx, xmlUtenDom, type BBox, type XmlParser } from './rute.ts';
import type { LngLat } from './geo.ts';

/** Løypefargene i tokens.css (`--route-<farge>`). Fargene følger aldersklasser (DESIGN.md). */
export const RUTEFARGER = ['start', 'green', 'blue', 'red', 'orange', 'shortcut'] as const;
export type Rutefarge = (typeof RUTEFARGER)[number] | 'ukjent';

/** Rekkefølgen disiplinene vises i. Andre disipliner kommer etter, i alfabetisk rekkefølge. */
export const DISIPLINER = ['XCO', 'XCC'];

export interface LoypeOppforing {
  /** Filnavnet i data/gpx/ gjort om til slug (se `slugify`), f.eks. `rod-lang-xco`. Brukes i adresser. */
  slug: string;
  navn: string;
  disiplin: string;
  farge: Rutefarge;
  /** Stiplet strek, for å skille to løyper med samme farge. */
  stiplet?: boolean;
  /** Vises når kartet åpnes uten valg i adressen. Standard: true. */
  vises?: boolean;
  /** Tas ikke med på nettsiden, selv om filen ligger der. */
  skjult?: boolean;
}

export interface KatalogLoype {
  slug: string;
  navn: string;
  disiplin: string;
  farge: Rutefarge;
  stiplet: boolean;
  vises: boolean;
  /** Stabil nedlastingsadresse */
  gpx: string;
  /** Filnavnet nedlastingen lagres som */
  lastNedSom: string;
  /** Meter */
  lengde: number;
  rundlop: boolean;
  bbox: BBox;
  coords: LngLat[];
  /** false når filen ikke står i indeksen og navn, disiplin og farge er gjettet */
  fraIndeks: boolean;
  /** GPX-filens innhold, slik den serveres */
  tekst: string;
}

export interface GpxFil {
  filnavn: string;
  tekst: string;
}

export interface Katalog {
  loyper: KatalogLoype[];
  advarsler: string[];
}

const MIN_PUNKTER = 10;
const MIN_LENGDE = 50; // meter

// «Rød Lang XCO.gpx» → «rod-lang-xco»
export function slugify(filnavn: string) {
  return filnavn
    .replace(/\.gpx$/i, '')
    .toLowerCase()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const avrund = (v: number) => Math.round(v * 1e6) / 1e6;

export function byggKatalog(filer: GpxFil[], oppforinger: LoypeOppforing[], parse: XmlParser = xmlUtenDom): Katalog {
  const feil: string[] = [];
  const advarsler: string[] = [];
  const indeks = new Map<string, LoypeOppforing>();

  for (const o of oppforinger) {
    if (indeks.has(o.slug)) feil.push(`Indeksen har «${o.slug}» to ganger.`);
    if (o.farge !== 'ukjent' && !RUTEFARGER.includes(o.farge)) feil.push(`«${o.slug}»: ukjent farge «${o.farge}». Bruk en av ${RUTEFARGER.join(', ')}.`);
    indeks.set(o.slug, o);
  }

  const funnet = new Map<string, KatalogLoype>();
  for (const fil of filer) {
    const slug = slugify(fil.filnavn);
    if (!slug) {
      feil.push(`«${fil.filnavn}»: filnavnet gir ingen gyldig slug.`);
      continue;
    }
    if (funnet.has(slug)) {
      feil.push(`«${fil.filnavn}» og en annen fil gir begge slugen «${slug}». Gi en av dem et annet navn.`);
      continue;
    }
    const o = indeks.get(slug);
    if (o?.skjult) continue;

    let raw: LngLat[];
    try {
      raw = parseGpx(fil.tekst, parse);
    } catch (e) {
      feil.push(`«${fil.filnavn}»: kunne ikke lese GPX (${(e as Error).message}).`);
      continue;
    }
    if (raw.length < MIN_PUNKTER) {
      feil.push(`«${fil.filnavn}»: fant bare ${raw.length} punkter. Filen må ha et spor (<trkpt>) eller en rute (<rtept>).`);
      continue;
    }
    const R = buildRoute(raw, fil.filnavn);
    if (!(R.L >= MIN_LENGDE)) {
      feil.push(`«${fil.filnavn}»: løypa er bare ${Math.round(R.L)} m lang.`);
      continue;
    }

    if (!o) {
      advarsler.push(
        `«${fil.filnavn}» står ikke i data/loyper.ts. Den vises som «${R.name}» (${R.disc}) i grått. Legg den inn i indeksen med slug «${slug}».`,
      );
    }
    const navn = o?.navn ?? R.name.charAt(0).toUpperCase() + R.name.slice(1);
    const disiplin = o?.disiplin ?? R.disc;
    funnet.set(slug, {
      slug,
      navn,
      disiplin,
      farge: o?.farge ?? 'ukjent',
      stiplet: o?.stiplet ?? false,
      vises: o?.vises ?? true,
      gpx: `/gpx/${slug}.gpx`,
      lastNedSom: `${navn} (${disiplin}).gpx`,
      lengde: R.L,
      rundlop: R.isLoop,
      bbox: R.bbox,
      coords: R.coords.map(([x, y]): LngLat => [avrund(x), avrund(y)]),
      fraIndeks: Boolean(o),
      tekst: fil.tekst,
    });
  }

  for (const o of oppforinger)
    if (!o.skjult && !funnet.has(o.slug) && !filer.some((f) => slugify(f.filnavn) === o.slug))
      feil.push(`Indeksen har «${o.slug}», men det finnes ingen GPX-fil som gir den slugen i data/gpx/.`);

  if (feil.length) throw new Error('Løypekatalogen har feil:\n- ' + feil.join('\n- '));

  // Indeksens rekkefølge først, deretter nye filer etter navn
  const rekkefolge = oppforinger.map((o) => o.slug);
  const plass = (l: KatalogLoype) => (l.fraIndeks ? rekkefolge.indexOf(l.slug) : Infinity);
  const loyper = [...funnet.values()].sort((a, b) => plass(a) - plass(b) || a.navn.localeCompare(b.navn, 'nb'));
  return { loyper, advarsler };
}

export function disiplinRang(d: string) {
  const i = DISIPLINER.indexOf(d);
  return i < 0 ? DISIPLINER.length : i;
}

export function grupperEtterDisiplin<T extends { disiplin: string }>(loyper: T[]) {
  const grupper = new Map<string, T[]>();
  for (const l of loyper) grupper.set(l.disiplin, [...(grupper.get(l.disiplin) ?? []), l]);
  return [...grupper.entries()]
    .sort(([a], [b]) => disiplinRang(a) - disiplinRang(b) || a.localeCompare(b))
    .map(([disiplin, loyper]) => ({ disiplin, loyper }));
}

/** Det klienten trenger om hver løype (uten geometri og GPX-tekst). */
export type LoypeInfo = Pick<KatalogLoype, 'slug' | 'navn' | 'disiplin' | 'farge' | 'stiplet' | 'vises' | 'gpx' | 'lastNedSom' | 'lengde' | 'rundlop'>;

export const tilInfo = ({ slug, navn, disiplin, farge, stiplet, vises, gpx, lastNedSom, lengde, rundlop }: KatalogLoype): LoypeInfo => ({
  slug,
  navn,
  disiplin,
  farge,
  stiplet,
  vises,
  gpx,
  lastNedSom,
  lengde,
  rundlop,
});

/** Én GeoJSON med alle løypene, til oversiktskartet. */
export function tilGeoJson(loyper: KatalogLoype[]) {
  return {
    type: 'FeatureCollection' as const,
    features: loyper.map((l) => ({
      type: 'Feature' as const,
      id: loyper.indexOf(l),
      properties: { slug: l.slug, navn: l.navn, disiplin: l.disiplin, farge: l.farge, stiplet: l.stiplet, lengde: Math.round(l.lengde) },
      geometry: { type: 'LineString' as const, coordinates: l.coords },
    })),
  };
}
