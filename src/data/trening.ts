import type { Treningsplan } from '../lib/nesteTrening.ts';

// Treningstider fra PRODUCT.md (Operating Context). Sesong: fra påske til høstferie.
export const sted = 'Lersbrygga Idrettsanlegg';

export const treningsplan: Treningsplan = {
  okter: [
    { ukedag: 1, gruppe: 'Opptil 10 år', start: '18:00', slutt: '19:00' },
    { ukedag: 1, gruppe: 'Over 10 år', start: '18:00', slutt: '19:30' },
    { ukedag: 4, gruppe: '11 år og eldre', start: '18:00', slutt: '19:30' },
  ],
  // Første dag i høstferien per år ("YYYY-MM-DD"). Siste trening er før denne datoen.
  // TODO: bekreft med klubben hvert år.
  hostferie: {},
  // Uten oppføring over brukes mandag i ISO-uke 41 (Vestfold har som regel høstferie i uke 40 eller 41).
  hostferieUke: 41,
};
