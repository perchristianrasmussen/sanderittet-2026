// Sanderittet: klubbens årlige ritt på Lersbrygga. sandesykkel.no/sanderittet er rittets faste adresse,
// og sanderittet.no videresendes hit (PRODUCT.md). Oppdater `nesteRitt` når neste ritt er bestemt;
// til da viser siden at informasjonen kommer, uten å gjette dato.

export interface NesteRitt {
  ar: number;
  /** Første rittdag, "YYYY-MM-DD" */
  dato: string;
  /** Visningstekst for datoen, f.eks. "Lørdag 30. mai" */
  datoTekst: string;
  /** Påmeldingslenke (EQ Timing) når påmeldingen er åpen */
  pamelding?: string;
}

export const nesteRitt: NesteRitt | null = null;

// Tidligere ritt med egen side
export const tidligereRitt = [{ ar: 2026, navn: 'NM i terrengsykling', href: '/nm2026' }];
