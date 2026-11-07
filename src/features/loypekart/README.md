# Løypekart: løypepresentasjon

En filmatisk 3D-flytur langs en GPX-løype, i stil med TV-grafikk: terreng, flyfoto eller Kartverket topo, kameraet som følger løypa, levende tall (distanse, høyde, stigning), høydeprofil, bannere og pinner for splitter, høyeste punkt og bratteste stigning, og en oppsummering til slutt.

Dette er en direkte port av prototypen i `C:\Claude-filer\Løypepresentasjoner\index.html` (MapLibre 4.7.1 fra unpkg) til MapLibre GL 6 og Astro. Oppførselen skal være den samme. Det er ikke gjort noe redesign eller optimalisert for jevnhet ennå (se «Neste steg»).

## Arkitektur

```
src/features/loypekart/
├── motor/                  Ren TypeScript, ingen DOM eller MapLibre. Kan kjøres i Node.
│   ├── konfig.ts           CFG (kamera, tider, terreng), flis-URL-er, attribusjon, løypestrekens farger
│   ├── geo.ts              haversine, bearing, tileXY, lerp, clamp, easing, angDiff, formatering
│   ├── rute.ts             parseGpx (XML-parseren sendes inn), buildRoute, along
│   ├── hoyde.ts            Terrarium-dekoding, demFliser, elevAt, buildProfile, eleAt, gradAt
│   ├── hendelser.ts        buildEvents (splitter, høyeste punkt, bratteste, mål)
│   └── kamera.ts           fasetider, ramp, introCam, followCam, outroCam, mix, targetBearing
├── kart/                   MapLibre- og DOM-limet
│   ├── stil.ts             kartstilen (sat, topo, dem, relieff, løypelag) og line-gradient-uttrykket
│   ├── dem.ts              henter Terrarium-fliser og leser pikslene (adapter for motor/hoyde.ts)
│   └── presentasjon.ts     kontrolleren: tilstand, tikkløkke, render, updateProgress, markører,
│                           banner, høydeprofil på canvas, kontroller, tastatur, resize, dra-og-slipp, ?gpx=
├── data/loyper.ts          indeks over klubbens GPX-filer i public/gpx/
└── Loypepresentasjon.astro komponenten: HUD-markup og stiler, starter kontrolleren i et klient-skript
```

- **Motor** vet ingenting om kartet. Alt som kan regnes ut fra rute og tid ligger her, så det kan testes i Node (`node scripts/check-loypemotor.mjs`).
- **Kart** eier MapLibre-instansen og DOM-en. `startPresentasjon(root, valg)` finner elementene sine med `data-ref` inne i `root`, så flere instanser ikke krasjer i id-er. Den returnerer `{ map, destroy }`.
- **Komponenten** fyller forelderen (gi den en høyde). Props: `gpx` (URL), valgfritt `tittel` og `disiplin` (ellers leses de fra filnavnet, som i prototypen), og `lesUrlParameter` for helsides bruk: da leses `?gpx=` (slug fra `data/loyper.ts` eller en URL) og dokumenttittelen settes.

## Lab-siden

`/lab/loypepresentasjon` (ikke lenket fra menyen, `noindex`). Presentasjonen i hele vinduet med en løypevelger nede til venstre som sender `?gpx=<slug>`. Standard er Rød lang (XCO).

```
npm run dev
# åpne http://localhost:4321/lab/loypepresentasjon?gpx=kortbane-xcc
```

Tastatur: mellomrom spiller av og pauser, R starter på nytt, H skjuler knappene. Dra en GPX-fil inn i vinduet for å vise den.

Merk: i hodeløs Edge/Chrome med `--virtual-time-budget` blir kartet stående på lasteskjermen, fordi MapLibre-workeren ikke får kjøre i virtuell tid (GeoJSON-kilden blir aldri lastet, så `load` kommer aldri). I sanntid (CDP, vanlig nettleser) virker den. Med SwiftShader går bildefrekvensen så lavt at tiden i presentasjonen går sakte (dt kappes på 0,1 s per bilde).

## Kjente forskjeller fra prototypen

- **MapLibre 6 i stedet for 4.7.1.** Navngitte importer (`Map`, `Marker`, `AttributionControl`, `LngLat`, `setWorkerUrl`), ingen global `maplibregl`.
- **Workeren settes eksplisitt** (`setWorkerUrl` med `maplibre-gl-worker.mjs?url`). v6 finner den ellers relativt til sin egen modulfil, som ikke finnes etter at Vite har bundlet koden.
- **Kantutjevning er faktisk på.** Prototypen ga `canvasContextAttributes: { antialias: true }`, men det valget fantes ikke i 4.7.1 (der het det `antialias`), så den kjørte uten. I v6 virker det. Det kan koste ytelse på svake maskiner.
- **Oversiktskameraet regnes fra komponentens størrelse** (`root.clientWidth/Height`) i stedet for `innerWidth/innerHeight`. I hele vinduet er det det samme.
- **Navn fra indeksen.** Prototypen leste navn og disiplin fra filnavnet. Filene har nå ASCII-navn (`rod-lang-xco.gpx`), så laben sender inn navnet fra `data/loyper.ts` («Rød lang»). Dra-og-slipp leser fortsatt fra filnavnet.
- **Dokumenttittelen** settes bare når `lesUrlParameter` er på, så en innebygd presentasjon ikke overskriver sidetittelen.
- **Tokens i HUD-en.** Rødt er klubbens `--red` (#c8241a) og `--red-light` i stedet for prototypens #ff2a3a/#ff4757, `--night` i stedet for #05070a, og skrift og størrelser fra `tokens.css` der de var 1:1 (`--fs-tag`, `--fs-label`, `--fs-stat`, `--fs-banner` osv.). Oppsett, størrelser og koreografi er som før. Løypestreken i selve kartet (`RUTEFARGE` i `konfig.ts`) har fortsatt prototypens farger.
- **UI-komponentene** (`Tag`, `StatPanel`, `Banner`) er ikke brukt: polstringen er litt annerledes (6px mot 5px i etikettfeltet, topplinjen som eget lag i tallpanelet), og tallene skrives om fra skriptet. HUD-en har egen markup med de samme tokenene.
- **Bunten er stor** (MapLibre ~1 MB pluss workeren ~0,5 MB). Vite advarer om chunk over 500 kB. Den lastes bare på sider som bruker komponenten.

## Neste steg

1. **Jevnhet**
   - Ikke kall `setPaintProperty('line-gradient')` hvert bilde (det bygger fargerampen på nytt). Bruk en egen fremdriftskilde som oppdateres sjeldnere, eller trim linja (`line-trim-offset` / del geometrien).
   - Oppdater tallteksten bare når verdien endres (faste bredder, tabulære sifre).
   - Tegn høydeprofilen én gang og flytt bare fremdriften og markøren (clip-path eller et eget lag over).
   - Animer overlegg bare med `transform`/`opacity` på `--ease-out-expo`.
2. **Redusert bevegelse:** under `prefers-reduced-motion` vises et statisk oversiktsbilde med tallene (DESIGN.md, Bevegelse).
3. **Mobil:** vis et plakatbilde (stillbilde av oversikten) til brukeren trykker spill av, så terreng og fliser ikke lastes før det trengs.
4. **Lisenser:** Esri World Imagery sine vilkår for offentlige nettsteder må sjekkes, eller kilden byttes til norsk ortofoto. Kartverket topo er CC BY 4.0 og krever attribusjon. AWS Terrain Tiles krever attribusjon (inkludert kildene bak).
5. **Forhåndsberegning ved bygg:** lengde, høydemeter, høyeste punkt og bratteste stigning regnes ut ved bygg (motoren kjører i Node). Vurder Kartverkets høydedata for nøyaktighet; Terrarium på z15 er grovt i skog.
6. **Oversiktskart over alle løypene** til `/loyper`.
