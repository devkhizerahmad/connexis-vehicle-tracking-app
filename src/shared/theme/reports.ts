// reports.ts — Reports screen design tokens (S1–S10).
// Kept in its own module (like history.ts) so the frozen Home/Details/Profile/
// LiveMap/History token blocks stay byte-identical; the barrel re-export is
// additive. Values sampled from the 390x844 reference capture.

/** Reports-only palette. */
export const reportColors = {
  // S1 header
  headerInk: '#FFFFFF',

  // S2/S3 select fields
  fieldBg: '#FFFFFF',
  fieldInk: '#333333',
  fieldBorder: '#E0E0E0',
  /** Small dark triangle that ties S3 to the S4 calendar below it. */
  fieldPointer: '#1E242E',

  // S4 calendar
  calBg: '#1E242E',
  calBlue: '#2F6FBF',
  calMonthInk: '#FFFFFF',
  calMonthArrowBg: '#2F6FBF',
  weekdayPink: '#E05A6A',
  dayInk: '#DDE1E4',
  dayStartBg: '#FFFFFF',
  dayStartInk: '#1E242E',
  dayBlueBg: '#2F6FBF',
  dayBlueInk: '#FFFFFF',
  calLabel: '#7A8288',
  calValue: '#FFFFFF',
  calValueDim: '#7A8288',

  // S5/S6 hour + minute rows
  pickerLabel: '#7A8288',
  chipDef: '#E4E7EA',
  chipDefInk: '#555555',
  chipSel: '#C62828',
  chipSelInk: '#FFFFFF',
  pickerArrow: '#2F6FBF',

  // S7–S9 category cards
  cardBg: '#FFFFFF',
  cardBorder: '#E0E0E0',
  cardHeaderBg: '#1B2430',
  cardHeaderInk: '#FFFFFF',
  tileTitleInk: '#FFFFFF',
  tileDescInk: '#555555',
  plusGreen: '#43A047',

  // Toast (stub feedback for the not-yet-wired interactions)
  toastBg: '#1B2430',
  toastInk: '#FFFFFF',

  // Tile fills — cat-1 / cat-2 / cat-3 pairs, verbatim from the reference
  tileBlue: '#1E88E5',
  tileRust: '#D84315',
  tileTeal: '#009688',
  tileGold: '#F9A825',
  tileSlate: '#37474F',
  tileGray: '#9E9E9E',
} as const;

/** Reports-only metrics. */
export const reportSizes = {
  /** S2/S3 select field height. */
  fieldH: 44,
  /** S3 pointer triangle size (points up at the field). */
  pointerSize: 8,
  /** S4 top FROM/UNTIL read-out row. */
  calHeaderH: 40,
  /** S4 month caption row. */
  calMonthH: 32,
  /** S4 weekday header row. */
  calWeekdayH: 20,
  /** S4 day grid row pitch. */
  calDayRowH: 32,
  /** S4 month chevron button diameter. */
  calNavBtn: 22,

  /** S5/S6 picker row height. */
  pickerRowH: 28,
  /** S5/S6 chip height. */
  chipH: 22,
  /** S5/S6 chip gap. */
  chipGap: 6,

  /** S7–S9 category card header bar height. */
  cardHeaderH: 32,
  /** S7–S9 card body padding. */
  cardBodyPad: 8,
  /** S7–S9 gap between the two tiles in a row. */
  tileGap: 8,
  /** S7–S9 tile total height (coloured cap + white body). */
  tileH: 100,
  /** S7–S9 coloured cap height. */
  tileCapH: 58,
  /** S7–S9 white body height. */
  tileBodyH: 42,
  /** S7–S9 tile glyph sizes. */
  tileIcon: 16,
  tileShare: 14,
  tilePlus: 18,
  /** Horizontal page gutter shared by S2–S9. */
  gutter: 16,
} as const;
