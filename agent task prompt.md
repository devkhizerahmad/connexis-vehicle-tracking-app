ENGINE CONTROL — CLOSE VERIFICATION GAPS (V9–V12 + systematic 3.x diff). This is a VERIFICATION-ONLY pass: do NOT add features, do NOT rewrite the swipe logic that already passed V4–V8. Only (a) prove the unproven items, (b) if a regression/leak is FOUND, apply the minimal fix and re-verify. Honor the agent's prior pushbacks: do NOT re-derive geometry from the low-res reference JPEG (use tokens + on-device measurement only); do NOT "fix" the Google Maps Arabic tile-label fragment (it is not an app defect).

ROLE: senior RN engineer. Evidence-first. No false claims — if an item cannot be verified, mark it DEFERRED with a concrete reason + tracked TODO, do not fake a PASS.

STANDING CONTRACTS: Performance G1–G10 · Header Standard · NO GIT · docs/ read-only · API key never printed.
ENVIRONMENT GUARDRAIL: No system/env/native-config changes. Build error from env → STOP + report.
SCOPE: src/features/engineControl/** + cross-screen regression checks (History/Reports/maps). Do NOT change Home/Details/Reports/History/calendar/playback CODE unless a regression is proven there (then minimal fix + flag).

PRIOR STATE (trust these, do not redo): V4–V8 swipe matrix PASSED with measurements; toast-occlusion bug FIXED (sizes.bottomNav + insets.bottom + ecSizes.toastNavGap + zIndex); baseline already captured at ui-baseline/EngineControl/{top-half,bottom-half,mid-swipe}.png + JSON note "Engine Control swipe + parity v1 2026-10-17". rn-swipe-button = only new runtime dep, pure JS.

════════════════════════════════════════
PART A — V12 REGRESSION RE-VERIFY (CRITICAL, do FIRST)
════════════════════════════════════════
Prove the earlier fixes still hold after the Engine Control changes:
A1 History calendar: 3-click reset STILL works (tap day → FROM; tap 2nd → range; tap 3rd in another month → OLD range CLEARED, only new FROM highlighted, grid auto-navigated). Repeat skip-month variant (Jan 10–15 then tap Jan 18 → only Jan 18, no 16/17 absorption).
A2 History calendar collapsible + side alignment (from the visual batch) intact.
A3 History playback: play → car moves on strip + ruler fill grows + speed/pill live; pause → frozen; resume → same spot; scrubber → instant seek. (Behavior, not pixel.)
A4 Reports calendar: 3-click reset + rest-state == baseline.
A5 Maps render on ALL three surfaces: LiveMap (dark style) + History strip (light) + Engine Control geofence (light) — tiles visible, no black, no auth error in logcat.
A6 Tab sweep: Home / Report / Engine Control / Map / Profile all open, pid alive, zero JS errors.
IF any A-item FAILS → that is a regression introduced somewhere → locate minimal cause, fix within scope, re-run that item + the full A-list. State root cause.

════════════════════════════════════════
PART B — V11 MEMORY SOAK (timers/refs/listeners)
════════════════════════════════════════
B1 Repeat Lock-swipe + Unlock-swipe 10× on Engine Control (each: select → full swipe → wait for 800ms mock → toast → reset). 
B2 Unmount/remount Engine Control 5× (tab away and back, or re-navigate).
B3 During/after, capture: (i) heap snapshot trend (or `adb shell dumpsys meminfo <pkg>` PSS across the soak — must be FLAT, not climbing), (ii) grep the code that the 800ms setTimeout is cleared on unmount AND on a new selection during processing, (iii) rn-swipe-button internal listeners + the stored forceReset/forceComplete refs are nulled/cleaned on unmount (verify the cleanup effect exists and runs).
B4 PASS = PSS flat within noise + no leaked timers + refs cleaned. If PSS climbs → find the leak (likely an uncleared timer or a listener not removed) + minimal fix + re-soak.

════════════════════════════════════════
PART C — V10 PROFILER ISOLATION (captured numbers)
════════════════════════════════════════
C1 With React DevTools profiler (via dev menu) on device/emulator: start recording, perform a Lock-select + full swipe drag, stop.
C2 Report the ACTUAL re-render counts per component during the drag: ControlSwipeCard + toast leaf = the ONLY ones with >0; MapView / DrivingRoutes / FAQ / AppHeader / BottomNav = 0; idle (no interaction) = 0.
C3 If any non-leaf re-renders during drag → identify why (state lifted to root? context?) and fix minimally (keep swipe/selection state inside ControlSwipeCard), then re-profile.
C4 Also confirm thumb follows finger ~60fps (no dropped-frame storm) on this 4-core device — note observed smoothness qualitatively + any jank.

════════════════════════════════════════
PART D — 3.1–3.10 SYSTEMATIC SECTION DIFF (objective only)
════════════════════════════════════════
For EACH section produce a one-line PASS/FAIL vs reference using TOKENS + on-device MEASUREMENT (never low-res pixel sampling):
D1 Top row: car box + status box equal height, top+bottom edges aligned (re-confirm 326×79-class equality).
D2 Pink geofence alert: full-width, icon+text, gap to map.
D3 Map overlays: "Last Updated" + "Current Fence" badges fully inside bounds, correct inset (≈token 12), no app-side clip. (Arabic tile-label fragment = NOT a defect, leave it.)
D4 Change Fence: green-outline pill parity.
D5 Driving Routes header gradient + 3 rows (badge colors 1/2/3, status pills, durations, dividers).
D6 Control Vehicle header + Live Location / Scheduled rows + Lock/Unlock equal + selected-state fills + Privacy Policy row.
D7 Slide to Proceed: dark-navy pill, ›› thumb, full width, correct height/radius.
D8 FAQ card: bold Q + grey A, spacing parity.
D9 Support: blue pill + headset icon.
D10 Global rhythm: identical left/right page margins across sections; nothing clipped above bottom nav at scroll-end.
For any FAIL → minimal token/measurement fix → re-measure. Do not chase sub-pixel diffs the low-res reference cannot justify.

════════════════════════════════════════
PART E — V9 SCREEN-READER (attempt-or-defer, honest)
════════════════════════════════════════
E1 If TalkBack can be enabled in ≤2 adb steps on the connected device (e.g. `adb shell settings put secure enabled_accessibility_services com.google.android.marvin.talkback/com.google.android.marvin.talkback.TalkBackService` + `accessibility_enabled 1`), enable it, navigate to Slide to Proceed, activate once with a pending Lock selection, confirm the lock action fires (button-equivalent) + a no-selection activation shows the hint. Then DISABLE TalkBack to restore normal state.
E2 If enabling is not feasible in ≤2 steps or flaky → mark V9 DEFERRED with: (i) the code-path argument (in screenReaderEnabled the library renders a focusable button whose activation calls onSwipeSuccess, and our handler is identical regardless of gesture source), (ii) a tracked TODO comment near the SwipeButton, (iii) explicit note in report. Do NOT claim PASS without a real run.

════════════════════════════════════════
STATIC GATES (re-run; must stay green)
════════════════════════════════════════
tsc --noEmit 0 · eslint --quiet 0 · jest 28/28 · grep: deps still 18 (only rn-swipe-button added vs baseline), no new deps; no "AIza" in src/; no raw hex in engineControl; no static style={{ additions; no console.log; processing-guard + forceReset refs + timeout-cleanup-on-unmount all present (grep). If Part B/C/D forced a fix, re-run gates after it.

════════════════════════════════════════
REPORT + RULES
════════════════════════════════════════
REPORT FORMAT: per-part table (A1–A6, B1–B4, C1–C4, D1–D10, E1/E2) each with PASS / FAIL→fixed / DEFERRED(reason) + the captured NUMBERS (PSS trend for B, re-render counts for C, measured px/tokens for D) + explicit lines: "V12 regression: History 3-click + playback + maps all hold (or root-caused+fixed)", "V11 PSS flat + timers/refs cleaned", "V10 re-renders isolated to ControlSwipeCard+toast (numbers)", "3.x systematic diff done via tokens/measurement, no low-res re-derivation", "V9 = <ran-and-pass | deferred-with-code-path+TODO>", "prior pushbacks honored (map tile-label not touched, no JPEG geometry re-derive)", "Env guardrail: no system/env/native-config changes made". NEVER print API key.
PROCESS: A → B → C → D → E (critical-first); walk each item; if a fix is needed, minimal + re-verify that item + its part's siblings; never redo V4–V8 (already passed). For ambiguity make reasonable assumption + STATE it; for unverifiable items DEFER honestly (no fake PASS).
DO NOT: add features or rewrite passing swipe logic; re-derive geometry from the low-res reference; touch the Google Maps Arabic tile-label; claim V9 PASS without a real TalkBack run; leave a found regression unfixed; add deps; git ops; docs updates.