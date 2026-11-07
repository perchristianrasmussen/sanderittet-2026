---
target: designprofil / forside-hero
total_score: 22
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 2
target_identity: "file:C:\\Users\\pekst\\Sanderittet\\sanderittet-2026\\src\\pages\\designprofil.astro"
target_fingerprint: "sha256:acfe9f36db52d047b494c6662bdbacd5c989fa6a13629c8ec2243fff65da4db6"
target_path: "C:\\Users\\pekst\\Sanderittet\\sanderittet-2026\\src\\pages\\designprofil.astro"
timestamp: 2026-11-07T11-55-51Z
slug: src-pages-designprofil-astro
---
Method: dual-agent (A: design review · B: detector + headless captures; no overlay injection possible)

## Heuristics (22/32, n/a: 7, 10)
1 Status 3 · 2 Real world 3 · 3 Control 3 · 4 Consistency 2 (red banner key looks clickable; two "Bli med" with different targets) · 5 Error prevention 3 · 6 Recognition 2 (age groups/times not in fold) · 7 n/a · 8 Minimalist 3 · 9 Error recovery 3 · 10 n/a

## Priority issues
- [P1] Banner key outranks CTA and looks like a button; CTA should be heaviest red block. (layout)
- [P1] Fold copy doesn't answer: is it for my child, can a beginner come, what is Spond; Spond note too small and after button. (clarify)
- [P2] Off-season banner "I påsken" vague although exact first date is computed. (clarify)
- [P2] Red diluted (~9 marks in fold); nav and hero "Bli med" go to different places. (quieter/clarify)
- [P2] Stat panels "Norgescup 2024" ambiguous (hosted vs raced); absolute top offset collides with wrapping nav 761–900px; no list semantics. (clarify/adapt)

## Detector / mechanical
Detector: 0 findings. Mobile HUD stat tile clips "KM" unit; footer link hover red-light 4.22:1 on dark; token names render "—red" with condensed font dash ligature; "1×" button needs aria-label; lang="no" → "nb".
