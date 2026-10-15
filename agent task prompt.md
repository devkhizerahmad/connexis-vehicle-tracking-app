SHARED DATERANGEPICKER MIGRATION — Replace hand-rolled calendar with react-native-ui-datepicker (mode="range"), fix History's view-sync bug structurally, unify Reports + History to use the SAME shared component, keep Hour/Min pickers UNCHANGED.

ROLE: senior React Native engineer. Evidence-first. Do NOT deviate without FLAGGING.

STANDING CONTRACTS (active, binding):
- UI-FREEZE: History + Reports reference-locked vs /ui-baseline/. Rest-state pixel-identical. Interaction may change selection but NEVER layout/colors/strings outside the calendar itself.
- Performance G1–G10: Hermes, New Architecture (Fabric + TurboModules), React 19, Reanimated 4 installed.
- Header Standard · NO GIT operations · docs/ read-only (sync deferred) · API key never printed (grep "AIza" src/ = 0).

NEW DEPENDENCY APPROVAL (explicit, one-time):
- Install `react-native-ui-datepicker` (MIT, lightweight, ~5-10KB minified)
- Install `dayjs` (~2KB, required for date math in auto-navigate logic)
- These are the ONLY new runtime deps for this task. Verify package.json after install.
- Rationale: replaces buggy hand-rolled calendar + unifies 2 screens = net code reduction, permanent bug-fix.

CONTEXT / REALITY CHECK:
- History screen (S4 calendar) currently has a view-sync bug: selected range saves correctly (FROM/UNTIL labels update) but the displayed month grid doesn't auto-navigate to show the selected dates' month, so highlights are invisible until manual navigation.
- Reports screen (S4 calendar) currently uses a separate static-demo implementation (hardcoded 13 white / 14,15,23,24 blue / Dec 2018) with no interaction logic.
- Both screens SHOULD use the same shared `DateRangeCalendar` component (it exists as RESERVED stub in src/shared/components/controls/DateRangeCalendar/).
- Reference images: D:\khizer_workspace\ConnexisTracker\design-references\ (History reference + Reports reference).

════════════════════════════════════════
CONFIG KNOBS (defaults; state any change as ASSUMPTION)
════════════════════════════════════════
RANGE_MODE         = "contiguous"  // mode="range" from startDate→endDate (standard UX). Reports' non-contiguous design is overridden.
AUTO_NAVIGATE      = true          // day-tap auto-navigates displayedMonth to clicked day's month (fixes History bug structurally).
HOUR_MIN_PICKERS   = "UNCHANGED"   // Hour/Min scrubber rows on both screens stay as-is (History: drive playback SEEK_STEP; Reports: decorative). Do NOT migrate them into the calendar component.
HISTORY_REST_STATE = "CURRENT_SELECTION" // History calendar opens to the currently selected range (not a baked baseline fraction). If this breaks freeze, flag + switch to "INIT_TO_BASELINE_FRACTION".
REPORTS_INITIAL    = "MOCK_VALUES" // Reports calendar initial state = mock (from=13, until=24, displayed=Dec 2018). Interaction enabled (not static demo).

════════════════════════════════════════
PART 1 — LIBRARY INSTALL + TYPE SETUP
════════════════════════════════════════
- Run: `npm install react-native-ui-datepicker dayjs`
- Verify package.json has both in dependencies (NOT devDependencies).
- Verify NO other new deps added (grep package.json diff).
- TypeScript: import types `DateType`, `CalendarDay`, `CalendarComponents` from 'react-native-ui-datepicker'.

════════════════════════════════════════
PART 2 — SHARED DateRangeCalendar COMPONENT (controlled mode)
════════════════════════════════════════
File: src/shared/components/controls/DateRangeCalendar/DateRangeCalendar.tsx + styles.ts + index.ts

INTERFACE:
```tsx
interface DateRangeCalendarProps {
  startDate: DateType;
  endDate: DateType;
  displayedMonth: number;  // 0-11
  displayedYear: number;
  onRangeChange: (start: DateType, end: DateType) => void;
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

IMPLEMENTATION:
Render <DateTimePicker mode="range" startDate={startDate} endDate={endDate} month={displayedMonth} year={displayedYear} onChange={handleChange} onMonthChange={onMonthChange} onYearChange={onYearChange} styles={customStyles} components={customComponents} />
handleChange({ startDate, endDate }):
Call onRangeChange(startDate, endDate)
If AUTO_NAVIGATE=true:
if (endDate) call onMonthChange(dayjs(endDate).month()) + onYearChange(dayjs(endDate).year())
else if (startDate && !endDate) call onMonthChange(dayjs(startDate).month()) + onYearChange(dayjs(startDate).year())
This makes the bug STRUCTURALLY IMPOSSIBLE: selection + view are one source of truth.
customStyles object (sample from reference, adjust by sampling):
container: backgroundColor '#1E242E', padding 12, borderRadius 4
selected: backgroundColor '#2F6FBF', borderRadius 4
selected_label: color '#FFFFFF', fontWeight 'bold'
today: borderColor 'transparent' (or '#FFFFFF' if visible)
day: color '#DDE1E4'
weekday: color '#E05A6A', fontSize 8
month_label: color '#FFFFFF', fontSize 12
navigation (chevrons): width 22, height 22, backgroundColor '#2F6FBF', borderRadius 11, justifyContent 'center', alignItems 'center'
customComponents object:
IconPrev: <View style={styles.navButton}><Text style={styles.navIcon}>◀</Text></View>
IconNext: <View style={styles.navButton}><Text style={styles.navIcon}>▶</Text></View>
Day: (day: CalendarDay) => { ...custom day cell rendering if needed, else default }
Export from index.ts: export { DateRangeCalendar } from './DateRangeCalendar';
════════════════════════════════════════
PART 3 — HISTORY SCREEN INTEGRATION (bug fix + freeze reconciliation)
════════════════════════════════════════
File: src/features/map/screens/HistoryScreen/HistoryScreen.tsx
STATE MANAGEMENT (controlled):
const [startDate, setStartDate] = useState<DateType>(null);
const [endDate, setEndDate] = useState<DateType>(null);
const [displayedMonth, setDisplayedMonth] = useState<number>(11); // Dec = 11
const [displayedYear, setDisplayedYear] = useState<number>(2018);
WIRING:
S3 "Select Date & Time" field: onTap toggles calendar visibility (existing useCollapsible logic).
S4 calendar: render <DateRangeCalendar startDate={startDate} endDate={endDate} displayedMonth={displayedMonth} displayedYear={displayedYear} onRangeChange={(s,e) => { setStartDate(s); setEndDate(e); }} onMonthChange={setDisplayedMonth} onYearChange={setDisplayedYear} />
On day-tap: AUTO_NAVIGATE in the shared component handles view-sync (no extra logic here).
On month chevron tap: onMonthChange updates displayedMonth (grid re-renders with new month).
Hour/Min pickers (S5/S6): UNCHANGED, drive playback SEEK_STEP (existing logic).
FREEZE RECONCILIATION:
If HISTORY_REST_STATE="CURRENT_SELECTION": calendar opens to whatever startDate/endDate/displayedMonth are currently set (could be null/Dec 2018 default). Verify rest-state screenshot vs /ui-baseline/History = ZERO diff on the calendar container (labels FROM/UNTIL, chevron positions, dark bg). If highlights differ (baseline shows baked split), switch to "INIT_TO_BASELINE_FRACTION" and set initial state to the exact dates that reproduce the baked split.
ACCEPTANCE: rest-state overlay = ZERO diff.
════════════════════════════════════════
PART 4 — REPORTS SCREEN MIGRATION (same component, initial = mock)
════════════════════════════════════════
File: src/features/reports/screens/ReportsScreen/ReportsScreen.tsx
STATE MANAGEMENT (controlled, initial = mock):
const [startDate, setStartDate] = useState<DateType>('2018-12-13');
const [endDate, setEndDate] = useState<DateType>('2018-12-24');
const [displayedMonth, setDisplayedMonth] = useState<number>(11); // Dec
const [displayedYear, setDisplayedYear] = useState<number>(2018);
WIRING:
S3 "Select Date & Time" field: onTap toggles calendar visibility (existing useCollapsible logic, DEFAULT EXPANDED).
S4 calendar: render <DateRangeCalendar ...same props... />
On day-tap: AUTO_NAVIGATE handles view-sync.
Hour/Min pickers (S5/S6): UNCHANGED, decorative (existing logic).
FREEZE RECONCILIATION:
Initial state = mock values (from=13, until=24, displayed=Dec).
ACCEPTANCE: rest-state screenshot vs /ui-baseline/Reports = ZERO diff on the calendar container (FROM/UNTIL labels, chevron positions, dark bg). Highlights will be contiguous range (13→24 all blue), overriding the reference's non-contiguous design. State this as an assumption: "Reports calendar uses contiguous range (standard UX); non-contiguous design in reference overridden."
If pixel-perfect non-contiguous is CRITICAL: flag + switch RANGE_MODE to "multiple" (loses auto-navigate feature; manual month navigation required).
════════════════════════════════════════
PART 5 — HOUR/MIN PICKERS (UNCHANGED explicit)
════════════════════════════════════════
History: Hour/Min scrubber rows (S5/S6) stay as-is. They drive playback engine's SEEK_STEP (existing logic from playback task). Do NOT integrate them into the calendar component.
Reports: Hour/Min scrubber rows (S5/S6) stay as-is. They are decorative (no playback on Reports). Do NOT integrate them.
Rationale: "Select Date & Time" field opens the calendar (range picker); Hour/Min are separate filters/controls. Keeping them separate = cleaner separation of concerns.
════════════════════════════════════════
STATIC GATES (run before device; report results)
════════════════════════════════════════
tsc --noEmit 0 · eslint --quiet 0 · jest pass · grep: react-native-ui-datepicker + dayjs in package.json dependencies (NOT devDependencies), no "AIza" in src/, no static style={{ in new shared component, no console.log added · AUTO_NAVIGATE logic present in shared component (grep onMonthChange called in onChange) · both screens import + use the SAME shared DateRangeCalendar (grep) · Hour/Min pickers unchanged (grep no migration into calendar).
════════════════════════════════════════
DEVICE VERIFY — LAYER 1: MOBILE-MCP (MANDATORY; do NOT mark complete on tsc alone)
════════════════════════════════════════
V1 mcp_mobile_list_devices -> Android; boot emulator if none; npx react-native run-android (full rebuild; new deps require native link).
V2 History screen: open History tab; screenshot at REST (before any interaction) -> overlay vs /ui-baseline/History = ZERO diff on calendar container (labels, chevrons, dark bg). If highlights differ, flag + switch to INIT_TO_BASELINE_FRACTION.
V3 History BUG FIX PROOF: tap a day in a DIFFERENT month (e.g. if grid shows Dec 2018, tap a day that would be in Feb 2019 by navigating forward first, then go back to Dec, then tap a Feb date via day-tap if possible, OR just tap a day far enough that it crosses month boundary). VERIFY: grid AUTO-NAVIGATES to show the clicked day's month + highlight visible INSTANTLY. Screenshot mid-interaction showing: (a) clicked day in different month, (b) grid jumped to that month, (c) highlight visible. This is the STRUCTURAL FIX proof.
V4 History interaction: tap FROM day -> highlight appears; tap UNTIL day -> range highlighted (contiguous); tap chevrons -> month changes; tap another day in new month -> highlights update + view stays on that month.
V5 Reports screen: open Reports tab; screenshot at REST -> overlay vs /ui-baseline/Reports = ZERO diff on calendar container. State assumption: "contiguous range (13→24 blue); non-contiguous reference design overridden".
V6 Reports interaction: tap a day -> FROM set; tap another day -> UNTIL set + range highlighted; tap chevrons -> month changes; tap a day in new month -> highlights update + view stays.
V7 Hour/Min pickers (both screens): verify UNCHANGED (no visual change, no integration into calendar).
V8 PROFILER (G2/G10): during interaction, re-renders confined to DateRangeCalendar + parent screen state updates; no unnecessary re-renders of sibling sections (summary/list/header).
V9 logcat: no "dayjs not found" / "react-native-ui-datepicker not installed" errors; no Reanimated double-instance warnings.
V10 If mobile-mcp cannot reach device: output exact V1–V9 checklist + STOP awaiting user "device pass"; do NOT declare done on static gates alone.
════════════════════════════════════════
DEVICE VERIFY — LAYER 2: E2E (OPTIONAL; run AFTER V1–V10 green)
════════════════════════════════════════
If e2e harness exists (tests/ folder):
E1 Author tests/history-calendar.e2e.ts + tests/reports-calendar.e2e.ts using import { test, expect } from 'e2e' and fixtures { app, agent, screen }.
E2 Encode behavioral contract:
"History calendar auto-navigates to clicked day's month": launch History -> agent.act('tap a day in a different month') -> agent.assert('the calendar grid jumps to show that month and the highlight is visible').
"Reports calendar range selection": launch Reports -> agent.act('tap two different days') -> agent.assert('a contiguous range is highlighted between the two days').
E3 Run npx e2e run tests/history-calendar.e2e.ts tests/reports-calendar.e2e.ts (model-driven first pass = record).
E4 Re-run with NO model (deterministic replay) -> must pass.
E5 Commit recorded tests.
If e2e harness does NOT exist: skip Layer 2, note in report "e2e not configured; mobile-mcp Layer 1 sufficient for this task".
════════════════════════════════════════
REPORT + RULES
════════════════════════════════════════
REPORT FORMAT: | file | lines | part-id | + static gate table + Layer-1 mobile-mcp checklist (V1–V10) + Layer-2 e2e checklist (E1–E5 if applicable) + explicit lines: "react-native-ui-datepicker + dayjs installed (runtime deps)", "AUTO_NAVIGATE structural fix verified (V3)", "History rest-state freeze verified (V2)", "Reports rest-state freeze verified (V5) + contiguous range assumption stated", "Hour/Min pickers UNCHANGED", "e2e tests authored (if Layer 2 ran)". NEVER print API key.
PROCESS: install deps -> shared component -> History integration -> Reports migration -> static gates -> Layer-1 verify -> (green) -> Layer-2 e2e (if applicable); walk acceptance item by item; if any fails, fix + re-run FULL checklist; for ambiguity make reasonable assumption + STATE it (never half-done). Summarize built + assumptions + out-of-scope.
DO NOT: add any other deps; migrate Hour/Min pickers into calendar; change frozen pixels outside calendar; use mode="multiple" unless RANGE_MODE explicitly switched; bypass AUTO_NAVIGATE logic; git ops; docs updates.
```