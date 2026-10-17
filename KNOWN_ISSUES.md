ENGINE CONTROL — UI PARITY CLOSE (6 pending sections: D2, D4, D5, D8, D9, D10). TWO PHASES, executed in order: PHASE 1 = static code inspection + minimal fixes (NO device, NO mobile-mcp) — this is the priority and is tooling-degradation-proof; PHASE 2 = device render-confirmation (HB-gated, best-effort). Do NOT rewrite passing swipe logic, do NOT probe the parked map leak, do NOT touch other screens, do NOT start the playback root-cause session. Honor prior pushbacks: NO low-res JPEG geometry re-derivation (use tokens + on-device measurement for numbers; reference JPEG for STRUCTURE/order/relative-proportion only); do NOT "fix" the Google Maps Arabic tile-label fragment (not an app defect). Context-budget aware: if budget runs short, DEFER honestly (no fake PASS).

ROLE: senior RN engineer + UI craftsman. Evidence-first. No false claims. Every conclusion cites file:line (Phase 1) or a11y-tree + token/measurement (Phase 2).

════════════════════════════════════════
STANDING CONTRACTS + GUARDRAILS
════════════════════════════════════════
- Performance G1–G10 (Hermes, New Arch, React 19, Reanimated 4 installed) · Header Standard · NO GIT · docs/ read-only (KNOWN_ISSUES.md lives at repo ROOT) · API key never printed (grep "AIza" src/ = 0).
- ENVIRONMENT GUARDRAIL: No system/env/native-config changes (JAVA_HOME/ANDROID_HOME/SDK/gradle build config/manifest). Build error from env → STOP + report; never blind-fix code.
- STYLE RULES: all colors/radii/sizes/shadows via src/shared/theme tokens (ADD a token only if genuinely missing; document it in the theme index). No raw hex in components; styles only via styles.ts + StyleSheet.create; no static style={{ in new/edited JSX.
- SCOPE: src/features/engineControl/** ONLY (layout/spacing/token/size/section-order of the 6 sections below). Do NOT change behavior of swipe/lock/unlock/navigation/map. Any fix is style/layout-only; flag it.

════════════════════════════════════════
PRIOR-VERIFIED STATE (trust, do NOT redo — measured in earlier sessions)
════════════════════════════════════════
- D1 top-row equal boxes = PASS (326×79-class equality). D3 map overlays/badges = NOT a defect (Arabic tile-label pushback honored; map network-blocked = infra note, key valid & auth-clean). D6 Lock/Unlock equal + selected fills = PASS (326×79 each, fill→lockBg exact, border 3→5px). D7 Slide pill = PASS (rail 675×74).
- Swipe matrix V4–V8 = PASS; toast-occlusion = FIXED; V9 TODO present at SwipeRail; map leak = PARKED (KNOWN_ISSUES.md + GeofenceMap TODO, 4-step plan). Calendar (1a–1d) + playback = separate tracks, NOT in this prompt's scope.
- Static gates green last sessions (tsc 0, eslint 0, deps 18 = only rn-swipe-button vs baseline, guards + both TODOs present, jest 28/28).
Do NOT re-measure D1/D3/D6/D7; only glance-confirm they still hold if you are already on the same screen.

REFERENCE IMAGE (open for STRUCTURE/order/relative-proportion; NEVER pixel-sample it for exact px — it is low-res 301×1280): D:\khizer_workspace\ConnexisTracker\design-references\<engine control reference>.jpeg
Expected section order top→bottom (from reference): top row (car box + Out-of-Fence status box) → pink geofence alert → light map (geofence circle + pins + "Last Updated"/"Current Fence" badges) → green-outline Change Fence → Driving Routes (dark→red gradient header + 3 numbered rows w/ status pills + durations) → Control Vehicle (gradient header + Live Location + Scheduled Remote Starts + Lock/Unlock pair + Privacy Policy + dark-navy Slide to Proceed ››) → FAQ card (bold Q + grey A) → blue Support pill.

════════════════════════════════════════
PHASE 1 — STATIC CODE INSPECTION + MINIMAL FIXES (NO device, NO mobile-mcp) — PRIORITY
════════════════════════════════════════
Read the Engine Control screen + its section components (under src/features/engineControl/**). For EACH of the 6 pending sections, verify against the reference STRUCTURE + the theme tokens, and fix any objective FAIL (style/layout only). Cite file:line for every finding.
1.1 D2 — Pink geofence alert: confirm it EXISTS, is full-width, rounded, has the red alert-circle icon + the exact mock text, and has a consistent vertical gap to the map below (token-based, not hardcoded px). FAIL→fix spacing/structure.
1.2 D4 — Change Fence: confirm green-outline full-width pill, centered icon+label, height/radius via tokens (radii.pill or existing). FAIL→fix.
1.3 D5 — Driving Routes: confirm gradient header bar EXISTS with correct dark→red direction; confirm 3 rows each = colored numbered square badge (1 green / 2 yellow / 3 red) + bold title + colored subtitle (location token) + clock+time line + status pill (Moving green / Idle yellow / Stop red) + right-aligned duration; confirm uniform row padding + divider parity. FAIL→fix the offending token/structure.
1.4 D8 — FAQ card: confirm white rounded card; numbered items with BOLD question + grey answer; spacing/line-wrap parity; reference copy kept VERBATIM from mock (do NOT "correct" typos — flag if any copy differs from mock and leave it). FAIL→fix spacing.
1.5 D9 — Support: confirm blue filled full-width pill, centered headset icon + label. FAIL→fix.
1.6 D10 — Global rhythm: confirm ALL sections share identical left/right page margins (sizes.marginH token) and consistent inter-section vertical gaps; confirm NO section is MISSING or OUT OF ORDER vs the reference list above; confirm nothing is clipped at scroll-end above the bottom nav (Support fully visible). FAIL→fix the inconsistent margin/gap or reorder.
PHASE 1 OUTPUT: a per-section PASS / FAIL→fixed table with file:line evidence. If any fix landed → re-run static gates (below) before Phase 2. If NO fix needed → gates cited from prior state.

════════════════════════════════════════
PHASE 2 — DEVICE RENDER-CONFIRMATION (HB-gated, best-effort; only what code can't prove)
════════════════════════════════════════
GOAL: catch render-level issues Phase 1 can't see — overflow, clipping, gross visual proportion, real on-screen margin alignment. This is NOT a re-do of Phase 1; it is the final visual seal.
STANDING RULES (apply to every device interaction):
- R1 a11y-tree-first: locate targets BY ROLE+LABEL/TEXT; act by element handle/id; NEVER x/y.
- R2 wait for hydration (poll tree until interactive nodes exist; >8s normal on this 4-core device).
- R3 one call per intent. R4 if a target is unlabeled, ADD accessibilityLabel (flag it), never guess coords. R5 scroll by element/labeled scroll, re-read tree after each scroll.
- R6 region band-limit: constrain any text-lookup to its container/y-band (evidence: calendar text collides with scrubber text on other screens; here ensure route/FAQ labels aren't matched globally).
- R7 no cross-dump handle reuse: fresh dump per tap; never chain a handle across a re-render.
HEALTH-CHECK GATE + CIRCUIT-BREAKER:
- HB1: ONE a11y-tree read first; ASSERT app package (com.connexistracker) is the returned window, NOT Samsung systemui.
- HB2: if systemui-only → retry ONCE after 2s; if still systemui-only → STOP immediately (do NOT poll 6×, do NOT fall back to screenshots/pixels). Report "mobile-mcp attach degraded after restart — user-side infra issue" + restart commands (adb kill-server/start-server, MCP restart, force-stop + run-android). DEFER Phase 2; Phase 1 results STAND.
- HB3: proceed only if app window + enumerable nodes present.
V-ITEMS (only if HB passes): V1 Engine Control top-half screenshot/tree → D2/D4/D5 visible + not clipped + margins aligned to the same two vertical guides. V2 bottom-half (scroll via R5) → D8/D9/D10 visible + Support fully above bottom nav + no scroll-end clip. V3 holistic order check vs reference list (nothing missing/out-of-order). V4 regression glance: D1/D6/D7 still look right (quick, one measurement each); one Lock-swipe + one Unlock-swipe via tree taps → toasts fire; header/bottom-nav unchanged; logcat clean.
If HB2 trips at any point → STOP Phase 2, mark V1–V4 DEFERRED-HB, keep Phase 1 verdict.

════════════════════════════════════════
BUDGET GUARD + HARD SCOPE BOUNDARY
════════════════════════════════════════
Phase 1 is the deliverable. Phase 2 is best-effort AFTER Phase 1 is complete + gates green. Do NOT start the playback root-cause session, do NOT probe the map leak, do NOT do V10 profiler numbers or V9 TalkBack here (those are parked). If budget runs short mid-Phase-1, finish the current section, then DEFER the rest with a one-line reason each — NEVER fake a PASS.

DEFERRED-TO-LATER-SESSIONS (carry forward verbatim, do not lose):
- Playback root-cause static inspection (H1/H2/H3 → verdict A–E) + its device fix session (needs phone data/WIFI on for marker visibility).
- V10 profiler re-render numbers (by-construction+grep evidence exists; needs one captured run).
- V9 TalkBack run-or-defer (code-path TODO present at SwipeRail).
- Map-leak dedicated diagnostic session (KNOWN_ISSUES.md 4-step plan) — BEFORE release sign-off.
- D-parity for the OTHER screens if any remain open (Home asset-card footer was a separate prompt; verify it landed).

════════════════════════════════════════
STATIC GATES (re-run ONLY if a Phase-1 fix landed; else cite last-known)
════════════════════════════════════════
tsc --noEmit 0 · eslint --quiet 0 · jest pass (re-run ONLY if a fix landed; else cite last-known 28/28) · grep: deps still 18 (only rn-swipe-button vs baseline); no "AIza" in src/; no raw hex in engineControl; no static style={{ additions; no console.log; processing-guard + forceReset refs + timeout-cleanup-on-unmount STILL present (swipe untouched); V9 TODO + map-leak TODO still present; any new token documented in theme index; any accessibilityLabel added flagged.

════════════════════════════════════════
REPORT + RULES
════════════════════════════════════════
REPORT FORMAT: Phase-1 per-section table (D2,D4,D5,D8,D9,D10) each = PASS / FAIL→fixed with file:line evidence + Phase-2 per-V-item table (V1–V4) each = PASS / FAIL→fixed / DEFERRED-HB(reason) + the HB gate outcome + explicit lines: "PHASE 1 static inspection done — tooling-degradation-proof, no device used for the bulk of parity", "every Phase-1 conclusion cites file:line", "PHASE 2 a11y-tree-first + R6/R7 + HB circuit-breaker honored (degraded tree cost ≤2 reads, never blind taps)", "prior-verified D1/D3/D6/D7 trusted, not redone", "swipe logic NOT touched (guards present)", "map leak NOT probed (parked)", "playback root-cause NOT started (parked)", "no low-res JPEG re-derive; Arabic tile-label untouched; reference copy verbatim", "baseline re-captured only if a fix landed (V7-style)", "context-budget honored: no fake PASS, deferrals explicit", "Env guardrail: no system/env/native-config changes made". NEVER print API key.
PROCESS: Phase 1 (6 sections, read+fix, cite file:line) → static gates (if fixed) → Phase 2 (HB gate → V1–V4, best-effort) → report. Walk each section to a cited conclusion; minimal style/layout fix + re-verify only on a proven FAIL; never redo prior-verified state. For ambiguity make reasonable assumption + STATE it; for unverifiable items DEFER honestly.
DO NOT: call mobile-mcp in Phase 1; use blind/hardcoded coords or pixel taps/scrolls in Phase 2; tap before hydration; poll a degraded tree >2 reads; fall back to screenshots when tree is systemui-only; match text globally without region band-limit (R6); reuse a handle across a re-render (R7); rewrite swipe/lock/unlock logic; probe the map leak; start playback root-cause / V10 / V9 here; re-derive geometry from the low-res reference; touch the Arabic tile-label; "correct" reference copy/typos; change behavior or other screens; claim PASS without file:line (P1) or a11y evidence (P2); add deps; git ops; docs/ edits (KNOWN_ISSUES.md stays at root).