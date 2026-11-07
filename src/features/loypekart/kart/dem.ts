// Henter Terrarium-fliser i nettleseren og gir pikseldata til motor/hoyde.ts.
import { CFG, TERRAIN_URL, flisUrl } from '../motor/konfig.ts';
import { demFliser, type Dem } from '../motor/hoyde.ts';
import type { BBox } from '../motor/rute.ts';

function loadImg(url: string) {
  return new Promise<HTMLImageElement>((res, rej) => {
    const i = new Image();
    i.crossOrigin = 'anonymous';
    i.onload = () => res(i);
    i.onerror = rej;
    i.src = url;
  });
}

export async function loadDem(bbox: BBox): Promise<Dem> {
  const z = CFG.demZoom;
  const tiles = new Map<string, Uint8ClampedArray>();
  await Promise.all(
    demFliser(bbox, z).map(({ x, y }) =>
      loadImg(flisUrl(TERRAIN_URL, z, x, y)).then((img) => {
        const cv = document.createElement('canvas');
        cv.width = cv.height = 256;
        const g = cv.getContext('2d', { willReadFrequently: true })!;
        g.drawImage(img, 0, 0);
        tiles.set(x + '/' + y, g.getImageData(0, 0, 256, 256).data);
      }),
    ),
  );
  return { z, tiles };
}
