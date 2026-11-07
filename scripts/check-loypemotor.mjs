// Selvsjekk for løypemotoren og -katalogen (src/features/loypekart). Kjør med: node scripts/check-loypemotor.mjs
// (Node 22.18+ kjører .ts direkte ved å fjerne typene.) Uten nett: høydeprofilen bygges uten DEM.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { parseGpx, buildRoute, along, xmlUtenDom } from '../src/features/loypekart/motor/rute.ts';
import { buildProfile, terrarium, demFliser } from '../src/features/loypekart/motor/hoyde.ts';
import { buildEvents } from '../src/features/loypekart/motor/hendelser.ts';
import { faseTider, followSecFor, ramp, mix } from '../src/features/loypekart/motor/kamera.ts';
import { byggKatalog, grupperEtterDisiplin, slugify, tilGeoJson } from '../src/features/loypekart/motor/katalog.ts';
import { oppforinger } from '../src/features/loypekart/data/loyper.ts';

const gpxMappe = new URL('../src/features/loypekart/data/gpx/', import.meta.url);
const filer = readdirSync(gpxMappe)
  .filter((f) => /\.gpx$/i.test(f))
  .map((filnavn) => ({ filnavn, tekst: readFileSync(new URL(filnavn, gpxMappe), 'utf8') }));

// ---------- Katalogen med de ekte filene ----------
const { loyper, advarsler } = byggKatalog(filer, oppforinger);
assert.deepEqual(advarsler, [], 'alle GPX-filer skal stå i indeksen');
assert.equal(loyper.length, oppforinger.filter((o) => !o.skjult).length);

for (const l of loyper) {
  assert.ok(l.coords.length > 50, `${l.slug}: for få punkter (${l.coords.length})`);
  assert.ok(l.lengde > 200 && l.lengde < 20000, `${l.slug}: urimelig lengde ${l.lengde}`);
  const R = buildRoute(parseGpx(l.tekst, xmlUtenDom), `${l.slug}.gpx`);
  const [x, y] = along(R, R.L / 2, false);
  assert.ok(x > R.bbox[0] - 1e-9 && x < R.bbox[2] + 1e-9 && y > R.bbox[1] - 1e-9 && y < R.bbox[3] + 1e-9);
  const P = buildProfile(R, null);
  assert.equal(P.has, false);
  assert.deepEqual(buildEvents(R, P).map((e) => e.kind), ['split', 'split', 'finish']);
  assert.ok(demFliser(R.bbox, 15).length >= 1);
  console.log(`${l.slug.padEnd(16)} ${(l.lengde / 1000).toFixed(2)} km  ${l.coords.length} punkter  ${l.rundlop ? 'rundløype' : 'A–B'}  ${l.disiplin} ${l.farge}${l.stiplet ? ' stiplet' : ''}`);
}

assert.deepEqual(grupperEtterDisiplin(loyper).map((g) => g.disiplin), ['XCO', 'XCC']);
const gj = tilGeoJson(loyper);
assert.equal(gj.features.length, loyper.length);
assert.ok(gj.features.every((f) => f.geometry.coordinates.length >= 10 && f.properties.slug));

// Rød lang er den lengste XCO-runden; prototypen viste den som rundløype
{
  const rod = loyper.find((l) => l.slug === 'rod-lang-xco');
  assert.ok(rod && rod.lengde > 3000 && rod.lengde < 8000, `rød lang: ${rod?.lengde}`);
  assert.equal(rod.rundlop, true);
}

// ---------- Robusthet: nye, manglende og ødelagte filer ----------
assert.equal(slugify('Rød Lang XCO.gpx'), 'rod-lang-xco');
assert.equal(slugify('Grønn kort (XCC).gpx'), 'gronn-kort-xcc');
assert.equal(slugify('Blå løype – ÆØÅ.GPX'), 'bla-loype-aeoa');

const enFil = filer.find((f) => f.filnavn === 'bla-xco.gpx');
{
  // Ny fil som ikke står i indeksen: tas med, grå, navn og disiplin fra filnavnet, og en advarsel
  const k = byggKatalog([...filer, { filnavn: 'Ny Teknikkloype XCO.gpx', tekst: enFil.tekst }], oppforinger);
  const ny = k.loyper.find((l) => l.slug === 'ny-teknikkloype-xco');
  assert.ok(ny);
  assert.equal(ny.navn, 'Ny Teknikkloype');
  assert.equal(ny.disiplin, 'XCO');
  assert.equal(ny.farge, 'ukjent');
  assert.equal(ny.fraIndeks, false);
  assert.equal(ny.gpx, '/gpx/ny-teknikkloype-xco.gpx');
  assert.equal(k.loyper.at(-1), ny, 'nye filer kommer etter indeksens');
  assert.equal(k.advarsler.length, 1);
}
{
  // Skjult i indeksen: ikke med
  const k = byggKatalog(filer, oppforinger.map((o) => (o.slug === 'bla-xco' ? { ...o, skjult: true } : o)));
  assert.ok(!k.loyper.some((l) => l.slug === 'bla-xco'));
}
const feiler = (fn, tekst) => assert.throws(fn, (e) => e.message.includes(tekst), `forventet feil med «${tekst}»`);
feiler(() => byggKatalog(filer, [...oppforinger, { slug: 'finnes-ikke', navn: 'X', disiplin: 'XCO', farge: 'red' }]), 'finnes-ikke');
feiler(() => byggKatalog([...filer, { filnavn: 'tom.gpx', tekst: '<gpx></gpx>' }], oppforinger), 'tom.gpx');
feiler(() => byggKatalog([...filer, { filnavn: 'Bla XCO.gpx', tekst: enFil.tekst }], oppforinger), 'begge slugen «bla-xco»');
feiler(() => byggKatalog(filer, oppforinger.map((o, i) => (i ? o : { ...o, farge: 'lilla' }))), 'lilla');

// ---------- Motoren ----------
assert.equal(terrarium(128, 0, 0), 0);
assert.equal(ramp(0), 0);
assert.ok(Math.abs(ramp(1) - 1) < 1e-12);
assert.ok(Math.abs(ramp(0.5) - 0.5) < 1e-12);
assert.equal(mix({ center: [0, 0], zoom: 0, bearing: 170, pitch: 0 }, { center: [2, 2], zoom: 2, bearing: -170, pitch: 2 }, 0.5).bearing, 180);
const T = faseTider(followSecFor(4000));
assert.ok(T.T1 < T.T2 && T.T2 < T.T3 && T.T3 < T.T4);

console.log('Løypemotoren og katalogen: alle sjekker OK');
