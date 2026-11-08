// Sanderittet: klubbens årlige ritt på Lersbrygga. sandesykkel.no/sanderittet er rittets faste adresse,
// og sanderittet.no videresendes hit (PRODUCT.md). Oppdater `nesteRitt` når neste ritt er bestemt;
// til da viser siden at informasjonen kommer, uten å gjette dato.

export interface NesteRitt {
  ar: number;
  /** Første rittdag, "YYYY-MM-DD" */
  dato: string;
  /** Siste rittdag for ritt over flere dager, "YYYY-MM-DD" */
  sluttdato?: string;
  /** Visningstekst for datoen, f.eks. "24.–25. april" */
  datoTekst: string;
  /** Påmeldingslenke (EQ Timing) når påmeldingen er åpen */
  pamelding?: string;
}

export const nesteRitt: NesteRitt | null = {
  ar: 2027,
  dato: '2027-04-24',
  sluttdato: '2027-04-25',
  datoTekst: '24.–25. april',
};

// Tidligere ritt med egen side
export const tidligereRitt = [{ ar: 2026, navn: 'NM i terrengsykling', href: '/nm2026' }];
