---
target: designprofil / forside-hero
total_score: 22
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 1
target_identity: "file:C:\\Users\\pekst\\Sanderittet\\sanderittet-2026\\src\\pages\\designprofil.astro"
target_fingerprint: "sha256:6f16b02a9bef17c6f057187a042e17ba290d53a8f61b2135f3c1239a40eb9cba"
target_path: "C:\\Users\\pekst\\Sanderittet\\sanderittet-2026\\src\\pages\\designprofil.astro"
timestamp: 2026-11-07T12-27-50Z
slug: src-pages-designprofil-astro
---
Method: dual-agent (A: design review · B: detector + headless captures; no overlay injection)

## Heuristics (22/32 comparable, n/a: 7, 10; reviewer also scored H10 = 3 → 25/36)
1 Status 2 (banner ignores age group) · 2 Real world 3 · 3 Control 3 · 4 Consistency 3 · 5 Error prevention 2 (banner can point parents of young kids to Thursday 11+ session) · 6 Recognition 3 · 7 n/a · 8 Minimalist 3 · 9 Error recovery 3 · 10 (3, not counted)

## Priority issues
- [P1] Banner not group-aware: off-season "Tor 1. april" and in-season "Tor 18:00" are 11+ sessions; youngest group starts Monday. (clarify/harden)
- [P2] H1 crosses rider at 820–1024; red "SYKKEL" low brightness contrast over photo; subline crosses course tape at 1440. Per-breakpoint object-position + local scrim. (adapt)
- [P2] Hero doesn't answer min age / gear / can we just come — needs club facts; optional secondary link "Slik er en treningskveld". (clarify/onboard)
- [P2] Organiser panels: "Arrangør" ×3, wraps at 390. (typeset)
- [P3] Nav CTA competes with hero CTA on homepage. (distill)

## Detector / mechanical
Detector 0 findings. "Ø" gap with letter-spacing in Barlow Condensed caps ("ARRANGØ R"); dead "Spill av" demo button; inconsistent list semantics for non-hero stat panels; global a:hover red on dark for small text (3.17:1); double-encoded UTF-8 in global.css comments.
