# Lansering av sandesykkel.no

Sjekkliste for å gå fra forhåndsvisning til ekte side, og for å sende sanderittet.no videre. Stegene merket **(klarsignal)** endrer DNS eller den gamle siden og gjøres bare når klubben har sagt ja.

## Status

- Den nye siden bygges på grenen `astro` og publiseres som Cloudflare Worker `sandesykkel` (statiske filer fra `dist/`).
- Hele siden er stengt for søkemotorer: `public/robots.txt` sier `Disallow: /`, og `Base.astro` setter `noindex` på alle sider.
- Den gamle siden (sanderittet.no) ligger urørt på `main` og deployes fortsatt med FTP-workflowen og GitHub Pages. Webhotellet er betalt til april 2027.

## Publisere en ny versjon

```sh
npm run deploy        # astro build && wrangler deploy
```

Siden får adressen `https://sandesykkel.<konto>.workers.dev` til domenet er koblet på.

## Før lansering

1. Gå gjennom alle sidene på workers.dev-adressen, også på mobil.
2. Fyll inn `src/data/sanderittet.ts` (`nesteRitt`) når datoen for neste Sanderittet er klar.
3. Åpne for søkemotorer:
   - `public/robots.txt`: bytt til `Allow: /` og legg til `Sitemap:` om vi lager et nettstedskart.
   - `src/layouts/Base.astro`: sett standardverdien til `noindex = false`. Kåringer og 404 sender fortsatt `noindex` selv.
   - `/designprofil` og `/lab/loypepresentasjon` sender `noindex` selv og blir liggende utenfor søk.

## Koble på sandesykkel.no (klarsignal)

1. Legg sandesykkel.no til som sone i Cloudflare-kontoen og bytt navnetjenere hos registraren til de Cloudflare oppgir.
2. Legg til domenet på Workeren som Custom Domain (`routes` i `wrangler.jsonc` med `custom_domain: true`, eller i dashbordet). Legg også til `www.sandesykkel.no` og send den til hoveddomenet.

## Sende sanderittet.no videre (klarsignal)

Domenet ligger hos Domeneshop i dag (ns1–3.hyp.net).

1. Flytt DNS for sanderittet.no til Cloudflare (ny sone i samme konto), eller bruk Domeneshops videresending hvis den kan bevare stien.
2. Lag to videresendingsregler i Cloudflare (Rules → Redirect Rules) for sanderittet.no og www.sanderittet.no:
   - **Forsiden** `/` → `https://sandesykkel.no/sanderittet` med **302**. Midlertidig med vilje, så den kan pekes om hvert år uten at nettlesere husker den gamle.
   - **Alt annet** → `https://sandesykkel.no${path}` med **301**, så stien bevares.
3. Gamle sider og GPX-filer mappes videre i `public/_redirects` (f.eks. `/nm2026.html` → `/nm2026`, `/Rød Lang XCO.gpx` → `/gpx/rod-lang-xco.gpx`). Test med `curl -I` etter omleggingen.

## Før `astro` slås sammen med `main` (klarsignal)

Ellers deployer de gamle oppsettene Astro-kildekoden til webhotellet og GitHub Pages.

1. Slå av eller slett `.github/workflows/deploy.yml` (FTP).
2. Slå av GitHub Pages i repoinnstillingene.
3. Slå så sammen, og koble eventuelt repoet til Workers Builds, så hver push til `main` publiserer.

## Etter lansering

- Si opp webhotellet når sanderittet.no har gått via Cloudflare en stund uten feil (betalt til april 2027).
- Hvert år: oppdater `src/data/sanderittet.ts`, og pek 302-regelen for sanderittet.no om hvis rittet får egen side.
