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
  // Sesongregelen (uka etter påske til høstferien i uke 41) er bekreftet av klubben 2026-11-07.
  // Legg inn et år her bare ved unntak.
  hostferie: {},
  // Uten oppføring over brukes mandag i ISO-uke 41.
  hostferieUke: 41,
};

// Hero-banneret følger yngste gruppe, siden det er foreldre til små barn som leser det.
export const yngsteGruppe = 'Opptil 10 år';
