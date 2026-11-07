// Hendelser langs løypa: splitter, høyeste punkt, bratteste stigning og mål.
import { fmtInt, fmtKm } from './geo.ts';
import { eleAt, type Profil } from './hoyde.ts';
import type { Rute } from './rute.ts';

export type HendelseType = 'split' | 'hi' | 'steep' | 'finish';

export interface Hendelse {
  d: number;
  kind: HendelseType;
  /** Tekst på pinnen i kartet; uten pin vises bare banneret. */
  pin?: string;
  k: string;
  v?: string;
}

export function buildEvents(R: Rute, P: Profil): Hendelse[] {
  const ev: Hendelse[] = [
    { d: R.L / 3, kind: 'split', pin: 'SPLIT 1', k: 'Split 1' },
    { d: (R.L * 2) / 3, kind: 'split', pin: 'SPLIT 2', k: 'Split 2' },
  ];
  const free = (d: number) => ev.every((e) => Math.abs(e.d - d) > 90);
  if (P.has && free(P.maxD) && P.maxD > 30 && P.maxD < R.L - 30)
    ev.push({ d: P.maxD, kind: 'hi', pin: '▲ ' + fmtInt(P.max) + ' MOH', k: 'Høyeste punkt', v: fmtInt(P.max) + ' moh' });
  if (P.has && P.steep > 3 && free(P.steepD))
    ev.push({ d: P.steepD, kind: 'steep', pin: '↗ ' + fmtInt(P.steep) + ' %', k: 'Bratteste stigning', v: fmtInt(P.steep) + ' %' });
  ev.push({ d: R.L * 0.995, kind: 'finish', k: 'Mål', v: fmtKm(R.L) + ' km' + (P.has ? ' · ' + fmtInt(P.climb) + ' hm' : '') });
  for (const e of ev) if (e.kind === 'split') e.v = fmtKm(e.d) + ' km' + (P.has ? ' · ' + fmtInt(eleAt(P, R, e.d)) + ' moh' : '');
  return ev.sort((a, b) => a.d - b.d);
}
