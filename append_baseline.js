// append_baseline.js — appends entries to ui-baseline/baseline_record.json.
// Read -> push -> write (never clobber), then re-read and verify the count.
const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'ui-baseline', 'baseline_record.json');
const before = JSON.parse(fs.readFileSync(file, 'utf8'));
const beforeCount = before.entries.length;

const entries = [
  {
    label: 'Calendar clean-restyle + month/year selectors (shared range calendar) 2026-10-21',
    capturedAt: '2026-10-21',
    scope:
      'The ONE shared range calendar (History + Reports) only: the react-native-ui-datepicker surface was restyled to the clean reference-demo look and the native month/year selectors were enabled. Bodies, cards, maps, route rows and headers were NOT touched.',
    implementation:
      'src/shared/components/controls/DateRangeCalendar/theme.ts (NEW) - useCalendarTheme() returns the library defaults (useDefaultStyles) PLUS the demo-matching deltas; the library does not merge styles over defaults, so defaults + overrides are passed together. styles.ts - old unclean overrides stripped (single-letter weekday row, container-height hacks, custom day-cell colours, navy-disc chevrons) and the card overflow:hidden clip removed; app chrome only (card, FROM/UNTIL readout chips). DateRangeCalendar.tsx - dropped the custom components/containerHeight/weekdaysHeight overrides so the library default MonthButton/YearButton render the header, which opens the library own month/year grids.',
    behaviourPreserved:
      'The 3-click reset guard, allowRangeReset, the useRef live-range mechanics and the view-sync (syncViewTo) were left byte-for-byte intact. Device-verified on Reports: click 1 (day 10 with a complete range on screen) -> FROM 10.12.18 / UNTIL em-dash; click 2 -> range builds; click 3 (day 20) -> FROM 20.12.18 / UNTIL em-dash. Month selector moves the grid to the picked month, year selector moves it to the picked year.',
    note:
      'A Profile single-mode calendar was added alongside this item but has since been REPLACED by the international 3-segment DOB picker (the DOB entry that follows) - a calendar grid is the norm for EVENT dates, not for a birth date. The single-mode calendar and its standalone Profile section were removed.',
    staticGates:
      'tsc 0, eslint 0, jest 28/28, deps 18, no raw hex / no static style={{ in the calendar code, the shared range calendar 3-click guard + allowRangeReset + useRef mechanics still present, mock mtimes unchanged',
  },
  {
    label: 'Profile DOB 3-segment international picker 2026-10-21',
    capturedAt: '2026-10-21',
    scope:
      'Profile Date of Birth interaction ONLY. The standalone "Date Picker" section (added in the previous item) and its single-mode calendar were DELETED; the Date of Birth row in the form card became a button that opens a 3-segment bottom sheet. Every other Profile field, the avatar and the header are FROZEN; the History/Reports range calendar is FROZEN.',
    target:
      'Facebook / Google / LinkedIn / X standard: three segment rows (Month / Day / Year) with AUTO-SAVE on every selection and NO OK/Done button. No calendar grid anywhere in the DOB sheet (a grid is the international norm for EVENT dates, which is what the shared History/Reports range calendar is).',
    implementation:
      'src/features/profile/components/ProfileDobPicker/ - dob.ts (pure domain rules: leap-aware daysInMonth, ISO parse/format, clampParts), ProfileDobField.tsx (the tappable form row: label + value + right caret, a11y "Change date of birth"), ProfileDobSheet.tsx (the RN Modal bottom sheet: 3 segment rows + one scrollable option FlatList per segment, selected item highlighted and auto-scrolled into view), styles.ts, index.ts. ProfileScreen.tsx renders ProfileDobField in place of ProfileFormField for the dob key and hosts the sheet.',
    deviceEvidence:
      'Profile row = Button label="Change date of birth" id="profile-dob-field" 640x163px (>= 44dp target) showing "January 1, 1990"; the other rows are still EditTexts (Adeel / Hussein / testdata@gamail.com / 0321-7334553766). Sheet opens pre-set to Month: January / Day: 1 / Year: 1990 with NO calendar grid (btn-month / btn-year / day cells = 0). Year -> 1992 auto-saved with no confirm (segment updated live); Month -> March, day list 1..31; Feb 1992 (leap) lists 29, Feb 2023 lists 28 - leap rule proven both ways; Day 15 -> field reads "February 15, 2023"; hardware back closed the sheet with the change already saved; re-opening shows Month: February / Day: 15 / Year: 2023.',
    invariants:
      'Row geometry unchanged - the label + value are ONE press target instead of a grown row, so the label/value y-offsets keep the same 165px pitch as the other form rows (First 381 / Last 546 / DOB 711 / Email 876 / Phone 1041) and the rows below the DOB row do not shift. Display = "Month D, YYYY"; internal store stays ISO. maxDate = today (clamp), minYear = 1900, year options 1900..current year. New token: profileTokens.color.sheetBackdrop (the sheet scrim).',
    staticGates:
      'tsc 0, eslint 0, jest 28/28 (3 suites), deps 18 (NO new dep - dayjs was already present), AIza 0 (case-sensitive), no raw hex / no static style={{ / no console.log in the Profile code, swipe guards present (processingRef ControlSwipeCard:93, forceResetRef :102, clearTimeout EngineControlScreen:94/:110), TODO(V9-a11y) + TODO(KNOWN-ISSUE) present, shared range calendar 3-click guard + allowRangeReset/useRef intact, all mock mtimes unchanged',
    artifacts: 'ui-baseline/Profile.png re-captured (Profile screen with the new DOB row)',
  },
];

before.entries.push(...entries);
fs.writeFileSync(file, JSON.stringify(before, null, 2) + '\n');

const after = JSON.parse(fs.readFileSync(file, 'utf8'));
console.log(`entries before=${beforeCount} after=${after.entries.length} (+${after.entries.length - beforeCount})`);
after.entries.slice(-2).forEach((e, i) => console.log(`  ${beforeCount + 1 + i}. ${e.label}`));
