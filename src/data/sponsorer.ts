import type { ImageMetadata } from 'astro';
import gastromat from '../assets/img/sponsorer/gastromat.png';
import bdSamferdsel from '../assets/img/sponsorer/bd-samferdsel.jpg';
import bergHansen from '../assets/img/sponsorer/berghansen.png';
import sandeDyreklinikk from '../assets/img/sponsorer/sande-dyreklinikk.png';
import gk from '../assets/img/sponsorer/gk.png';
import rollsSykkel from '../assets/img/sponsorer/rolls-sykkel.png';
import kjeldaas from '../assets/img/sponsorer/kjeldaas.svg';
import onemed from '../assets/img/sponsorer/onemed.jpg';

export interface Sponsor {
  navn: string;
  url: string;
  logo: ImageMetadata;
  /** Brede logoer får lavere høyde enn kvadratiske, så de veier likt. */
  form: 'bred' | 'kvadrat';
}

// Rekkefølge og lenker fra legacy/sponsorer.html (sponsorer 2026)
export const sponsorer: Sponsor[] = [
  { navn: 'Gastromat', url: 'https://gastromat.no', logo: gastromat, form: 'kvadrat' },
  { navn: 'BD Samferdsel', url: 'https://www.bdsamferdsel.no', logo: bdSamferdsel, form: 'kvadrat' },
  { navn: 'Berg-Hansen', url: 'https://www.berg-hansen.no', logo: bergHansen, form: 'bred' },
  { navn: 'Sande Dyreklinikk', url: 'https://www.sandedyreklinikk.no', logo: sandeDyreklinikk, form: 'bred' },
  { navn: 'GK', url: 'https://www.gk.no', logo: gk, form: 'kvadrat' },
  { navn: 'Rolls Sykkel', url: 'https://www.rolls-sykkelservice.no', logo: rollsSykkel, form: 'kvadrat' },
  { navn: 'Kjeldaas', url: 'https://kjeldaas-as.no', logo: kjeldaas, form: 'bred' },
  { navn: 'OneMed', url: 'https://www.onemed.com/no', logo: onemed, form: 'bred' },
];
