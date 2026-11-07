// GPX til rutemodell. XML-parseren sendes inn, så modulen kan kjøres uten DOM.
import { clamp, hav, lerp, type LngLat } from './geo.ts';

export interface XmlElement {
  getAttribute(navn: string): string | null;
}
export interface XmlDokument {
  getElementsByTagName(tag: string): ArrayLike<XmlElement>;
}
export type XmlParser = (tekst: string) => XmlDokument;

export type BBox = [number, number, number, number];

export interface Rute {
  coords: LngLat[];
  cum: number[];
  L: number;
  bbox: BBox;
  isLoop: boolean;
  disc: string;
  name: string;
}

export function parseGpx(text: string, parse: XmlParser): LngLat[] {
  const xml = parse(text);
  let pts = Array.from(xml.getElementsByTagName('trkpt'));
  if (!pts.length) pts = Array.from(xml.getElementsByTagName('rtept'));
  return pts
    .map((p): LngLat => [parseFloat(p.getAttribute('lon') ?? ''), parseFloat(p.getAttribute('lat') ?? '')])
    .filter((c) => Number.isFinite(c[0]) && Number.isFinite(c[1]));
}

export function buildRoute(raw: LngLat[], fileName: string): Rute {
  const coords = [raw[0]];
  for (const p of raw.slice(1)) if (hav(coords[coords.length - 1], p) > 0.5) coords.push(p);
  const cum = [0];
  for (let i = 1; i < coords.length; i++) cum.push(cum[i - 1] + hav(coords[i - 1], coords[i]));
  const L = cum[cum.length - 1];
  let bbox: BBox = [Infinity, Infinity, -Infinity, -Infinity];
  for (const [x, y] of coords) bbox = [Math.min(bbox[0], x), Math.min(bbox[1], y), Math.max(bbox[2], x), Math.max(bbox[3], y)];

  // Navn og disiplin fra filnavnet
  const base = fileName.replace(/\.gpx$/i, '').replace(/[_-]+/g, ' ').trim();
  const m = base.match(/\b(XCO|XCC|XCM|XCE|XC|DHI|DH|ENDURO|EDR)\b/i);
  const disc = m ? m[1].toUpperCase() : 'MTB';
  const name = (m ? base.replace(m[0], '') : base).replace(/\s+/g, ' ').trim() || base;

  return { coords, cum, L, bbox, isLoop: hav(coords[0], coords[coords.length - 1]) < 40, disc, name };
}

// Punkt d meter langs ruta. wrap gjelder bare rundløyper.
export function along(R: Rute, d: number, wrap: boolean): LngLat {
  const { coords, cum, L } = R;
  d = wrap && R.isLoop ? ((d % L) + L) % L : clamp(d, 0, L);
  let lo = 0,
    hi = cum.length - 1;
  while (hi - lo > 1) {
    const m = (lo + hi) >> 1;
    if (cum[m] <= d) lo = m;
    else hi = m;
  }
  const t = (d - cum[lo]) / (cum[hi] - cum[lo] || 1);
  return [lerp(coords[lo][0], coords[hi][0], t), lerp(coords[lo][1], coords[hi][1], t)];
}
