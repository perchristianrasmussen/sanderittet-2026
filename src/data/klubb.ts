// Faste klubbfakta fra PRODUCT.md (Operating Context) og den gamle forsiden.

export const spondUrl = 'https://group.spond.com/OXGYJ';
export const epost = 'leder.sykkel@sandesk.no';
export const moderklubbUrl = 'https://sandesk.no/grupper/sykkel/';

export const adresse = {
  navn: 'Lersbrygga Idrettsanlegg',
  vei: 'Lersbryggveien',
  poststed: '3070 Sande i Vestfold',
};

// Arenakartet i Google My Maps (løyper, parkering og fasiliteter). Lenkes, bygges ikke inn.
export const arenakart = {
  apne: 'https://www.google.com/maps/d/viewer?mid=1datrdzmdxW2jajR8Jm-aCLSSoBuVZIQ&ll=59.56487205617529%2C10.255352623532689&z=17',
};

// Løypene ligger i src/features/loypekart/data/ (GPX-filer + indeks), se data/katalog.ts.

// Arrangementer klubben har hatt på Lersbrygga
export const arrangementer = [
  { ar: '2024', navn: 'Norgescup' },
  { ar: '2025', navn: 'Norgescup' },
  { ar: '2026', navn: 'NM terreng' },
];
