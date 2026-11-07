// Klubbens GPX-filer (kopiert fra legacy/ til public/gpx/). Navnene er lenketekstene på den gamle løypesiden.

export type Disiplin = 'XCO' | 'XCC';

export interface Loype {
  slug: string;
  navn: string;
  disiplin: Disiplin;
  /** Kilde i legacy/ */
  kildefil: string;
  gpx: string;
}

const loype = (slug: string, navn: string, disiplin: Disiplin, kildefil: string): Loype => ({
  slug,
  navn,
  disiplin,
  kildefil,
  gpx: `/gpx/${slug}.gpx`,
});

export const loyper: Loype[] = [
  loype('rod-lang-xco', 'Rød lang', 'XCO', 'Rød Lang XCO.gpx'),
  loype('rod-kort-xco', 'Rød kort', 'XCO', 'Rød kort XCO.gpx'),
  loype('bla-xco', 'Blå løype', 'XCO', 'Blå løype (XCO).gpx'),
  loype('gronn-xco', 'Grønn løype', 'XCO', 'Grønn løype (XCO).gpx'),
  loype('gronn-kort-xcc', 'Grønn kort', 'XCC', 'Grønn kort (XCC).gpx'),
  loype('kortbane-xcc', 'Kortbane', 'XCC', 'Kortbane (XCC).gpx'),
  loype('xcc-kort', 'XCC Kort', 'XCC', 'XCC Kort.gpx'),
];

export const standardLoype = loyper[0];

export const finnLoype = (slug: string | null | undefined) => loyper.find((l) => l.slug === slug);
