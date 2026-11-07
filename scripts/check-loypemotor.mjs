// Selvsjekk for løypemotoren (src/features/loypekart/motor). Kjør med: node scripts/check-loypemotor.mjs
// (Node 22.18+ kjører .ts direkte ved å fjerne typene.) Uten nett: høydeprofilen bygges uten DEM.
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { parseGpx, buildRoute, along } from '../src/features/loypekart/motor/rute.ts';
import { buildProfile, terrarium, demFliser } from '../src/features/loypekart/motor/hoyde.ts';
import { buildEvents } from '../src/features/loypekart/motor/hendelser.ts';
import { faseTider, followSecFor, ramp, mix } from '../src/features/loypekart/motor/kamera.ts';
import { loyper } from '../src/features/loypekart/data/loyper.ts';

// Minimal XML-parser for GPX-punkter: nok til <trkpt>/<rtept lat lon>
const regexParser = (tekst) => ({
  getElementsByTagName: (tag) =>
    [...tekst.matchAll(new RegExp(`<${tag}\\b([^>]*)>`, 'g'))].map(([, attr]) => ({
      getAttribute: (navn) => attr.match(new RegExp(`\\b${navn}="([^"]*)"`))?.[1] ?? null,
    })),
});

for (const l of loyper) {
  const tekst = readFileSync(new URL(`../public${l.gpx}`, import.meta.url), 'utf8');
  const raw = parseGpx(tekst, regexParser);
  assert.ok(raw.length > 50, `${l.slug}: for få punkter (${raw.length})`);
  const R = buildRoute(raw, l.gpx.split('/').pop());
  assert.ok(Number.isFinite(R.L) && R.L > 200 && R.L < 20000, `${l.slug}: urimelig lengde ${R.L}`);
  assert.equal(R.cum.length, R.coords.length);
  const [x, y] = along(R, R.L / 2, false);
  assert.ok(x > R.bbox[0] - 1e-9 && x < R.bbox[2] + 1e-9 && y > R.bbox[1] - 1e-9 && y < R.bbox[3] + 1e-9);
  const P = buildProfile(R, null);
  assert.equal(P.has, false);
  const ev = buildEvents(R, P);
  assert.deepEqual(ev.map((e) => e.kind), ['split', 'split', 'finish']);
  assert.ok(demFliser(R.bbox, 15).length >= 1);
  console.log(`${l.slug.padEnd(16)} ${(R.L / 1000).toFixed(2)} km  ${R.coords.length} punkter  ${R.isLoop ? 'rundløype' : 'A–B'}  disiplin fra filnavn: ${R.disc}`);
}

// Rød lang er den lengste XCO-runden; prototypen viste den som rundløype
{
  const tekst = readFileSync(new URL('../public/gpx/rod-lang-xco.gpx', import.meta.url), 'utf8');
  const R = buildRoute(parseGpx(tekst, regexParser), 'rod-lang-xco.gpx');
  assert.ok(R.L > 3000 && R.L < 8000, `rød lang: ${R.L}`);
  assert.equal(R.isLoop, true);
  assert.equal(R.disc, 'XCO');
}

assert.equal(terrarium(128, 0, 0), 0);
assert.equal(ramp(0), 0);
assert.ok(Math.abs(ramp(1) - 1) < 1e-12);
assert.ok(Math.abs(ramp(0.5) - 0.5) < 1e-12);
assert.equal(mix({ center: [0, 0], zoom: 0, bearing: 170, pitch: 0 }, { center: [2, 2], zoom: 2, bearing: -170, pitch: 2 }, 0.5).bearing, 180);
const T = faseTider(followSecFor(4000));
assert.ok(T.T1 < T.T2 && T.T2 < T.T3 && T.T3 < T.T4);

console.log('Løypemotoren: alle sjekker OK');
