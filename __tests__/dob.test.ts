// dob.test.ts — B15/M7: the DOB domain rules.
//
// The picker auto-saves on close, so a wrong clamp is persisted silently. These
// tests pin the leap-year month lengths and the "never in the future" rule,
// including the M7 regression: clamping must not rewrite segments the user did
// not make future-dated.
import {
  clampParts,
  daysInMonth,
  formatDob,
  isLeapYear,
  parseDob,
  toIso,
} from '../src/features/profile/components/ProfileDobPicker/dob';

// `todayParts()` reads the wall clock, so the clock is frozen for these tests.
const TODAY = new Date('2026-10-22T10:00:00');

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(TODAY);
});

afterEach(() => {
  jest.useRealTimers();
});

describe('dob month lengths (B15)', () => {
  it('knows the leap years', () => {
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(2024)).toBe(true);
    expect(isLeapYear(1900)).toBe(false);
    expect(isLeapYear(2023)).toBe(false);
  });

  it('returns the real length of every month', () => {
    expect(daysInMonth(2, 2000)).toBe(29);
    expect(daysInMonth(2, 1900)).toBe(28);
    expect(daysInMonth(2, 2024)).toBe(29);
    expect(daysInMonth(1, 2024)).toBe(31);
    for (const month of [4, 6, 9, 11]) {
      expect(daysInMonth(month, 2024)).toBe(30);
    }
    for (const month of [3, 5, 7, 8, 10, 12]) {
      expect(daysInMonth(month, 2024)).toBe(31);
    }
  });
});

describe('dob clamp (B15 + M7)', () => {
  it('pulls a day back to the end of a shorter month', () => {
    // Jan 31 -> February.
    expect(clampParts({ year: 1990, month: 2, day: 31 })).toEqual({
      year: 1990,
      month: 2,
      day: 28,
    });
    // ...but 1992 is a leap year.
    expect(clampParts({ year: 1992, month: 2, day: 31 })).toEqual({
      year: 1992,
      month: 2,
      day: 29,
    });
  });

  it('keeps a valid Feb 29 and rejects an invalid one', () => {
    expect(clampParts({ year: 2024, month: 2, day: 29 })).toEqual({
      year: 2024,
      month: 2,
      day: 29,
    });
    expect(clampParts({ year: 2023, month: 2, day: 29 })).toEqual({
      year: 2023,
      month: 2,
      day: 28,
    });
  });

  it('leaves a past date untouched', () => {
    expect(clampParts({ year: 1990, month: 1, day: 1 })).toEqual({
      year: 1990,
      month: 1,
      day: 1,
    });
  });

  it('clamps a future year to the current year, keeping month and day (M7)', () => {
    // The regression: this used to return 2026-10-22, i.e. it rewrote the month
    // and the day the user had chosen.
    expect(clampParts({ year: 2030, month: 5, day: 15 })).toEqual({
      year: 2026,
      month: 5,
      day: 15,
    });
  });

  it('clamps a future month in the current year, keeping the day', () => {
    expect(clampParts({ year: 2026, month: 12, day: 5 })).toEqual({
      year: 2026,
      month: 10,
      day: 5,
    });
  });

  it('clamps a future day in the current month', () => {
    expect(clampParts({ year: 2026, month: 10, day: 31 })).toEqual({
      year: 2026,
      month: 10,
      day: 22,
    });
  });

  it('handles a future Feb 29 by shortening the month once the year clamps', () => {
    // 2030-02-29 does not exist, and 2026-02 has 28 days.
    expect(clampParts({ year: 2030, month: 2, day: 29 })).toEqual({
      year: 2026,
      month: 2,
      day: 28,
    });
  });

  it('never returns a date after today', () => {
    const candidates = [
      { year: 2030, month: 12, day: 31 },
      { year: 2026, month: 11, day: 30 },
      { year: 2026, month: 10, day: 31 },
    ];
    for (const candidate of candidates) {
      const parts = clampParts(candidate);
      expect(toIso(parts) <= '2026-10-22').toBe(true);
    }
  });
});

describe('dob formatting', () => {
  it('round-trips ISO through parts', () => {
    expect(parseDob('1990-01-01')).toEqual({ year: 1990, month: 1, day: 1 });
    expect(toIso({ year: 1990, month: 1, day: 1 })).toBe('1990-01-01');
    expect(formatDob('1990-01-01')).toBe('January 1, 1990');
  });

  it('treats an empty or unusable value as "no date"', () => {
    expect(parseDob(null)).toBeNull();
    expect(parseDob('')).toBeNull();
    expect(parseDob('not-a-date')).toBeNull();
    expect(formatDob(undefined)).toBe('');
  });
});
