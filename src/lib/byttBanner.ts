// Bytter innholdet i et banner (Banner.astro). Felt som endres viskes ut og inn
// igjen som TV-grafikk; uendret innhold røres ikke. Uten bevegelse byttes det rett.

export interface BannerInnhold {
  label: string;
  value: string;
  datetime?: string;
  state?: string;
}

const VARIGHET = 340;
const UT = 0.3; // feltet er helt skjult fra UT til INN, og teksten byttes midt imellom
const INN = 0.42;

// Ut mot høyre (akselererende), så inn fra venstre (eksponentiell utbremsing).
// Én animasjon uten fill: stopper den, står feltet synlig igjen.
const viskBytt: Keyframe[] = [
  { clipPath: 'inset(0)', easing: 'cubic-bezier(0.7, 0, 0.84, 0)', offset: 0 },
  { clipPath: 'inset(0 0 0 100%)', offset: UT },
  { clipPath: 'inset(0 0 0 100%)', offset: INN },
  { clipPath: 'inset(0 100% 0 0)', easing: 'cubic-bezier(0.16, 1, 0.3, 1)', offset: INN },
  { clipPath: 'inset(0)', offset: 1 },
];

export function byttBanner(banner: HTMLElement, neste: BannerInnhold) {
  const label = banner.querySelector<HTMLElement>('[data-banner-label]');
  const verdi = banner.querySelector<HTMLElement>('[data-banner-value]');
  if (!label || !verdi) return;

  if (neste.state) banner.dataset.state = neste.state;
  if (neste.datetime) verdi.setAttribute('datetime', neste.datetime);

  // Feltene som faktisk endres: nøkkelen selv og verdiens felt (.bv rundt verdien)
  const felt: { flate: HTMLElement; el: HTMLElement; tekst: string }[] = [];
  if (label.textContent !== neste.label) felt.push({ flate: label, el: label, tekst: neste.label });
  if (verdi.textContent !== neste.value) felt.push({ flate: verdi.parentElement ?? verdi, el: verdi, tekst: neste.value });

  // Redusert bevegelse, eller entreen spiller fortsatt og viser uansett den nye verdien
  const stille =
    matchMedia('(prefers-reduced-motion: reduce)').matches ||
    typeof banner.animate !== 'function' ||
    felt.some(({ flate }) => flate.getAnimations().some((a) => a.playState === 'running'));

  felt.forEach(({ flate, el, tekst }, i) => {
    if (stille) {
      el.textContent = tekst;
      return;
    }
    const forsinkelse = i * 60;
    const anim = flate.animate(viskBytt, { duration: VARIGHET, delay: forsinkelse });
    // Teksten byttes mens feltet er helt skjult; klokka starter når animasjonen gjør det
    const bytt = () => (el.textContent = tekst);
    anim.ready.then(() => setTimeout(bytt, forsinkelse + (VARIGHET * (UT + INN)) / 2), bytt);
  });
}
