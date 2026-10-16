UI POLISH BATCH — 8 user-approved visual refinements across Home, Details, Reports, Engine Control, History. THIS IS AN EXPLICIT USER-APPROVED EXCEPTION TO UI-FREEZE for the listed items only; after completion RE-CAPTURE baselines. Execute parts IN ORDER; verify each part on device before starting the next (step-by-step).

ROLE: senior RN engineer + UI craftsman. Evidence-first.

STANDING CONTRACTS: Performance G1–G10 · Header Standard · NO GIT · docs/ read-only · API key never printed.
ENVIRONMENT GUARDRAIL: No system/env/native-config changes. Build errors from environment → STOP + report.
STYLE RULES: All colors/radii/shadows via src/shared/theme tokens (ADD new tokens if missing, e.g. colors.line.strong = '#1A1A1A', radii.md = 8, shadows.card subtle). No raw hex in components; styles only via styles.ts + StyleSheet.create.

TOOLS/SKILLS: use mobile-mcp (mcp_mobile_take_screenshot / tap / swipe) for per-part device verification; React DevTools profiler via dev menu only if re-render doubt; e2e harness NOT configured → skip e2e.

════ PART 1 — HOME: status boxes below header ════
The 5 status boxes (Total/Running/Idle/Stop/No Data) currently sit tight against/overlapping the header gradient. Add proper separation: boxes start fully on the light background with a top gap (≈12–16pt) below the gradient end, matching the reference crop. Change only spacing (marginTop/paddingTop), not box internals.
VERIFY: screenshot Home top → gradient ends cleanly, boxes fully on light bg with gap.

════ PART 2 — HOME: asset card border + subtle shadow ════
Asset cards (Suzuki Mehran / Honda Civic blocks) have no visible border. Add a 1pt border using token colors.line.strong (near-black) around each asset card container + a SUBTLE shadow (Android elevation 2; iOS shadowOpacity 0.08, radius 4). Border is mandatory; shadow optional-but-recommended.
VERIFY: screenshot → border clearly visible on both cards; no layout shift.

════ PART 3 — HOME: Reports + View on Map buttons ════
Buttons are too small and stranded. Move them UP so they sit on the SAME visual row as the "Last Update" line (parallel to its clock icon), right-aligned; enlarge: height ≈40, paddingHorizontal ≈14, label 12pt semibold; keep icons; keep both buttons side-by-side with 8pt gap. Ensure no overflow at 390pt width (if tight, allow flexShrink on the address text, never on buttons).
VERIFY: screenshot → buttons aligned with Last Update row on right, clearly tappable size.

════ PART 4 — DETAILS: inner cards align with section bars ════
Fuel Sensor / Temperature Sensor / Quick Reports: the inner card grids are narrower/offset vs their dark section bars. Make inner card container horizontal margins EXACTLY equal to the bar's margins (same left/right edges). Grid gaps unchanged.
VERIFY: screenshot Details → bar edges and card edges vertically aligned on both sides.

════ PART 5 — DETAILS: black border on Select part ════
The white "Select ▾" area right of Fuel/Temperature bars: add 1pt border colors.line.strong around it (matching bar height, rounded right corners to match bar radius).
VERIFY: screenshot → border visible around Select area on both sensors.

════ PART 6 — REPORTS: consistent side margins + inner cards inside borders ════
Top sections (vehicle selector, calendar, hour/min rows) and report category cards currently have unequal side insets. Standardize ALL to marginHorizontal = sizes.marginH (16pt). Where a section container has a border, its inner cards must sit INSIDE the border with padding (never touching/overlapping the border line).
VERIFY: screenshot Reports full scroll → every section edge aligns to the same two vertical guides; inner cards inset from borders.

════ PART 7 — ENGINE CONTROL: top row equal boxes ════
Left car box and right Out-of-Fence box have unequal heights/alignment. Redesign minimally for balance: row uses alignItems:'stretch'; both boxes flex:1 with equal height; left box centers car image + caption; right box keeps Out of Fence pill + Running + address (text may wrap); 12pt gap between; same radius + border treatment as other cards.
VERIFY: screenshot → both boxes top and bottom edges aligned; no clipping.

════ PART 8 — HISTORY: rounded corners ════
Playback header bar + playback controls box + timeline/ruler container + History header bar + history list container: apply radii.md (8) rounding consistent with the rest of the app (top corners on header bars, full radius on boxes, list container rounded with clipped rows).
VERIFY: screenshot History → all listed blocks rounded like other cards; no square outliers.

════ PART 9 — BASELINE RE-CAPTURE (after ALL parts green) ════
Re-capture /ui-baseline/ screenshots for Home, Details, Reports, EngineControl, History (scroll-top + full-scroll each) and append to baseline_record.json: "UI polish batch v1 (user-approved) <date>". Old baselines for these 5 screens are superseded.

════ STATIC GATES ════
tsc --noEmit 0 · eslint --quiet 0 · jest pass · grep: no new deps; no raw hex in touched components (tokens only); no static style={{ additions; no console.log; new theme tokens documented in theme index.

════ DEVICE VERIFY (mobile-mcp, per part + final) ════
P1–P8: after EACH part, screenshot the target screen on device (R9YR30BS1LJ) and confirm the stated VERIFY line before proceeding to next part. If a part regresses layout (overflow/clipping), fix within that part before moving on.
FINAL: full regression pass — all 5 screens scroll top→bottom (nothing clipped, scroll-end gap intact above bottom nav), bottom nav + headers unchanged, calendar 3-click reset still works (History + Reports), playback controls still functional, maps still render (from Prompt A fix).
Profiler spot-check: Home + Details idle re-renders = 0.

REPORT: | file | lines | part-id | + per-part VERIFY screenshots list + static gate table + final regression checklist + "baseline re-captured for 5 screens" + "Env guardrail: no system/env/native-config changes made". NEVER print API key.
DO NOT: change behavior/logic (playback, calendar, nav wiring); touch frozen items outside the 8 listed; add deps; git ops; docs updates.