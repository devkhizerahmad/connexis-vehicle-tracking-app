// DateRangeCalendar.tsx — S4: the ONE dark month calendar shared by the History
// and Reports screens.
//
// Replaces the two hand-rolled grids (History's `buildMonthGrid` band and the
// Reports-only verbatim-highlight demo) with `react-native-ui-datepicker` in
// `mode="range"`. One component, one look, one behaviour — so a screen cannot
// drift away from the other again.
//
// WHY AUTO_NAVIGATE IS THE STRUCTURAL FIX (the bug this whole component exists
// to kill):
// The old hand-rolled grid kept the SELECTED RANGE and the DISPLAYED MONTH as two
// independent pieces of screen state. History's cross-month path went through
// `react-native-paper-dates`, whose confirm wrote the range but never touched the
// month cursor — so FROM/UNTIL updated, the grid stayed on the old month, and the
// new highlight was invisible until the user paged there by hand. That state
// split is what allowed the desync, and you cannot fix it by remembering to call
// `setMonth` in enough places.
//
// Here the fix is structural: a day tap is the ONLY way the selection changes,
// and `handleChange` moves the displayed month/year to the tapped day in the same
// handler. There is no code path that can write a selection without also moving
// the view to it, so "saved but invisible" is unrepresentable rather than merely
// un-tested. The screens cannot reintroduce the bug without rewriting this file.
//
// The remaining freedom — prev/next chevrons — moves the view WITHOUT changing the
// selection, which is a different axis and cannot desync.
import React, { useCallback, useMemo } from 'react';
import { Text, View } from 'react-native';
import DateTimePicker, {
  useDefaultStyles,
  type CalendarComponents,
  type DateType,
} from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { calendarMetrics, calendarOverrides, styles } from './styles';

export interface DateRangeCalendarProps {
  /** Range start. `null`/omitted = nothing selected yet. */
  startDate: DateType;
  /** Range end. `null`/omitted while a half-finished range is open. */
  endDate: DateType;
  /** Displayed month, 0-11. The screen owns it so it survives re-renders. */
  displayedMonth: number;
  /** Displayed year. */
  displayedYear: number;
  /** Fired on every day tap with the new range. */
  onRangeChange: (start: DateType, end: DateType) => void;
  /** Fired when the displayed month changes (chevrons, or AUTO_NAVIGATE). */
  onMonthChange: (month: number) => void;
  /** Fired when the displayed year changes (chevrons, or AUTO_NAVIGATE). */
  onYearChange: (year: number) => void;
  /**
   * Prefix for this instance's testIDs. Both screens mount the same component,
   * so the prefix keeps their ids (`reports-day-13` vs `date-range-calendar-13`)
   * addressable independently.
   */
  testIDPrefix?: string;
}

export function DateRangeCalendar({
  startDate,
  endDate,
  displayedMonth,
  displayedYear,
  onRangeChange,
  onMonthChange,
  onYearChange,
  testIDPrefix = 'date-range-calendar',
}: DateRangeCalendarProps) {
  // 'dark' is passed explicitly so the resolved theme does not depend on the
  // device's system appearance — the calendar must look identical on every unit.
  const libraryDefaults = useDefaultStyles('dark');
  const pickerStyles = useMemo(
    () => ({ ...libraryDefaults, ...calendarOverrides }),
    [libraryDefaults],
  );

  /**
   * The single write path for the selection — and, by construction, the single
   * place the view follows it. If the user completes a range, the grid opens on
   * the END day; if they are mid-range, it opens on the START they just picked
   * (so a range that runs past the end of the month still lands somewhere the
   * selection is visible).
   */
  const handleChange = useCallback(
    ({ startDate: nextStart, endDate: nextEnd }: { startDate: DateType; endDate: DateType }) => {
      onRangeChange(nextStart, nextEnd);

      const anchor = nextEnd ?? nextStart;
      if (!anchor) {
        return;
      }
      const parsed = dayjs(anchor);
      if (!parsed.isValid()) {
        return;
      }
      onMonthChange(parsed.month());
      onYearChange(parsed.year());
    },
    [onRangeChange, onMonthChange, onYearChange],
  );

  // Circular navy chevrons with a glyph, replacing the library's PNG arrows so
  // the discs match the reference's 22pt buttons exactly.
  const components: CalendarComponents = useMemo(
    () => ({
      IconPrev: (
        <View style={styles.navButton}>
          <Text style={styles.navIcon}>◀</Text>
        </View>
      ),
      IconNext: (
        <View style={styles.navButton}>
          <Text style={styles.navIcon}>▶</Text>
        </View>
      ),
    }),
    [],
  );

  const fromLabel = startDate ? dayjs(startDate).format('DD.MM.YY') : '';
  const untilLabel = endDate ? dayjs(endDate).format('DD.MM.YY') : '';

  return (
    <View style={styles.card} testID={testIDPrefix}>
      {/* FROM / UNTIL read-out — the reference's selection summary. */}
      <View style={styles.readout}>
        <View style={styles.readoutCol}>
          <Text style={styles.readoutLabel}>FROM</Text>
          <Text style={styles.readoutValue} testID={`${testIDPrefix}-from`}>
            {fromLabel}
          </Text>
        </View>
        <View style={styles.readoutCol}>
          <Text style={styles.readoutLabel}>UNTIL</Text>
          <Text
            style={[styles.readoutValue, styles.readoutValueUntil]}
            testID={`${testIDPrefix}-until`}>
            {untilLabel}
          </Text>
        </View>
      </View>

      <DateTimePicker
        mode="range"
        startDate={startDate}
        endDate={endDate}
        month={displayedMonth}
        year={displayedYear}
        onChange={handleChange}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
        initialView="day"
        // Both reference artboards pad the grid with the neighbouring months'
        // days, dimmed (25-30 Nov above, 1-5 Jan below in December 2018). The
        // library defaults this to `false`, which would render blanks instead —
        // and blanks also remove the only way to reach another month without
        // paging first, which is exactly the interaction AUTO_NAVIGATE is for.
        showOutsideDays
        containerHeight={calendarMetrics.containerHeight}
        weekdaysHeight={calendarMetrics.weekdaysHeight}
        navigationPosition="around"
        styles={pickerStyles}
        components={components}
      />
    </View>
  );
}

export default DateRangeCalendar;