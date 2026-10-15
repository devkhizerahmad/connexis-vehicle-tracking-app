// historyDates.ts — local-time date math + `dd.MM.yy` formatting (no heavy libs)
// Everything is computed in LOCAL time on purpose: the mock range is
// "13.12.18 -> 24.12.24" and UTC parsing would shift the day near midnight.
//
// SCOPE NOTE: this module used to also carry the hand-rolled S4 grid —
// `buildMonthGrid`, `shiftMonth`, `formatMonthCaption`, `isWithinRange` and the
// `MonthCursor` cursor type. Both screens now render their calendar through the
// shared `DateRangeCalendar` (react-native-ui-datepicker), so every one of those
// lost its last caller and has been removed rather than left as dead weight.
// What remains is only what the History screen still needs to read the service
// payload and label the S3 field.

/** Pad a number to 2 digits. */
const pad2 = (n: number): string => (n < 10 ? `0${n}` : String(n));

/** Local `YYYY-MM-DD` key for a Date. */
export const toIsoDate = (date: Date): string =>
  `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`;

/** Inverse of toIsoDate: parses `YYYY-MM-DD` into a LOCAL midnight Date. */
export const fromIsoDate = (iso: string): Date => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

/** Reference formatting for S3/S4 read-outs: `13.12.18`. */
export const formatShortDate = (iso: string): string => {
  const date = fromIsoDate(iso);
  return `${pad2(date.getDate())}.${pad2(date.getMonth() + 1)}.${pad2(date.getFullYear() % 100)}`;
};
