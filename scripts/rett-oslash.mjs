// Barlow Condensed (500–800, rett) har for bred fremføring på Ø og ø, så det blir et hull etter
// bokstaven («ARRANGØ R»). Skriptet lager en kopi av latin-filen fra @fontsource der Ø/ø får
// samme fremføring som O/o. Konturene røres ikke. global.css bruker filene bare for U+D8 og U+F8.
// Kjør med: node scripts/rett-oslash.mjs
import fs from 'node:fs';
import zlib from 'node:zlib';
import { create } from 'fontkitten';

const VEKTER = [500, 600, 700, 800];
const KILDE = 'node_modules/@fontsource/barlow-condensed/files';
const MAL = 'src/assets/fonts';

const sjekksum = (buf) => {
  let sum = 0;
  const p = Buffer.alloc(Math.ceil(buf.length / 4) * 4);
  buf.copy(p);
  for (let i = 0; i < p.length; i += 4) sum = (sum + p.readUInt32BE(i)) >>> 0;
  return sum;
};

function lesWoff(woff) {
  const flavor = woff.readUInt32BE(4);
  const antall = woff.readUInt16BE(12);
  const tabeller = [];
  for (let i = 0; i < antall; i++) {
    const d = 44 + i * 20;
    const tag = woff.toString('latin1', d, d + 4);
    const off = woff.readUInt32BE(d + 4);
    const komp = woff.readUInt32BE(d + 8);
    const orig = woff.readUInt32BE(d + 12);
    const rå = woff.subarray(off, off + komp);
    tabeller.push({ tag, data: komp < orig ? zlib.inflateSync(rå) : Buffer.from(rå) });
  }
  return { flavor, tabeller };
}

function skrivWoff({ flavor, tabeller }) {
  tabeller.sort((a, b) => (a.tag < b.tag ? -1 : 1));
  const head = tabeller.find((t) => t.tag === 'head').data;
  head.writeUInt32BE(0, 8);

  // checkSumAdjustment regnes over hele sfnt-fila
  const n = tabeller.length;
  const sfntHode = Buffer.alloc(12 + n * 16);
  const es = Math.floor(Math.log2(n));
  sfntHode.writeUInt32BE(flavor, 0);
  sfntHode.writeUInt16BE(n, 4);
  sfntHode.writeUInt16BE(2 ** es * 16, 6);
  sfntHode.writeUInt16BE(es, 8);
  sfntHode.writeUInt16BE(n * 16 - 2 ** es * 16, 10);
  let sfntOff = sfntHode.length;
  tabeller.forEach((t, i) => {
    t.sum = sjekksum(t.data);
    sfntHode.write(t.tag, 12 + i * 16, 'latin1');
    sfntHode.writeUInt32BE(t.sum, 16 + i * 16);
    sfntHode.writeUInt32BE(sfntOff, 20 + i * 16);
    sfntHode.writeUInt32BE(t.data.length, 24 + i * 16);
    sfntOff += Math.ceil(t.data.length / 4) * 4;
  });
  const total = tabeller.reduce((s, t) => (s + t.sum) >>> 0, sjekksum(sfntHode));
  head.writeUInt32BE((0xb1b0afba - total) >>> 0, 8);
  tabeller.find((t) => t.tag === 'head').sum = sjekksum(head);

  const deler = [];
  let off = 44 + n * 20;
  const dir = Buffer.alloc(n * 20);
  tabeller.forEach((t, i) => {
    const z = zlib.deflateSync(t.data, { level: 9 });
    const data = z.length < t.data.length ? z : t.data;
    dir.write(t.tag, i * 20, 'latin1');
    dir.writeUInt32BE(off, i * 20 + 4);
    dir.writeUInt32BE(data.length, i * 20 + 8);
    dir.writeUInt32BE(t.data.length, i * 20 + 12);
    dir.writeUInt32BE(t.sum, i * 20 + 16);
    const pad = Buffer.alloc(Math.ceil(data.length / 4) * 4 - data.length);
    deler.push(data, pad);
    off += data.length + pad.length;
  });
  const hode = Buffer.alloc(44);
  hode.write('wOFF', 0, 'latin1');
  hode.writeUInt32BE(flavor, 4);
  hode.writeUInt32BE(off, 8);
  hode.writeUInt16BE(n, 12);
  hode.writeUInt32BE(sfntOff, 16);
  hode.writeUInt16BE(1, 20);
  return Buffer.concat([hode, dir, ...deler]);
}

fs.mkdirSync(MAL, { recursive: true });
for (const vekt of VEKTER) {
  const kilde = fs.readFileSync(`${KILDE}/barlow-condensed-latin-${vekt}-normal.woff`);
  const font = create(kilde);
  const glyf = (ch) => font.glyphForCodePoint(ch.codePointAt(0));
  const woff = lesWoff(kilde);
  const hmtx = woff.tabeller.find((t) => t.tag === 'hmtx').data;
  const antallMetrikker = woff.tabeller.find((t) => t.tag === 'hhea').data.readUInt16BE(34);

  for (const [skjev, mal] of [['Ø', 'O'], ['ø', 'o']]) {
    const id = glyf(skjev).id;
    if (id >= antallMetrikker) throw new Error(`${skjev} mangler egen fremføring i ${vekt}`);
    const før = hmtx.readUInt16BE(id * 4);
    hmtx.writeUInt16BE(glyf(mal).advanceWidth, id * 4);
    console.log(`${vekt} ${skjev}: ${før} -> ${glyf(mal).advanceWidth}`);
  }
  fs.writeFileSync(`${MAL}/barlow-condensed-oslash-${vekt}.woff`, skrivWoff(woff));
}
