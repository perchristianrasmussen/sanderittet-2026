---
target: designprofil / forside-hero
total_score: 21
max_score: 32
na_heuristics: 7,10
p0_count: 1
p1_count: 2
target_identity: "file:C:\\Users\\pekst\\Sanderittet\\sanderittet-2026\\src\\pages\\designprofil.astro"
target_fingerprint: "sha256:1a7456899797240232425c248489d849fc622cffb5f2921295588e4d2f198441"
target_path: "C:\\Users\\pekst\\Sanderittet\\sanderittet-2026\\src\\pages\\designprofil.astro"
timestamp: 2026-11-07T11-10-12Z
slug: src-pages-designprofil-astro
---
Method: dual-agent (A: design review · B: detector + headless captures; no overlay injection possible)

## Heuristics (21/32, n/a: 7, 10)
1 Status 2 (hardcoded "Neste trening Man 18:00" is false off-season) · 2 Real world 2 (Spond/Norgescup unexplained, no age group) · 3 Control 3 (new tab not announced) · 4 Consistency 2 (three brand names, non-link card lifts, light sections adjacent) · 5 Error prevention 3 · 6 Recognition 3 · 7 n/a · 8 Minimalist 3 · 9 Error recovery 3 · 10 n/a

## Design specificity
Authored for the club (stripe, red word, TV panels, real rider). Falls back where hero photo and sub-line favour race pride over "my small kid can start".

## Priority issues
- [P0] Hardcoded next training in hero; compute from season schedule, off-season banner otherwise. (harden)
- [P1] Banner hierarchy inverted: key larger than value; age group missing; stat panels hide age in unit; 10-year overlap. (typeset/clarify)
- [P1] Hero photo + fold tone favour NM pride over beginners; contract asks for training photo. (clarify/adapt)
- [P2] Mobile: stat panels above H1, rider cropped, CTA at fold edge, nav links hidden without menu. (adapt/layout)
- [P2] Spond handoff unexplained, no new-tab cue, HUD toggles lack pressed state, non-link card lifts, weak non-text contrast (input/outline/HUD borders), input outline removed, red-light hover 4.24:1, hero/nav outside main. (harden)

## Detector
12 advisory (9 font-size off ramp, 3 HUD terrain colours), 0 errors.
