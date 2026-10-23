// dob.ts — the DOB domain rules for the international 3-segment picker.
//
// Pure helpers, no UI: month/year-aware day counts (leap-year correct),
// ISO <-> display conversion, and the clamp-to-today rule.
//
// The picker stores the DOB as ISO ("1990-01-01") and DISPLAYS it as
// "January 1, 1990". Nothing here touches the network or the mock.
import dayjs from 'dayjs';

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

/** The earliest selectable year. */
export const MIN_YEAR = 1900;

export interface DobParts {
  year: number;
  /** 1-12 */
  month: number;
  day: number;
}

/** Gregorian leap year. */
export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

/**
 * The number of days in a month, leap-year aware.
 * `month` is 1-12.
 */
export function daysInMonth(month: number, year: number): number {
  if (month === 2) {
    return isLeapYear(year) ? 29 : 28;
  }
  if (month === 4 || month === 6 || month === 9 || month === 11) {
    return 30;
  }
  return 31;
}

/** Today, as parts. */
export function todayParts(): DobParts {
  const now = dayjs();
  return { year: now.year(), month: now.month() + 1, day: now.date() };
}

/** ISO ("1990-01-01") -> parts, or null when the value is not a usable date. */
export function parseDob(iso: string | null | undefined): DobParts | null {
  if (!iso) {
    return null;
  }
  const parsed = dayjs(iso);
  if (!parsed.isValid()) {
    return null;
  }
  return { year: parsed.year(), month: parsed.month() + 1, day: parsed.date() };
}

/** Parts -> ISO ("1990-01-01"). */
export function toIso(parts: DobParts): string {
  const month = `${parts.month}`.padStart(2, '0');
  const day = `${parts.day}`.padStart(2, '0');
  return `${parts.year}-${month}-${day}`;
}

/** ISO -> the human display ("January 1, 1990"). */
export function formatDob(iso: string | null | undefined): string {
  const parts = parseDob(iso);
  if (!parts) {
    return '';
  }
  return `${MONTH_NAMES[parts.month - 1]} ${parts.day}, ${parts.year}`;
}

/**
 * The clamp rules the picker applies to every segment selection:
 *   1. the day never exceeds the chosen month's real length (leap-aware);
 *   2. the result never lands after TODAY (maxDate = today).
 *
 * M7: rule 2 is applied COMPONENT-WISE. The old version returned `today`
 * wholesale, so selecting a future YEAR rewrote the month and the day the user
 * had just chosen (and `ProfileDobSheet` auto-saves on close, which made that a
 * quiet data-corruption path). Now a future year becomes the current year, a
 * future month becomes the current month, and only then a future day becomes
 * today — each segment keeps as much of the user's intent as the rule allows.
 */
export function clampParts(candidate: DobParts): DobParts {
  const today = todayParts();
  // Step 1: a day that does not exist in the chosen month is pulled back to the
  // month's last day (leap-aware).
  let year = candidate.year;
  let month = candidate.month;
  let day = Math.min(candidate.day, daysInMonth(month, year));

  // Step 2: never in the future, one segment at a time.
  if (year > today.year) {
    year = today.year;
  }
  if (year === today.year && month > today.month) {
    month = today.month;
  }
  // Shortening the year (Feb 29 -> Feb 28) or the month can invalidate the day.
  day = Math.min(day, daysInMonth(month, year));
  if (year === today.year && month === today.month && day > today.day) {
    day = today.day;
  }

  return { year, month, day };
}
