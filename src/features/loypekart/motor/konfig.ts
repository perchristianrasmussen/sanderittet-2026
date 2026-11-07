// Innstillinger og flis-URL-er for løypepresentasjonen. Ingen DOM eller MapLibre her.

export const CFG = {
  exaggeration: 1.6, // terrengoverdrivelse
  followZoom: 17.0,
  followPitch: 63,
  introSec: 6.5,
  transSec: 3.2,
  outroSec: 5.5,
  demZoom: 15,
  metersPerSec: 55, // hvor fort kameraet "sykler" løypa ved 1×
  maxPitch: 78,
  startCenter: [10.255, 59.564] as [number, number],
  startZoom: 15,
} as const;

export const TERRAIN_URL = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';
export const SAT_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
export const TOPO_URL = 'https://cache.kartverket.no/v1/wmts/1.0.0/topo/default/webmercator/{z}/{y}/{x}.png';

export const ATTRIBUSJON = {
  sat: 'Flyfoto © Esri, Maxar, Earthstar Geographics',
  topo: '© Kartverket',
  dem: 'Terreng: AWS Terrain Tiles',
} as const;

// Løypestrekens farger i kartet (som i prototypen)
export const RUTEFARGE = {
  done: ['#c4001d', '#ff4757'],
  glow: ['rgba(255,42,58,.45)', 'rgba(255,90,100,.8)'],
  casing: 'rgba(0,0,0,0.45)',
  ghost: 'rgba(255,255,255,0.7)',
  bakgrunn: '#0b0f14',
} as const;

export function flisUrl(mal: string, z: number, x: number, y: number) {
  return mal.replace('{z}', String(z)).replace('{x}', String(x)).replace('{y}', String(y));
}
