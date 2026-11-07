// Løypekatalogen ved bygg: alle GPX-filer i data/gpx/ slått sammen med indeksen.
// Bare for serverkode (Astro-frontmatter og endepunkter). Klienten får tilInfo()/tilGeoJson().
import { byggKatalog, grupperEtterDisiplin } from '../motor/katalog.ts';
import { oppforinger, standardSlug } from './loyper.ts';

const filer = import.meta.glob<string>('./gpx/*.gpx', { query: '?raw', import: 'default', eager: true });

const katalog = byggKatalog(
  Object.entries(filer).map(([sti, tekst]) => ({ filnavn: sti.split('/').pop()!, tekst })),
  oppforinger,
);
for (const a of katalog.advarsler) console.warn(`[løypekart] ${a}`);

export const loyper = katalog.loyper;
export const loypegrupper = grupperEtterDisiplin(loyper);
export const finnLoype = (slug: string | null | undefined) => loyper.find((l) => l.slug === slug);
export const standardLoype = finnLoype(standardSlug) ?? loyper[0];
