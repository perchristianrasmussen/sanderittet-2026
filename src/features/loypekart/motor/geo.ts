// Ren geometri og formatering. Koordinater er [lng, lat].

export type LngLat = [number, number];

export const toRad = Math.PI / 180;
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
export const easeIO = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const angDiff = (a: number, b: number) => ((b - a + 540) % 360) - 180;
export const fmtKm = (m: number) => (m / 1000).toFixed(2).replace('.', ',');
export const fmtInt = (v: number) => (Number.isFinite(v) ? String(Math.round(v)) : '–');

export function hav(a: LngLat, b: LngLat) {
  const dLat = (b[1] - a[1]) * toRad,
    dLon = (b[0] - a[0]) * toRad;
  const s = Math.sin(dLat / 2) ** 2 + Math.cos(a[1] * toRad) * Math.cos(b[1] * toRad) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371008.8 * Math.asin(Math.sqrt(s));
}

export function bearingDeg(a: LngLat, b: LngLat) {
  const p1 = a[1] * toRad,
    p2 = b[1] * toRad,
    dl = (b[0] - a[0]) * toRad;
  const y = Math.sin(dl) * Math.cos(p2);
  const x = Math.cos(p1) * Math.sin(p2) - Math.sin(p1) * Math.cos(p2) * Math.cos(dl);
  return Math.atan2(y, x) / toRad;
}

// Brøkdels flisposisjon i Web Mercator
export function tileXY(lng: number, lat: number, z: number): [number, number] {
  const n = 2 ** z,
    r = lat * toRad;
  return [((lng + 180) / 360) * n, ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * n];
}
