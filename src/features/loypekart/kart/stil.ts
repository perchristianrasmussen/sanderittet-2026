// Kartstil: flyfoto, topo, terreng, relieff og løypelagene.
import type { ExpressionSpecification, StyleSpecification } from '@maplibre/maplibre-gl-style-spec';
import { ATTRIBUSJON, CFG, RUTEFARGE, SAT_URL, TERRAIN_URL, TOPO_URL } from '../motor/konfig.ts';
import { clamp } from '../motor/geo.ts';

// Gradient langs linja som er gjennomsiktig etter fremdriften p (0–1)
export function grad(p: number, c0: string, c1: string): ExpressionSpecification {
  const T = 'rgba(0,0,0,0)',
    e = 1e-4;
  p = clamp(p, e, 1);
  if (p >= 1 - 2 * e) return ['interpolate', ['linear'], ['line-progress'], 0, c0, 1, c1];
  return ['interpolate', ['linear'], ['line-progress'], 0, c0, p, c1, p + e, T, 1, T];
}

export function lagStil(): StyleSpecification {
  const rundLinje = { 'line-join': 'round', 'line-cap': 'round' } as const;
  return {
    version: 8,
    sources: {
      sat: { type: 'raster', tileSize: 256, maxzoom: 19, attribution: ATTRIBUSJON.sat, tiles: [SAT_URL] },
      topo: { type: 'raster', tileSize: 256, maxzoom: 18, attribution: ATTRIBUSJON.topo, tiles: [TOPO_URL] },
      dem: { type: 'raster-dem', tiles: [TERRAIN_URL], tileSize: 256, maxzoom: 15, encoding: 'terrarium', attribution: ATTRIBUSJON.dem },
      hs: { type: 'raster-dem', tiles: [TERRAIN_URL], tileSize: 256, maxzoom: 15, encoding: 'terrarium' },
      route: { type: 'geojson', lineMetrics: true, data: { type: 'FeatureCollection', features: [] } },
    },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': RUTEFARGE.bakgrunn } },
      { id: 'sat', type: 'raster', source: 'sat', paint: { 'raster-saturation': -0.25, 'raster-contrast': 0.12, 'raster-brightness-max': 0.82, 'raster-fade-duration': 0 } },
      { id: 'topo', type: 'raster', source: 'topo', layout: { visibility: 'none' }, paint: { 'raster-brightness-max': 0.92, 'raster-fade-duration': 0 } },
      { id: 'hillshade', type: 'hillshade', source: 'hs', paint: { 'hillshade-exaggeration': 0.35, 'hillshade-shadow-color': '#000', 'hillshade-highlight-color': 'rgba(255,255,255,0.12)' } },
      { id: 'route-casing', type: 'line', source: 'route', layout: rundLinje, paint: { 'line-color': RUTEFARGE.casing, 'line-width': 7 } },
      { id: 'route-ghost', type: 'line', source: 'route', layout: rundLinje, paint: { 'line-color': RUTEFARGE.ghost, 'line-width': 2.5, 'line-dasharray': [1.6, 1.4] } },
      { id: 'route-glow', type: 'line', source: 'route', layout: rundLinje, paint: { 'line-width': 16, 'line-blur': 9, 'line-gradient': grad(0, ...RUTEFARGE.glow) } },
      { id: 'route-done', type: 'line', source: 'route', layout: rundLinje, paint: { 'line-width': 5.5, 'line-gradient': grad(0, ...RUTEFARGE.done) } },
    ],
    terrain: { source: 'dem', exaggeration: CFG.exaggeration },
  };
}

// ---------- Oversiktskartet: alle løypene i 2D, hver i sin farge ----------

/** Farge per løypefarge-nøkkel (fra --route-* i tokens.css) og reserve for løyper uten farge. */
export type Fargekart = Record<string, string> & { ukjent: string };

export const fargeUttrykk = (farger: Fargekart): ExpressionSpecification => [
  'match',
  ['get', 'farge'],
  ...Object.entries(farger).flatMap(([k, v]) => [k, v]),
  farger.ukjent,
] as unknown as ExpressionSpecification;

export const OVERSIKT_LAG = {
  kant: 'loyper-kant',
  hel: 'loyper-hel',
  stiplet: 'loyper-stiplet',
  fokusKant: 'loyper-fokus-kant',
  fokus: 'loyper-fokus',
  pil: 'loyper-pil',
  treff: 'loyper-treff',
} as const;

export function lagOversiktStil(farger: Fargekart): StyleSpecification {
  const rundLinje = { 'line-join': 'round', 'line-cap': 'round' } as const;
  const ingen: ExpressionSpecification = ['==', ['get', 'slug'], ''];
  // Korte løyper over lange, så de ikke forsvinner under en lang løype på samme sti
  const sortering: ExpressionSpecification = ['-', 0, ['get', 'lengde']];
  const farge = fargeUttrykk(farger);
  // zoom må stå øverst i interpolate, så påslaget legges på hvert stopp
  const bredde = (pluss = 0): ExpressionSpecification => ['interpolate', ['linear'], ['zoom'], 13, 2.5 + pluss, 16, 4 + pluss, 18, 6 + pluss];
  return {
    version: 8,
    sources: {
      topo: { type: 'raster', tileSize: 256, maxzoom: 18, attribution: ATTRIBUSJON.topo, tiles: [TOPO_URL] },
      sat: { type: 'raster', tileSize: 256, maxzoom: 19, attribution: ATTRIBUSJON.sat, tiles: [SAT_URL] },
      loyper: { type: 'geojson', data: { type: 'FeatureCollection', features: [] } },
    },
    layers: [
      { id: 'bg', type: 'background', paint: { 'background-color': RUTEFARGE.bakgrunn } },
      { id: 'topo', type: 'raster', source: 'topo', paint: { 'raster-saturation': -0.35, 'raster-fade-duration': 150 } },
      { id: 'sat', type: 'raster', source: 'sat', layout: { visibility: 'none' }, paint: { 'raster-saturation': -0.25, 'raster-brightness-max': 0.85, 'raster-fade-duration': 150 } },
      { id: OVERSIKT_LAG.kant, type: 'line', source: 'loyper', filter: ingen, layout: { ...rundLinje, 'line-sort-key': sortering }, paint: { 'line-color': '#fff', 'line-width': bredde(3) } },
      { id: OVERSIKT_LAG.hel, type: 'line', source: 'loyper', filter: ingen, layout: { ...rundLinje, 'line-sort-key': sortering }, paint: { 'line-color': farge, 'line-width': bredde() } },
      { id: OVERSIKT_LAG.stiplet, type: 'line', source: 'loyper', filter: ingen, layout: { 'line-join': 'round', 'line-sort-key': sortering }, paint: { 'line-color': farge, 'line-width': bredde(), 'line-dasharray': [2, 1.2] } },
      { id: OVERSIKT_LAG.fokusKant, type: 'line', source: 'loyper', filter: ingen, layout: rundLinje, paint: { 'line-color': RUTEFARGE.bakgrunn, 'line-width': bredde(6) } },
      { id: OVERSIKT_LAG.fokus, type: 'line', source: 'loyper', filter: ingen, layout: rundLinje, paint: { 'line-color': farge, 'line-width': bredde(2) } },
      {
        id: OVERSIKT_LAG.pil,
        type: 'symbol',
        source: 'loyper',
        filter: ingen,
        layout: { 'symbol-placement': 'line', 'symbol-spacing': 70, 'icon-image': 'pil', 'icon-size': 0.6, 'icon-rotation-alignment': 'map', 'icon-allow-overlap': true, 'icon-ignore-placement': true },
      },
      // Usynlig og bred, så løypene er lette å treffe med mus og finger
      { id: OVERSIKT_LAG.treff, type: 'line', source: 'loyper', filter: ingen, layout: rundLinje, paint: { 'line-color': '#000', 'line-opacity': 0, 'line-width': 22 } },
    ],
  };
}
