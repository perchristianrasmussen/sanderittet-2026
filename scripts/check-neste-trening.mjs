// Selvsjekk for nesteTrening. Kjør med: node scripts/check-neste-trening.mjs
// (Node 22.18+ kjører .ts direkte ved å fjerne typene.)
import assert from 'node:assert/strict';
import { nesteTrening, paskedag } from '../src/lib/nesteTrening.ts';
import { treningsplan } from '../src/data/trening.ts';

const dato = (dag) => new Date(dag * 86_400_000).toISOString().slice(0, 10);

const tilfeller = [
  // [beskrivelse, tidspunkt, forventet]
  ['høst 2026, etter høstferien', '2026-11-07T12:00:00+01:00', { state: 'utenfor-sesong', label: 'Sesongen starter', value: 'I påsken', datetime: '2027-04-01T18:00+02:00' }],
  ['1. påskedag 2027', '2027-03-28T12:00:00+02:00', { state: 'utenfor-sesong', value: 'I påsken', datetime: '2027-04-01T18:00+02:00' }],
  ['2. påskedag 2027 (fri)', '2027-03-29T17:00:00+02:00', { state: 'utenfor-sesong', datetime: '2027-04-01T18:00+02:00' }],
  ['tirsdag etter påske 2027', '2027-03-30T12:00:00+02:00', { state: 'neste', label: 'Neste trening', value: 'Tor 18:00', datetime: '2027-04-01T18:00+02:00' }],
  ['mandag i juni kl. 17', '2027-06-07T17:00:00+02:00', { state: 'i-dag', label: 'Trening i dag', value: '18:00', datetime: '2027-06-07T18:00+02:00' }],
  ['mandag i juni kl. 19:15, eldste gruppe trener fortsatt', '2027-06-07T19:15:00+02:00', { state: 'i-dag', value: '18:00' }],
  ['mandag i juni kl. 20', '2027-06-07T20:00:00+02:00', { state: 'neste', value: 'Tor 18:00', datetime: '2027-06-10T18:00+02:00' }],
  ['torsdag i juni kl. 20', '2027-06-10T20:00:00+02:00', { state: 'neste', value: 'Man 18:00', datetime: '2027-06-14T18:00+02:00' }],
  ['siste torsdag før høstferien (uke 40) etter trening', '2027-10-07T20:00:00+02:00', { state: 'utenfor-sesong', datetime: '2028-04-20T18:00+02:00' }],
  ['mandag i høstferien (uke 41)', '2027-10-11T12:00:00+02:00', { state: 'utenfor-sesong' }],
  ['nyttårsaften', '2026-12-31T23:30:00+01:00', { state: 'utenfor-sesong', datetime: '2027-04-01T18:00+02:00' }],
];

// Kjente påskedager som kontroll av computus.
assert.equal(dato(paskedag(2026)), '2026-04-05');
assert.equal(dato(paskedag(2027)), '2027-03-28');
assert.equal(dato(paskedag(2028)), '2028-04-16');

let feil = 0;
for (const [navn, tid, forventet] of tilfeller) {
  const svar = nesteTrening(new Date(tid), treningsplan);
  try {
    for (const [k, v] of Object.entries(forventet)) assert.equal(svar[k], v, `${k}`);
    console.log(`ok   ${navn}: ${svar.label} · ${svar.value} (${svar.datetime})`);
  } catch (e) {
    feil++;
    console.log(`FEIL ${navn}: ${e.message}\n     fikk ${JSON.stringify(svar)}`);
  }
}
if (feil) process.exit(1);
console.log(`\nAlle ${tilfeller.length} tilfeller ok.`);
