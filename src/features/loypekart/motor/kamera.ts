// Kamerakoreografi: intro → overgang → følg → outro. Rene funksjoner av tid og rute.
import { CFG } from './konfig.ts';
import { angDiff, bearingDeg, easeIO, lerp, type LngLat } from './geo.ts';
import { along, type Rute } from './rute.ts';

export interface Kamera {
  center: LngLat;
  zoom: number;
  bearing: number;
  pitch: number;
}

export interface Oversikt {
  center: LngLat;
  zoom: number;
}

export type Fase = 'loading' | 'intro' | 'trans' | 'follow' | 'outro' | 'done';

export interface FaseTider {
  T1: number;
  T2: number;
  T3: number;
  T4: number;
}

export function faseTider(followSec: number): FaseTider {
  const T1 = CFG.introSec,
    T2 = T1 + CFG.transSec,
    T3 = T2 + followSec,
    T4 = T3 + CFG.outroSec;
  return { T1, T2, T3, T4 };
}

export const followSecFor = (L: number) => Math.min(90, Math.max(18, L / CFG.metersPerSec));

// Myk akselerasjon i start og slutt
export function ramp(u: number) {
  const a = 0.05,
    v = 1 / (1 - a);
  if (u < a) return (v * u * u) / (2 * a);
  if (u > 1 - a) return 1 - (v * (1 - u) ** 2) / (2 * a);
  return v * (u - a / 2);
}

export function introCam(ov: Oversikt, u: number): Kamera {
  const e = easeIO(u);
  return { center: ov.center, zoom: ov.zoom - 0.15 + 0.4 * e, bearing: -40 + 55 * u, pitch: 18 + 40 * e };
}

// Skyv løypa ned i bildet så oppsummeringen øverst ikke dekker den
export function outroCam(ov: Oversikt, R: Rute): Kamera {
  const dy = (R.bbox[3] - R.bbox[1]) * 0.16;
  return { center: [ov.center[0], ov.center[1] + dy], zoom: ov.zoom - 0.3, bearing: 0, pitch: 38 };
}

export function targetBearing(R: Rute, d: number) {
  return bearingDeg(along(R, d - 25, true), along(R, d + 90, true));
}

export function followCam(R: Rute, d: number, bear: number): Kamera {
  return { center: along(R, d, false), zoom: CFG.followZoom, bearing: bear, pitch: CFG.followPitch };
}

export function mix(a: Kamera, b: Kamera, u: number): Kamera {
  return {
    center: [lerp(a.center[0], b.center[0], u), lerp(a.center[1], b.center[1], u)],
    zoom: lerp(a.zoom, b.zoom, u),
    bearing: a.bearing + angDiff(a.bearing, b.bearing) * u,
    pitch: lerp(a.pitch, b.pitch, u),
  };
}
