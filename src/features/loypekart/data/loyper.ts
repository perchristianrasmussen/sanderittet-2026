// Indeksen over klubbens løyper. GPX-filene ligger i data/gpx/.
//
// Ny løype: legg GPX-filen i data/gpx/ og en linje her. Slugen er filnavnet med små bokstaver,
// æ/ø/å som ae/o/a og bindestrek i stedet for mellomrom («Rød Lang XCO.gpx» → «rod-lang-xco»).
// En fil som mangler her, vises likevel (grå, navn fra filnavnet), og bygget skriver en advarsel.
// En linje uten fil, en ødelagt fil eller to filer med samme slug stopper bygget.
//
// farge: start | green | blue | red | orange | shortcut (tokens.css, --route-*). Følger aldersklasser.
// stiplet: skiller to løyper med samme farge. vises: false = av når kartet åpnes. skjult: true = ikke på siden.
import type { LoypeOppforing } from '../motor/katalog.ts';

export const oppforinger: LoypeOppforing[] = [
  { slug: 'rod-lang-xco', navn: 'Rød lang', disiplin: 'XCO', farge: 'red' },
  { slug: 'rod-kort-xco', navn: 'Rød kort', disiplin: 'XCO', farge: 'red', stiplet: true },
  { slug: 'bla-xco', navn: 'Blå', disiplin: 'XCO', farge: 'blue' },
  { slug: 'gronn-xco', navn: 'Grønn', disiplin: 'XCO', farge: 'green' },
  { slug: 'kortbane-xcc', navn: 'Kortbane', disiplin: 'XCC', farge: 'orange' },
  { slug: 'gronn-kort-xcc', navn: 'Grønn kort', disiplin: 'XCC', farge: 'green', stiplet: true },
  { slug: 'xcc-kort', navn: 'XCC kort', disiplin: 'XCC', farge: 'start' },
];

/** Løypa laben og presentasjonen viser når ingen er valgt */
export const standardSlug = 'rod-lang-xco';
