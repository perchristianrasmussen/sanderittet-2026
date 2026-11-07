// NM i terrengsykling 2026 på Lersbrygga, avholdt 30.–31. mai 2026.
// Kilde: legacy/nm2026.html og invitasjonen (v1, 3. april 2026). Resultater og deltakertall har vi ikke,
// så de står ikke her (PRODUCT.md, Evidence on Hand).

export const invitasjonUrl = 'https://drive.google.com/file/d/1ROUsRI9xlxgzTTwUijPoVmWZvspv5Kf3/view';

export type Programpunkt = { tid: string; tekst: string; type: 'start' | 'premie' | 'mote' | 'info' };

export const program: { dag: string; dato: string; disiplin: string; navn: string; punkter: Programpunkt[] }[] = [
  {
    dag: 'Lørdag',
    dato: '2026-05-30',
    disiplin: 'XCO',
    navn: 'Rundbane',
    punkter: [
      { tid: '08:00', tekst: 'Sekretariatet åpner', type: 'info' },
      { tid: '08:30', tekst: 'Rekruttklasser K/M 6–10 år', type: 'start' },
      { tid: '08:50', tekst: 'Lagledermøte K/M 6–12 år, K/M 13–14 og M 15–16', type: 'mote' },
      { tid: '09:10', tekst: 'K/M 11–12 år', type: 'start' },
      { tid: '10:30', tekst: 'K/M 13–14 år, rød kort løype', type: 'start' },
      { tid: '11:00', tekst: 'Premieutdeling 6–12 år', type: 'premie' },
      { tid: '11:30', tekst: 'Lagledermøte K 15–16, K/M junior og elite, master', type: 'mote' },
      { tid: '12:00', tekst: 'M 15–16 år', type: 'start' },
      { tid: '13:15', tekst: 'NM kvinner elite og junior', type: 'start' },
      { tid: '13:15', tekst: 'K 15–16, K master og K sport', type: 'start' },
      { tid: '13:15', tekst: 'Premieutdeling 13–16 år', type: 'premie' },
      { tid: '15:00', tekst: 'Premieutdeling NM kvinner elite og junior', type: 'premie' },
      { tid: '15:00', tekst: 'NM menn elite/U23 og junior', type: 'start' },
      { tid: '16:45', tekst: 'M master og M sport', type: 'start' },
      { tid: '17:00', tekst: 'Premieutdeling NM menn elite og junior', type: 'premie' },
      { tid: '18:00', tekst: 'Premieutdeling M master', type: 'premie' },
    ],
  },
  {
    dag: 'Søndag',
    dato: '2026-05-31',
    disiplin: 'XCC',
    navn: 'Kortbane',
    punkter: [
      { tid: '08:00', tekst: 'Sekretariatet åpner', type: 'info' },
      { tid: '08:45', tekst: 'Lagledermøte K/M 6–12 år', type: 'mote' },
      { tid: '09:00', tekst: 'Rekruttklasser K/M 6–10 år', type: 'start' },
      { tid: '10:00', tekst: 'K/M 11–12 år', type: 'start' },
      { tid: '10:00', tekst: 'Premieutdeling 6–10 år', type: 'premie' },
      { tid: '10:30', tekst: 'K/M 13–14 år', type: 'start' },
      { tid: '11:20', tekst: 'Lagledermøte K/M 13–16, junior, master og elite', type: 'mote' },
      { tid: '11:40', tekst: 'Premieutdeling 11–14 år', type: 'premie' },
      { tid: '11:45', tekst: 'M 15–16 år', type: 'start' },
      { tid: '12:45', tekst: 'NM kvinner elite/U23', type: 'start' },
      { tid: '12:50', tekst: 'Premieutdeling M 15–16', type: 'premie' },
      { tid: '13:15', tekst: 'K junior, K 15–16, K master og K sport', type: 'start' },
      { tid: '14:00', tekst: 'NM menn elite', type: 'start' },
      { tid: '14:00', tekst: 'Premieutdeling K junior', type: 'premie' },
      { tid: '14:30', tekst: 'M junior', type: 'start' },
      { tid: '15:00', tekst: 'M master og M sport', type: 'start' },
      { tid: '15:10', tekst: 'Premieutdeling M elite og junior', type: 'premie' },
      { tid: '15:40', tekst: 'Premieutdeling M master', type: 'premie' },
    ],
  },
];
