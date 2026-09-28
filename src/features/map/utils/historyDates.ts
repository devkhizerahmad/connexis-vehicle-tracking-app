// historyDates.ts — local-time date math + `dd.MM.yy` formatting (no heavy libs)
// Everything is computed in LOCAL time on purpose: the mock range is
// "13.12.18 -> 24.12.24" and UTC parsing would shift the day near midnight.

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

/** Reference formatting for S4: `13.12.18`. */
export const formatShortDate = (iso: string): string => {
  const date = fromIsoDate(iso);
  return `${pad2(date.getDate())}.${pad2(date.getMonth() + 1)}.${pad2(date.getFullYear() % 100)}`;
};

/** Calendar caption for S4: `December 2018`. */
export const formatMonthCaption = (year: number, month: number): string =>
  fromIsoDate(`${year}-${pad2(month + 1)}-01`).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });

/** True when `iso` sits inside the inclusive [from, until] range. */
export const isWithinRange = (iso: string, from: string, until: string): boolean =>
  iso >= from && iso <= until;

/** A year + zero-based month cursor. */
export interface MonthCursor {
  year: number;
  month: number;
}

/** Add `count` months to a month cursor, normalising the year. */
export const shiftMonth = (year: number, month: number, count: number): MonthCursor => {
  const zeroBased = month + count;
  return {
    year: year + Math.floor(zeroBased / 12),
    month: ((zeroBased % 12) + 12) % 12,
  };
};

/**
 * Builds the S4 grid: 6 rows x 7 columns of day cells covering `month`,
 * padded with the neighbouring months' days (rendered dimmed).
 * The grid always starts on the Sunday that begins the displayed week.
 */
export const buildMonthGrid = (year: number, month: number) => {
  const first = new Date(year, month, 1);
  const gridStart = new Date(year, month, 1 - first.getDay());
  const cells: {
    date: string;
    day: number;
    outside: boolean;
  }[] = [];
  for (let i = 0; i < 42; i += 1) {
    const cell = new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i);
    cells.push({
      date: toIsoDate(cell),
      day: cell.getDate(),
      outside: cell.getMonth() !== month,
    });
  }
  return cells;
};
