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
  /** Optisk justering av høyden (1 = grunnhøyden for formen). Luft i filen og tynne streker veies opp her. */
  skala?: number;
  /** Plate i logoens størrelse bak logoen når den krever det, f.eks. lys logo som forsvinner på hvitt. Flisen er fortsatt hvit. */
  bakgrunn?: string;
  /** Kort omtale til /sponsorer, fra klubbens gamle sponsorside */
  omtale: string;
}

// Rekkefølge, lenker og omtaler fra legacy/sponsorer.html (sponsorer 2026). Omtalene er forkortet,
// og tall som går ut på dato (omsetning, ansatte) er tatt bort.
export const sponsorer: Sponsor[] = [
  { navn: 'Gastromat', url: 'https://gastromat.no', logo: gastromat, form: 'kvadrat', skala: 1.6, omtale: 'Sande-bedrift med røtter tilbake til 1966, kjent for allkrydderet sitt. Gastromat støtter idretten i hjembyen og er en naturlig partner for Sanderittet.' },
  { navn: 'BD Samferdsel', url: 'https://www.bdsamferdsel.no', logo: bdSamferdsel, form: 'kvadrat', skala: 1.1, omtale: 'Regional aktør innen veginfrastruktur og samferdselsprodukter med base i Holmestrand, med alt langs veikanten fra trafikkskilt og master til rekkverk.' },
  { navn: 'Berg-Hansen', url: 'https://www.berg-hansen.no', logo: bergHansen, form: 'bred', skala: 0.9, omtale: 'Norges eldste og største reisebyrå, med over 100 års erfaring innen forretningsreiser, grupper og humanitær sektor.' },
  { navn: 'Sande Dyreklinikk', url: 'https://www.sandedyreklinikk.no', logo: sandeDyreklinikk, form: 'bred', skala: 1.5, omtale: 'Moderne dyreklinikk på Revåveien i Sande, med alt fra rutinebesøk og vaksinasjoner til kirurgi, røntgen og ultralyd.' },
  { navn: 'GK', url: 'https://www.gk.no', logo: gk, form: 'kvadrat', skala: 1.35, omtale: 'Teknisk totalentreprenør og servicepartner innen ventilasjon, kjøling, byggautomasjon, elektro og rør, startet som et lite ventilasjonsselskap i 1964.' },
  { navn: 'Rolls Sykkel', url: 'https://www.rolls-sykkelservice.no', logo: rollsSykkel, form: 'kvadrat', skala: 1.1, omtale: 'Den lokale sykkelbutikken og verkstedet i Sande, forhandler av Merida og Control, med service for alle sykkeltyper, med og uten motor.' },
  // Lys logo: står på en plate i samme røde som på klubbens gamle sponsorside
  { navn: 'Kjeldaas', url: 'https://kjeldaas-as.no', logo: kjeldaas, form: 'bred', skala: 1.05, bakgrunn: '#b32013', omtale: 'Anleggsentreprenør med base i Sande, grunnlagt i 1971, innen veg, vann og avløp, idrettsanlegg og rørfornyelse uten graving.' },
  { navn: 'OneMed', url: 'https://www.onemed.com/no', logo: onemed, form: 'bred', skala: 0.85, omtale: 'Norges største leverandør av medisinsk forbruksmateriell, fra sårpleie og hygiene til utstyr for operasjonssaler.' },
];
