# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro (statisk, ferdig rendret) på Cloudflare Workers med statiske filer, domene sandesykkel.no. Bygges på grenen `astro`; den gamle siden (sanderittet.no, FTP-webhotell) ligger urørt på `main` og i `legacy/` til lansering.

## Users

**Primærbruker: nye familier.** Foreldre i Sande og omegn som vurderer å la barna begynne på sykkel. De lurer på hva det er, om det passer for barnet deres, når og hvor treningene er, og hvordan de melder seg på. Mange leser på mobil, ofte etter å ha hørt om klubben fra andre eller sett den på Lersbrygga.

Andre målgrupper (bekreftet, i prioritert rekkefølge etter primærbruker):
- **Rittdeltakere** som skal sykle Sanderittet eller andre arrangementer på Lersbrygga.
- **Eksisterende medlemmer** (ryttere og foreldre) som trenger treningsinfo, nyheter og kåringer.
- **Sponsorer, kommune og forbund** som skal se en seriøs klubb som er verdt å støtte og gi arrangementer.

## Product Purpose

sandesykkel.no er nettsiden til sykkelgruppa i Sande Sportsklubb. Den skal:
1. **Rekruttere til trening.** Gjøre det enkelt og trygt for nye familier å bli med, via Spond.
2. **Være hjemmet til Sanderittet.** `sandesykkel.no/sanderittet` er rittets faste adresse år etter år (info, løyper, påmelding, resultater). sanderittet.no videresendes dit.
3. **Vise frem Lersbrygga.** Arenaen og løypene som et sted å sykle, med løypekart, GPX og løypepresentasjoner.
4. **Ta vare på stolthet og historikk.** NM 2026, Norgescup og kåringer, som klubbens historie og som dokumentasjon overfor sponsorer og arrangører.

Suksess betyr først og fremst at nye familier finner frem til trening og melder seg inn i Spond-gruppa.

## Positioning

Klubben som har sine egne løyper og sin egen arena på Lersbrygga, som arrangerte Norgescup i 2024 og 2025 og NM i terrengsykling i 2026, og som samtidig er et lavterskeltilbud der barn ned til de yngste aldersgruppene trener sammen hver uke.

## Operating Context

- **Treninger** på Lersbrygga Idrettsanlegg, 3070 Sande i Vestfold, fra påske til høstferie. Mandager: opptil 10 år kl. 18:00–19:00, over 10 år kl. 18:00–19:30. Torsdager: 11 år og eldre kl. 18:00–19:30.
- **Påmelding og kommunikasjon** skjer i Spond (gruppelenke `https://group.spond.com/OXGYJ`).
- **Kontakt:** leder.sykkel@sandesk.no.
- **Moderklubb:** Sande Sportsklubb (`https://sandesk.no/grupper/sykkel/`).
- **Arrangementer:** Sanderittet (årlig), Norgescup 2024 og 2025, NM terreng 30.–31. mai 2026 (avholdt).
- **Kåringer:** årlige nominasjoner via et skjult skjema (noindex, Google Apps Script-endepunkt).

## Capabilities and Constraints

- **Løypekart:** egen side med MapLibre. Den har to visninger: et interaktivt oversiktskart over alle løyper (vis/skjul, forklaring, GPX-nedlasting) og en filmatisk 3D-løypepresentasjon per løype. Prototypen ligger i `C:\Claude-filer\Løypepresentasjoner\index.html`. Bygges som en selvstendig modul som senere kan skilles ut som en pakke.
- **Løyper (GPX):** XCO rød lang/kort, blå og grønn; XCC kortbane, grønn kort og XCC kort. Løypefargene følger aldersklasser.
- **NM 2026-siden** beholdes og merkes NM 2026, men skrives om som en historisk registrering av et avholdt mesterskap.
- **Kåringer-siden** forblir skjult og utenfor menyen, med samme skjema.
- **Gamle adresser** fra sanderittet.no (`nm2026.html`, `loyper.html`, `sponsorer.html`, `sanderittet-2026.html`, `sanderittet-20261.html`) skal fortsette å virke via videresending.
- **Språk:** norsk (bokmål).
- **Uavklart:** innhold på `/sanderittet` utenom sesong, og om det kommer nyheter eller en arrangementskalender.

## Brand Commitments

- **Sande Sportsklubb-logoen** brukes slik den er (`legacy/img/Sandelogo_nobg.png`, `legacy/img/Sandelogo.png`).
- **Rød og blå klubbfarger** skal være med. Eksakte nyanser kan justeres.
- **Tydelig del av Sande Sportsklubb**, med kobling til sandesk.no.

## Evidence on Hand

- **Bilder fra trening, ritt og NM** i `legacy/img/` (bl.a. `hero.jpg`, `trening.jpg`, `om_klubben.jpg`, `nm1–3.jpg`, `D60_*.jpg`, `IMG*.jpg`).
- **Video:** gjennomkjøring av rød løype (`legacy/img/rod-loype.mp4`).
- **Løypekart som bilder:** `legacy/img/XCO-løypekart.png`, `legacy/img/xcc-løypekart.png`.
- **GPX-filer** i `legacy/`.
- **Sponsorlogoer og -tekster** (`legacy/img/sponsor-*`, `legacy/sponsorer.html`): Gastromat, BD Samferdsel, Berghansen, Sande Dyreklinikk, GK, Rolls Sykkel, OneMed, Kjeldaas. Rabattavtale med Nordre Jarlsberg Badstue (`legacy/rabatt-badstue.pdf`).
- **Interaktivt arenakart** i Google My Maps (lenket fra dagens forside).
- **Mangler, og skal ikke finnes på:** resultater og deltakertall fra NM 2026, medlemstall, sitater fra foreldre eller ryttere, og priser eller kontingent.

## Product Principles

1. **Første trening først.** Hver side skal gjøre det lettere for en ny familie å komme seg til Lersbrygga en mandag.
2. **Seriøs arrangør, lav terskel.** NM-pondusen og det at barna har det gøy hører sammen. Ingen av delene skal skygge for den andre.
3. **Lersbrygga er stedet.** Løypene og arenaen er klubbens unike eiendel og skal vises frem konkret, med kart, tall og bilder.
4. **Ekte fra klubben.** Bruk egne bilder, egne tall og egen historie. Ingenting skal være oppdiktet eller generisk.
5. **Én adresse som varer.** Innhold og adresser bygges for å vare år etter år, med fast sti for Sanderittet og videresending av gamle lenker.

## Accessibility & Inclusion

Mange besøkende er foreldre på mobil, ofte i farten. Siden skal være lett å lese og bruke på telefon. Bevegelse og 3D-kart må respektere «redusert bevegelse» og ha en lett, statisk variant. Det er ikke satt noen formell tilgjengelighetsstandard ut over dette.
