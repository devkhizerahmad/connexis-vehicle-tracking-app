// DateRangeCalendar barrel — the S3 field trigger + the ONE shared S4 range
// calendar used by the History and Reports screens.
//
// NOTE: there is deliberately NO single-mode export. The Profile Date of Birth
// uses the international 3-segment (Month / Day / Year) picker instead of a
// calendar grid - a grid is the norm for EVENT dates, not for a birth date.
export { DateRangeCalendar } from './DateRangeCalendar';
export type { DateRangeCalendarProps } from './DateRangeCalendar';
export { DateRangeField } from './DateRangeField';
export type { DateRangeFieldProps } from './DateRangeField';