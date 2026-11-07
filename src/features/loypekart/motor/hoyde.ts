// Høydedata: dekoding av Terrarium-fliser og høydeprofil. Hentingen av fliser ligger i kart/dem.ts.
import { clamp, lerp, tileXY } from './geo.ts';
import { along, type BBox, type Rute } from './rute.ts';

/** Pikseldata (RGBA, 256×256) per flis, nøkkel "x/y". */
export interface Dem {
  z: number;
  tiles: Map<string, ArrayLike<number>>;
}

export interface Profil {
  step: number;
  d: number[];
  e: number[];
  has: boolean;
  climb: number;
  min: number;
  max: number;
  maxD: number;
  steep: number;
  steepD: number;
}

// Flisene som dekker bbox med en liten marg
export function demFliser(bbox: BBox, z: number) {
  const pad = 3 / 256;
  const [x0, y0] = tileXY(bbox[0], bbox[3], z),
    [x1, y1] = tileXY(bbox[2], bbox[1], z);
  const fliser: { x: number; y: number }[] = [];
  for (let x = Math.floor(x0 - pad); x <= Math.floor(x1 + pad); x++)
    for (let y = Math.floor(y0 - pad); y <= Math.floor(y1 + pad); y++) fliser.push({ x, y });
  return fliser;
}

export const terrarium = (r: number, g: number, b: number) => r * 256 + g + b / 256 - 32768;

// Bilineær høyde fra fliser
export function elevAt(dem: Dem, lng: number, lat: number) {
  const [fx, fy] = tileXY(lng, lat, dem.z);
  const gx = fx * 256 - 0.5,
    gy = fy * 256 - 0.5,
    ix = Math.floor(gx),
    iy = Math.floor(gy),
    tx = gx - ix,
    ty = gy - iy;
  const s = (px: number, py: number) => {
    const tX = Math.floor(px / 256),
      tY = Math.floor(py / 256),
      d = dem.tiles.get(tX + '/' + tY);
    if (!d) return NaN;
    const i = ((py - tY * 256) * 256 + (px - tX * 256)) * 4;
    return terrarium(d[i], d[i + 1], d[i + 2]);
  };
  return lerp(lerp(s(ix, iy), s(ix + 1, iy), tx), lerp(s(ix, iy + 1), s(ix + 1, iy + 1), tx), ty);
}

export function buildProfile(R: Rute, dem: Dem | null): Profil {
  const step = 5,
    n = Math.max(2, Math.ceil(R.L / step) + 1);
  const d: number[] = [],
    e: number[] = [];
  for (let i = 0; i < n; i++) {
    const di = Math.min(R.L, i * step);
    d.push(di);
    const p = along(R, di, false);
    e.push(dem ? elevAt(dem, p[0], p[1]) : NaN);
  }
  const has = e.every(Number.isFinite);
  let s = e.slice();
  // Glatting: to pass med glidende snitt
  if (has)
    for (let pass = 0; pass < 2; pass++) {
      const w = 4,
        o: number[] = [];
      for (let i = 0; i < n; i++) {
        let sum = 0,
          c = 0;
        for (let j = Math.max(0, i - w); j <= Math.min(n - 1, i + w); j++) {
          sum += s[j];
          c++;
        }
        o.push(sum / c);
      }
      s = o;
    }
  let climb = 0,
    min = Infinity,
    max = -Infinity,
    maxI = 0,
    steep = 0,
    steepD = 0;
  if (has) {
    for (let i = 0; i < n; i++) {
      if (i) climb += Math.max(0, s[i] - s[i - 1]);
      if (s[i] < min) min = s[i];
      if (s[i] > max) {
        max = s[i];
        maxI = i;
      }
      const j = i + 10;
      if (j < n) {
        const g = ((s[j] - s[i]) / (d[j] - d[i])) * 100;
        if (g > steep) {
          steep = g;
          steepD = d[i + 5];
        }
      }
    }
  }
  return { step, d, e: s, has, climb, min, max, maxD: d[maxI], steep, steepD };
}

export function eleAt(P: Profil, R: Rute, dist: number) {
  if (!P.has) return NaN;
  const f = clamp(dist, 0, R.L) / P.step,
    i = Math.min(P.e.length - 2, Math.floor(f));
  return lerp(P.e[i], P.e[i + 1], clamp(f - i, 0, 1));
}

export function gradAt(P: Profil, R: Rute, dist: number) {
  if (!P.has) return NaN;
  const a = clamp(dist - 15, 0, R.L),
    b = clamp(dist + 15, 0, R.L);
  return b > a ? ((eleAt(P, R, b) - eleAt(P, R, a)) / (b - a)) * 100 : 0;
}
