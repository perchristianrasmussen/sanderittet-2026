---
name: Sande Sykkelklubb
description: Designprofilen for sandesykkel.no – rittkultur fra Lersbrygga med TV-grafikk, NM-pondus og plass til hele familien.
colors:
  red: "#C8241A"
  red-dark: "#9e1a12"
  red-light: "#e8342a"
  blue: "#16397A"
  blue-mid: "#1e4ea6"
  blue-pale: "#e8eef8"
  white: "#ffffff"
  off-white: "#f6f7f9"
  dark: "#0d1824"
  night: "#07090d"
  panel: "rgba(7,9,13,0.82)"
  text: "#1a2030"
  muted: "#5a6580"
  muted-on-dark: "rgba(255,255,255,0.62)"
  soft-on-dark: "rgba(255,255,255,0.8)"
  line: "rgba(13,24,36,0.1)"
  line-on-dark: "rgba(255,255,255,0.14)"
  line-strong: "#7a8499"
  line-on-dark-strong: "rgba(255,255,255,0.45)"
  error-bg: "#fdecea"
  route-start: "#e6c120"
  route-green: "#1a9e5c"
  route-blue: "#3a9eff"
  route-orange: "#e87820"
  route-shortcut: "#d4a840"
  map-ph-glade: "#2c3a2e"
  map-ph-forest: "#1a2620"
  map-ph-floor: "#0f1512"
typography:
  display:
    fontFamily: "'Bebas Neue', Impact, sans-serif"
    fontSize: "clamp(4rem, 12vw, 10rem)"
    fontWeight: 400
    lineHeight: 0.88
    letterSpacing: "0.02em"
  display-sm:
    fontFamily: "'Bebas Neue', Impact, sans-serif"
    fontSize: "clamp(3rem, 16vw, 5rem)"
    fontWeight: 400
    lineHeight: 0.88
    letterSpacing: "0.02em"
  headline:
    fontFamily: "'Bebas Neue', Impact, sans-serif"
    fontSize: "clamp(2.5rem, 6vw, 4.2rem)"
    fontWeight: 400
    lineHeight: 0.93
    letterSpacing: "0.02em"
  title:
    fontFamily: "'Bebas Neue', Impact, sans-serif"
    fontSize: "clamp(1.6rem, 3vw, 2.2rem)"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.04em"
  stat:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif"
    fontSize: "2.75rem"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "'tnum'"
  stat-sm:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif"
    fontSize: "1.75rem"
    fontWeight: 700
    lineHeight: 1
    fontFeature: "'tnum'"
  banner:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif"
    fontSize: "1.875rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.04em"
  banner-sm:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif"
    fontSize: "1.375rem"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "0.04em"
  banner-value:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "0.1em"
    fontFeature: "'tnum'"
  brand:
    fontFamily: "'Bebas Neue', Impact, sans-serif"
    fontSize: "1.6rem"
    fontWeight: 400
    lineHeight: 1
    letterSpacing: "0.04em"
  menu:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif"
    fontSize: "1.375rem"
    fontWeight: 600
    letterSpacing: "0.1em"
  tag:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.16em"
  label:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.16em"
  nav:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif"
    fontSize: "1rem"
    fontWeight: 600
    letterSpacing: "0.1em"
  button:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.08em"
  button-lg:
    fontFamily: "'Barlow Condensed', 'Arial Narrow', sans-serif"
    fontSize: "1.25rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.08em"
  sub:
    fontFamily: "'Barlow', system-ui, sans-serif"
    fontSize: "clamp(1.0625rem, 1.6vw, 1.3rem)"
    fontWeight: 400
    lineHeight: 1.65
  lead:
    fontFamily: "'Barlow', system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.65
  body:
    fontFamily: "'Barlow', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.65
  body-sm:
    fontFamily: "'Barlow', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.6
  meta:
    fontFamily: "'Barlow', system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  none: "0px"
  sm: "2px"
  md: "4px"
  lg: "6px"
spacing:
  xs: "0.5rem"
  sm: "1rem"
  md: "1.5rem"
  lg: "2.5rem"
  xl: "4rem"
  section: "6rem"
  section-mobile: "4rem"
  gutter: "2.5rem"
  gutter-mobile: "1rem"
  container: "1200px"
  container-narrow: "760px"
components:
  button-primary:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0.9rem 1.75rem"
  button-primary-hover:
    backgroundColor: "{colors.red-dark}"
  button-primary-lg:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    typography: "{typography.button-lg}"
    rounded: "{rounded.sm}"
    padding: "1.1rem 2.25rem"
    height: "56px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.white}"
    typography: "{typography.button}"
    rounded: "{rounded.sm}"
    padding: "0.9rem 1.75rem"
  tag-split-key:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    typography: "{typography.tag}"
    rounded: "{rounded.none}"
    padding: "5px 12px"
  tag-split-value:
    backgroundColor: "{colors.white}"
    textColor: "{colors.night}"
    typography: "{typography.tag}"
    rounded: "{rounded.none}"
    padding: "5px 12px"
  stat-panel:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.white}"
    typography: "{typography.stat}"
    rounded: "{rounded.none}"
    padding: "9px 16px 11px"
  stat-panel-light:
    backgroundColor: "{colors.white}"
    textColor: "{colors.dark}"
    typography: "{typography.stat}"
    rounded: "{rounded.none}"
    padding: "9px 16px 11px"
  banner-key:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    typography: "{typography.banner}"
    rounded: "{rounded.none}"
    padding: "8px 20px"
  banner-value:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.white}"
    typography: "{typography.banner-value}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  banner-key-sm:
    backgroundColor: "{colors.red}"
    textColor: "{colors.white}"
    typography: "{typography.banner-sm}"
    rounded: "{rounded.none}"
    padding: "6px 14px"
  nav:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.white}"
    typography: "{typography.nav}"
    padding: "0.9rem 2.5rem"
  card:
    backgroundColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "2rem"
  card-dark:
    backgroundColor: "rgba(255,255,255,0.05)"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "1.5rem"
  panel-blue:
    backgroundColor: "{colors.blue}"
    textColor: "{colors.white}"
    rounded: "{rounded.md}"
    padding: "2.5rem"
  input:
    backgroundColor: "{colors.off-white}"
    textColor: "{colors.text}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "0.7rem 0.85rem"
  map-module:
    backgroundColor: "{colors.night}"
    rounded: "{rounded.lg}"
  footer:
    backgroundColor: "{colors.dark}"
    textColor: "{colors.muted-on-dark}"
    typography: "{typography.label}"
    padding: "2.5rem"
---

<!-- v2 (2026-11-07): videreføring av sanderittet.no-stilen med TV-grafikk fra MapLibre-prototypen. Fastsatt før bygging; justeres mot den ferdige siden og .impeccable/design.json oppdateres da. -->

# Design System: Sande Sykkelklubb

## Overview

**Creative North Star: "Rittdagen på Lersbrygga – på sending"**

Profilen er rittdagen på Lersbrygga slik den ville sett ut på TV. Vi beholder grunnmuren fra dagens side: mørke arenaseksjoner i flomlys vekslet med lyse, varme klubbseksjoner, store Bebas-titler med ett rødt ord, rødt for handling og blått for struktur. Oppå legger vi grafikkspråket fra løypepresentasjonen: tallpaneler med rød topplinje, delte etikettfelt, en skråstilt aksentstrek og bannere som slås opp når noe skjer. Arenaen er stedet, og grafikken er sendingen.

De mørke flatene bærer det stolte og seriøse: NM 2026, Norgescup, løypene og 3D-kartene. De lyse flatene bærer det lokale og inkluderende: treningstider, Spond og «alle aldre er velkomne». TV-grafikken binder dem sammen og brukes på begge flatene, så ikke bare på mørke sider. Uttrykket skal være sportslig og presist, aldri barnslig, aldri aggressivt og mørkt hele veien, og aldri glatt og korporativt.

Systemet bor i én felles stilfil med tokens (Astro-layout). Frontmatter i denne filen er fasit.

**Key Characteristics:**
- Mørke arenaseksjoner vekslet med lyse klubbseksjoner (hvit / off-white / blue-pale).
- Bebas Neue for alle store titler, med ett rødt ord.
- Barlow Condensed for tall, etiketter, navigasjon, knapper og alle grafikkpaneler.
- Barlow for brødtekst, slik at to familier jobber sammen.
- TV-grafikk: tallpaneler med rød topplinje, delte etikettfelt (rødt/hvitt), skråstilt aksentstrek og bannere.
- Rødt for handling og fremheving, blått for struktur og informasjon.
- Skarpe kanter: grafikk har 0 radius, knapper 2px, kort 4px og bilder/kart 6px.

## Colors

Klubbfargene rødt og blått mot en dyp arenablå og kjølige lyse nøytraler, med TV-panelets nesten svarte glass for grafikk.

### Primary
- **Rittrød** (`red`): primærknapper, etikettfeltets nøkkeldel, topplinjen på tallpaneler, bannerets nøkkel, det røde ordet i titler og aksentstreken.
- **Lys rittrød** (`red-light`): løypelinjer og fremdrift på mørk bakgrunn der `red` blir for mørk.
- **Dyp rittrød** (`red-dark`): hover på røde knapper (hvit tekst holder 8:1) og tekst i feilmeldinger.

### Secondary
- **Klubbblå** (`blue`): informasjonspaneler og CTA-bokser, blå seksjonsetiketter og dagsnavn i treningsoversikten.
- **Mellomblå** (`blue-mid`): inline-lenker, fokusring på lyse flater og hover-ramme på kort.
- **Blekblå** (`blue-pale`): bakgrunn i lyse klubbseksjoner, ikonbokser og GPX-knapper.

### Neutral
- **Arenamørk** (`dark`): nav, hero, arenaseksjoner og footer. Også overskriftsfarge på lyse flater.
- **Natt** (`night`) og **panelglass** (`panel`): bakgrunn for kart og 3D-presentasjoner, og glasset bak tallpaneler og bannere oppå bilde eller kart.
- **Blekk** (`text`), **grus** (`muted`), **hvit** og **off-white**: tekst og lyse flater.
- **Tekst og linjer på mørkt** (`muted-on-dark`, `line-on-dark`): sekundærtekst og kantlinjer på mørke flater. **Myk hvit** (`soft-on-dark`) er løpende tekst på mørke og blå flater (hero-undertekst, infokort, blått panel), lysere enn `muted-on-dark`. **Hårstrek** (`line`) er skillelinjer og kortkanter på lyse flater.
- **Komponentkanter** (`line-strong` på lyst, `line-on-dark-strong` på mørkt): kanten på input, outline-knapper og HUD-kontroller. Begge holder minst 3:1 mot flaten; de svake linjene (`line`, `line-on-dark`) er bare for skillelinjer og kort.

### Løypefarger (kun i kart)
`route-start`, `route-green`, `route-blue`, `red` (XCO 13+), `route-orange` og `route-shortcut` (stiplet). De er kartspråk og knyttet til aldersklasser.

### Terreng i kartplassholder (kun kartplassholder)
`map-ph-glade`, `map-ph-forest` og `map-ph-floor` er en dempet skoggrønn flate bak HUD-en der det ekte kartet ikke er lastet (stilsiden, statisk reserve). De brukes ikke til noe annet.

### Named Rules
**Regelen om rødt som signal.** Rødt markerer handling, ett fremhevet ord og grafikkens nøkkel (etikett, topplinje, banner). Det blir aldri store bakgrunnsflater og aldri brødtekst.

**Trefargeregelen.** Rød–hvit–blå-stripen er et tynt strukturelement: 4px langs toppen av hero og rød/blå kantlinjer rundt NM-innhold. Den blir aldri bakgrunn, mønster eller flagg.

**Løyperegelen.** Løypefargene finnes bare i kart, legender og løypeoversikter.

## Typography

**Display Font:** Bebas Neue (med Impact)
**Grafikk- og UI-font:** Barlow Condensed (500 / 600 / 700 / 800, og kursiv 700 / 800 til bannere)
**Body Font:** Barlow (400 / 600)

**Character:** Bebas er startnummeret: smalt, versalt og tett. Barlow Condensed er TV-grafikken med tall, etiketter og paneler, med tabulære sifre. Barlow er klubbens stemme i løpende tekst, og tilhører samme familie som grafikken.

Fontene serveres fra prosjektet med `@font-face` og lastes ikke fra Google Fonts.

### Hierarchy
- **Display**: hero-H1, én per side. **Display-sm** er samme stil under 760px og i stilprøver.
- **Sub**: undertekst rett under hero-H1.
- **Headline**: H2 på seksjoner.
- **Title**: korttitler, sideheadere på smale sider og karttitler.
- **Stat / Stat-sm**: tall i tallpaneler (lengde, høydemeter, årstall, tider), alltid med tabulære sifre og enhet i liten, dempet vekt.
- **Banner / Banner-sm / Banner-value**: nøkkelen i bannere i kursiv 800 (Banner-sm under 760px), og verdien i 600 med tabulære sifre. Verdien er mindre enn nøkkelen på desktop og blir `body`-størrelse under 760px.
- **Tag / Label**: etikettfelt, seksjonsetiketter, metadata som tider og steder, og skjemalabels. Alltid versaler med sperring 0.16em.
- **Nav / Menu / Button**: versaler i Barlow Condensed. Menu er radene i mobilmenyen.
- **Brand**: ordmerket i nav og footer.
- **Lead / Body / Body-sm / Meta**: Barlow, maks ~65 tegn per linje i løpende tekst. Meta er liten metadata som fargekoder; samme størrelse brukes i HUD-kontroller.

### Named Rules
**Regelen om ett rødt ord.** Bebas-titler har ett ord eller én frase i `red`. Aldri mer.

**Tallregelen.** Alle tall som betyr noe, som tider, distanser, høydemeter og årstall, står i Barlow Condensed med tabulære sifre og en dempet enhet. Viktige tall gjemmes aldri i brødtekst.

## Layout

- **Container:** 1200px på brede sider og 760px på skjema- og listesider. Sidemarg 2.5rem på desktop og 1rem på mobil.
- **Seksjonsrytme:** 6rem vertikalt på desktop og 4rem på mobil. Det er mer luft over en overskrift enn under.
- **Lys/mørk-veksling:** seksjonene bytter mellom mørk (`dark`) og lys (white / off-white / blue-pale). To like flater skal ikke ligge etter hverandre.
- **Seksjonsstart:** Bebas-H2 med rødt ord → skråstilt aksentstrek → ingress. Ingen dekorativ etikett over titler.
- **Hero:** fullhøyde, foto fra klubben under arenagradient, trefargestripe øverst og innholdet nederst til venstre i rekkefølgen H1, undertekst til foreldre, statusbanneret på egen linje (`size="sm"`) og handlingsraden `#bli-med`: én setning i `body-sm` og `soft-on-dark` som forklarer Spond («Vi bruker appen Spond til påmelding og beskjeder. Knappen åpner gruppa vår.»), bundet til knappen med `aria-describedby`, og så Spond-knappen i `size="lg"`. Knappen er den tyngste røde flaten i første skjermbilde; banneret står aldri ved siden av den. Tallpanelene står som en liste (`<ul aria-label="Arrangementer på Lersbrygga">`) øverst til høyre på desktop, i flyten under navigasjonen: heroen har `padding-top: calc(var(--header-h) + var(--s-sm))`, og `Nav.astro` måler `--header-h` når menyen brytes over to linjer. Ingen absolutt plassering. På mobil er rekkefølgen H1, undertekst, banner, Spond-linjen, Spond-knappen i full bredde og så tallpanelene som én kompakt rad nederst, slik at knappen alltid er i første skjermbilde.
- **Kart og presentasjon:** kartmoduler kan gå i full bredde. Grafikk (tittel, tallpaneler, høydeprofil) ligger som HUD over kartet.
- **Breakpoint:** 760px. Under det stables gridder til én kolonne, tallpaneler brytes til en rad som kan rulles sideveis eller krympes, og navigasjonen blir en hamburgermeny.

## Elevation & Depth

Systemet er flatt. Dybde lages med tone (mørke mot lyse flater) og med panelglass over bilde og kart. Skygger brukes bare som respons på hover, og på det som svever.

### Shadow Vocabulary
- **Hover-løft** (`box-shadow: 0 12px 40px rgba(22,57,122,0.12)` + `translateY(-3px)`): klikkbare kort.
- **Kartmodul** (`box-shadow: 0 8px 32px rgba(0,0,0,0.3)`): innebygde kart på mørk flate.
- **Tekstskygge på bilde** (`text-shadow: 0 6px 40px rgba(0,0,0,0.6)`): store titler over foto eller kart.
- **Panelglass**: `panel` + `backdrop-filter: blur(6px)` for tallpaneler, bannere og kontroller over bilde eller kart.

### Named Rules
**Regelen om flatt til noe skjer.** Kort og paneler er flate i ro. Løft og skygge kommer ved hover eller når noe svever over innhold.

## Shapes

- **0px** (`none`): all TV-grafikk, det vil si etikettfelt, tallpaneler, bannere og HUD-kontroller.
- **2px** (`sm`): knapper, input og badges.
- **4px** (`md`): kort og paneler.
- **6px** (`lg`): bilder, video og kartmoduler.
- **Skråstilt aksentstrek:** 96×6px `red` med `transform: skewX(-24deg)`. Den erstatter den gamle rette skillestreken og brukes under titler.
- **Kantlinjer:** tynne (1–1.5px) med lav alfa. Tykke (3–4px) er alltid røde eller blå og markerer en grense eller topplinje.

**Regelen om skarpe kanter.** Ingenting er pilleformet og ingenting er rundere enn 6px. Runde former finnes bare i kartmarkører (rytterpunkt) og profilpunkter.

## Components

### Etikettfelt (tag-split)
To felt kant i kant: nøkkel i `red` med hvit tekst og verdi i hvitt med `night`-tekst, begge i `tag`-typografi og versaler. Eksempler: `XCO | 4,2 KM`, `TRENING | I DAG`, `NM | 2026`. Feltet bærer alltid informasjon: disiplin, status, dato eller kategori. Det brukes i kartheadere, på løype- og arrangementskort og i HUD-er, og **aldri som pynt over en tittel**. På lyse flater kan verdifeltet bli `dark` med hvit tekst.

### Tallpanel (stat-panel)
`panel` (på mørkt eller over bilde) eller `white` (på lyst), med 3px `red` topplinje og 0 radius. Nøkkelen står i `label` i versaler og dempet farge (midtpunktet mellom deler i `.sep`, tegnet som en rund prikk så det ikke leses som bindestrek), tallet i `stat` med enhet i liten 600-vekt. Panelene står på rad med 6px mellomrom. Brukes til løypetall, årstall, treningstider og neste trening. Årstall for arrangementer sier hva klubben gjorde: «Arrangør · Norgescup 2024», «Arrangør · Norgescup 2025», «Arrangør · NM terreng 2026», aldri bare «Norgescup 2024», som kan leses som at klubben deltok. Flere panel som hører sammen står i en liste (`StatPanel as="li"` i en `<ul>` med `aria-label`). Treningstider skrives med dag og aldersgruppe i nøkkelen («Man · opptil 10 år», «Man · over 10 år», «Tor · 11 år og eldre») og starttid som tall med sluttid som dempet enhet («18:00 –19:30»), så gruppene aldri overlapper.

### Banner
Nøkkel i `red` (kursiv 800) og verdi i `panel`, kant i kant. Brukes til status og kunngjøringer. Hero-banneret følger yngste gruppe og har gruppa bak verdien, så det aldri er tvil om hvem tiden gjelder: «Trening i dag · 18:00 · opptil 10 år», «Neste trening · Man 18:00 · opptil 10 år» eller utenfor sesong «Sesongen starter · Man 5. april · opptil 10 år» (første trening for gruppa regnet ut fra treningsplanen, i `<time datetime>`). Nøkkelen er alltid uten gruppe, så den holder seg kort; blir raden for smal, brytes verdien under nøkkelen som én blokk. Feltene viskes inn fra venstre (se Bevegelse).

**Regelen om status, ikke kontroll.** Banneret er en avlesning og skal aldri se ut som noe man kan trykke på: ingen lenke, ingen peker (`cursor: default`), ingen hover og aldri på samme rad som en knapp. Ved siden av en hovedhandling brukes `size="sm"` (nøkkel i `banner-sm`, verdi i `body`), så knappen er det tyngste røde.

### Høydeprofil
Et panel i `panel` med 3px rød topplinje, likt tallpanelene, og etiketten «HØYDEPROFIL». Profilen er en hvit, gjennomsiktig flate, og fremdriften er rød med en gradient, km-merker i `label` og min/maks i meter. Den brukes i løypepresentasjoner og på løypesidene.

### Buttons
- **Primary:** `red`, hvit tekst, `button`-typografi i versaler, 2px radius, minst 48px høy. Hover gir `red-dark` og `translateY(-2px)`, klikk `scale(.98)`; `red-light` brukes ikke bak hvit tekst (4,2:1). Pil-glyf for retning (`→` ny side, `↓` hopp ned, `↗` ekstern). Lenker som åpnes i ny fane har skjult tekst «(åpnes i ny fane)».
- **Stor (`size="lg"`):** sidens hovedhandling, i dag Spond-knappen i heroen. `button-lg` (1.25rem), minst 56px høy og padding 1.1rem 2.25rem. Én per skjermbilde. Full bredde under 760px.
- **Outline:** transparent med `1.5px` `line-on-dark-strong`-kant på mørkt, eller `blue` på lyst.
- **HUD-kontroll:** `panel`-glass, 1px `line-on-dark-strong`, Barlow Condensed versaler, 0 radius og minst 44×44px (spill av, hastighet, kartlag). Brytere har `aria-pressed`; aktiv bryter er hvit med `night`-tekst og 3px rød bunnlinje.

### Cards / Containers
- **Lyst kort:** `white`, 4px, 1.5px svak kant og padding 2rem. Klikkbare kort får hover-løft.
- **Mørkt infokort:** `rgba(255,255,255,0.05)` med `line-on-dark`-kant, etikett i `label` og hvit tekst.
- **Blått panel:** `blue` med Bebas-tittel, skråstilt aksentstrek og rød knapp. Brukes til CTA.

### Inputs / Fields
`off-white`-bakgrunn, 1.5px `line-strong`-kant, 2px radius og Barlow. Labels står i `label`. Fokus gir `blue-mid`-kant, hvit bakgrunn og fokusringen. Feil gir `red`-kant og en feilboks i `error-bg` med 1px rød kant, et ikon og en tekst som sier hva som er galt og hvordan det rettes.

### Navigation
Mørk (`dark`) med en 1px `line-on-dark`-hårstrek i bunnen, og fast plassering med glass på forsiden. Ingen rød bunnlinje: trefargestripen markerer allerede toppen, og rødt i navigasjonen er bare CTA-en og streken under lenker. Logo pluss ordmerket «Sande **Sykkel**klubb» i `brand` (Bebas), der «Sykkel» er det ene røde ordet. Lenkene står i `nav`-typografi, 70 % hvit, og blir hvite ved hover. Siste lenke er en rød CTA («Bli med») til `/#bli-med`, forsidens handlingsrad. Lenker og CTA har minst 44px treffflate, og siden man står på får `aria-current` og rød understrek. Navigasjonen ligger i `<header>` (komponenten `Nav.astro`). Under 760px blir den en hamburgerknapp («Meny» / «Lukk meny», `aria-expanded`) som åpner et mørkt panel i full bredde med store rader (≥48px), `line-on-dark-strong` i bunnen og den røde CTA-en; Escape lukker og gir fokus tilbake til knappen. Uten JS står lenkene synlige under logoen.

**Regelen om én vei inn.** Alle «Bli med» på siden går til samme sted: forsidens handlingsrad `#bli-med` (forklaring og Spond-knappen). Navigasjonens CTA lenker dit, og heroens knapp er Spond-lenken i den raden. Kommer det en egen treningsside, flyttes `#bli-med` dit og alle «Bli med» følger etter samtidig.

### Fokus og tilgjengelighet
Alt som kan fokuseres får en 2px fokusring med `:focus-visible`: `blue-mid` på lyse flater og hvit på mørke og blå flater. `outline: none` brukes ikke. Nettleserens egne flater følger paletten: markert tekst er hvit på `red`, markøren i felt er `red`, rullefeltet er `muted` på `off-white`, avkrysninger bruker `red` (`accent-color`), og klokkeslett (`<time>`) står med tabulære sifre. Første fokuserbare element er «Hopp til innhold», skjult til det får fokus, og hero med H1 ligger inne i `<main>`.

### Ikoner
Et konsekvent linjeikonsett med 1.75px strek i `currentColor`, servert som inline SVG. Emojier brukes ikke som ikoner.

### Kartmodul (signatur)
MapLibre over `night`, med flyfoto eller Kartverket topo og 3D-terreng. HUD-en ligger oppå: etikettfelt og Bebas-tittel øverst til venstre, tallpaneler øverst til høyre, høydeprofil nederst og HUD-kontroller over profilen. Løypa tegnes med mørk kant, en hvit stiplet «spøkelseslinje» for gjenstående og rød fremdrift med glød. Startpinner er hvite etiketter på en tynn stang.

### Footer
`dark` med 3px rød topplinje. Samme ordmerke som i navigasjonen. Metadata står i `label` i dempet hvit. Lenker er hvite med den delte lenkestreken, som tegnes inn ved hover; de blir ikke røde, fordi `red-light` på `dark` gir bare 4,2:1. Lenke til Sande Sportsklubb er alltid med.

### Navn
**Regelen om ett klubbnavn.** Klubben heter «Sande Sykkelklubb» overalt i grensesnittet: tittel, H1, ordmerket i nav og footer, og løpende tekst. Ordmerket forkortes aldri til «Sande Sykkel». «Sande Sportsklubb» brukes bare om moderklubben («En del av Sande Sportsklubb»), og «sykkelgruppa» bare når teksten forklarer tilknytningen.

### Bevegelse
Én komponert entré, tydelig respons på handlinger og ingenting som avsløres ved scrolling. Kurven er eksponentiell utbremsing (`--ease-out-expo`, `cubic-bezier(0.16, 1, 0.3, 1)`); utgang er raskere enn inngang og akselererer (`--ease-in`).
- **«På lufta» (bare heroen, én gang per lasting, ca. 1,05 s):** H1 setter seg fra 16px (0–700ms) og underteksten fra 12px (60–700ms), begge synlige fra start. Bannerets nøkkel viskes inn fra venstre med `clip-path` (200–600ms), verdien et slag etter (300–700ms) og knappen på raden under til slutt (400–780ms); Spond-setningen over knappen står i ro. Tallpanelene faller 10px og rulles ut ovenfra ett og ett (420/500/580ms, 450ms hver), og den røde topplinjen tegnes fra venstre 80ms etter hvert panel (`scaleX`, 400ms). Alt bruker `fill-mode: backwards`, så sluttilstanden er standardstilen. Forskyvningene er mindre enn avstandene, så ingenting overlapper på mobil.
- **Statusbytte i banneret:** når skriptet regner ut en annen tekst enn byggeverdien, viskes feltet som endres ut mot høyre og inn fra venstre (340ms, verdien 60ms etter nøkkelen), og teksten byttes mens feltet er skjult. Uendret tekst røres ikke, og spiller entreen fortsatt, byttes teksten rett. Én animasjon uten fill, så feltet aldri blir stående skjult.
- **Respons (`--t-press` 0.1s, `--t-fast` 0.2s, `--t-lift` 0.3s, `--t-zoom` 0.6s):** knapper løftes 2px ved hover og trykkes til `scale(.98)` ved klikk; klikkbare kort (`.card-link`) løftes 3px med `--shadow-lift` og `blue-mid`-kant; bilder i lenker (`.photo-frame`) zoomer til 1.03 inne i rammen; tekstlenker (lenker uten klasse og `.link`) har hårstrek i ro og en 2px strek som tegnes fra venstre ved hover og fokus; navlenker får en rød strek som tegnes ved hover og står fast for `aria-current`; HUD-kontroller får mørkere flate ved hover og `scale(.96)` ved klikk.
- **Redusert bevegelse:** varighet og forsinkelse settes til 0, så alt står i sluttilstand med en gang og ingenting er skjult. Statusbyttet skjer uten animasjon. 3D-presentasjoner vises som et statisk oversiktsbilde med tallene.

## Do's and Don'ts

### Do:
- **Do** bruk tokens fra den felles stilfilen, og aldri hardkodede hex-verdier.
- **Do** veksle mellom mørke og lyse seksjoner.
- **Do** sett alle viktige tall i tallpaneler eller i Barlow Condensed med tabulære sifre og dempet enhet.
- **Do** åpne seksjoner med Bebas-tittel og skråstilt aksentstrek, både på mørkt og lyst.
- **Do** bruk etikettfelt bare når de bærer informasjon (disiplin, status, dato).
- **Do** bruk klubbens egne bilder fra trening, ritt og NM, dempet med `brightness(0.75–0.85)` når tekst ligger over.
- **Do** gi alt som beveger seg et statisk alternativ under `prefers-reduced-motion`.
- **Do** gjør handlingen «Bli med på trening» (Spond) synlig i første skjermbilde på forsiden.

### Don't:
- **Don't** innfør flere skrifttyper enn Bebas Neue, Barlow Condensed og Barlow.
- **Don't** gi TV-grafikk avrundede hjørner, og ikke bruk radius over 6px noe sted.
- **Don't** bruk rødt til brødtekst, store flater eller mer enn ett ord per tittel.
- **Don't** gjør hele siden mørk. Lyse klubbseksjoner er halvparten av identiteten.
- **Don't** bruk emojier som ikoner.
- **Don't** sett små dekorative etiketter (kicker/eyebrow) over titler.
- **Don't** bruk løypefargene utenfor kart og løypeoversikter.
- **Don't** legg skygger på kort og paneler i ro.
- **Don't** finn på tall, resultater eller sitater for å fylle grafikkpaneler.
