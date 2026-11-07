// Faste klubbfakta fra PRODUCT.md (Operating Context) og den gamle forsiden.

export const spondUrl = 'https://group.spond.com/OXGYJ';
export const epost = 'leder.sykkel@sandesk.no';
export const moderklubbUrl = 'https://sandesk.no/grupper/sykkel/';

export const adresse = {
  navn: 'Lersbrygga Idrettsanlegg',
  vei: 'Lersbryggveien',
  poststed: '3070 Sande i Vestfold',
};

// Arenakartet i Google My Maps (løyper, parkering og fasiliteter)
export const arenakart = {
  embed: 'https://www.google.com/maps/d/embed?mid=1datrdzmdxW2jajR8Jm-aCLSSoBuVZIQ&ll=59.56487205617529%2C10.255352623532689&z=16',
  apne: 'https://www.google.com/maps/d/viewer?mid=1datrdzmdxW2jajR8Jm-aCLSSoBuVZIQ&ll=59.56487205617529%2C10.255352623532689&z=17',
};

// Løypene med GPX (PRODUCT.md, Capabilities). Fargene følger aldersklasser.
export const loyper: { navn: string; disiplin: 'XCO' | 'XCC' }[] = [
  { navn: 'Rød lang', disiplin: 'XCO' },
  { navn: 'Rød kort', disiplin: 'XCO' },
  { navn: 'Blå', disiplin: 'XCO' },
  { navn: 'Grønn', disiplin: 'XCO' },
  { navn: 'Kortbane', disiplin: 'XCC' },
  { navn: 'Grønn kort', disiplin: 'XCC' },
  { navn: 'XCC kort', disiplin: 'XCC' },
];

// Arrangementer klubben har hatt på Lersbrygga
export const arrangementer = [
  { ar: '2024', navn: 'Norgescup' },
  { ar: '2025', navn: 'Norgescup' },
  { ar: '2026', navn: 'NM terreng' },
];
