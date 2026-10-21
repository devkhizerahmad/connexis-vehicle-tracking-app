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
import React, { useCallback, useEffect, useRef } from 'react';
import { Text, View } from 'react-native';
import DateTimePicker, { type DateType } from 'react-native-ui-datepicker';
import dayjs from 'dayjs';
import { useCalendarTheme } from './theme';
import { styles } from './styles';

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
  // ONE shared theme for both calendar pickers (range + single). It is the
  // library's own dark defaults plus the demo-matching deltas — see theme.ts.
  const pickerStyles = useCalendarTheme();

  /**
   * Live mirror of everything `handleChange` needs.
   *
   * WHY A REF IS UNAVOIDABLE HERE: the library memoises its own `onSelectDate`
   * with `useCallback(..., [mode, timePicker, min, max, timeZone])` — its
   * dependency array does NOT include `onChange`. It therefore pins the FIRST
   * `handleChange` closure it was given and keeps calling that one forever, so
   * any later render's `startDate`/`endDate`/handlers are invisible to it.
   *
   * Measured consequence without this ref: a guard reading `startDate`/`endDate`
   * straight from props evaluated a range several taps out of date, fired on the
   * SECOND tap of a fresh range, and rewrote a correct `{Nov 10, Nov 30}` into a
   * bogus `{Nov 30, null}` — i.e. the "fix" became the bug.
   *
   * `live.current` is re-pointed after every commit, so the pinned closure always
   * sees the current range and the current handlers.
   */
  const live = useRef({
    start: startDate,
    end: endDate,
    displayedMonth,
    displayedYear,
    onRangeChange,
    onMonthChange,
    onYearChange,
  });
  useEffect(() => {
    live.current = {
      start: startDate,
      end: endDate,
      displayedMonth,
      displayedYear,
      onRangeChange,
      onMonthChange,
      onYearChange,
    };
  }, [startDate, endDate, displayedMonth, displayedYear, onRangeChange, onMonthChange, onYearChange]);

  /**
   * Point the grid at `month`/`year`, in the ONE order the library can honour.
   *
   * The library applies `month` and `year` through two independent effects, and
   * BOTH derive from `stateRef.current.currentDate` — which is only refreshed
   * after the reducer commits. So when a day tap moves the view across a year
   * boundary (Dec 2018 -> Jan 2019, both values change), the two effects run in
   * the same commit against the same stale base and the second one overwrites the
   * first: `year(2019)` applied to a still-December base yields December 2019, so
   * the grid lands a month away from the day you just selected and the highlight
   * is off-screen. That is the view-sync class of bug this component exists to
   * kill, reintroduced by the library's own navigation.
   *
   * Emitting MONTH first and letting YEAR land on the next tick fixes it:
   *   Dec 2018 --.month(0)--> Jan 2018   (base refreshed)
   *   Jan 2018 --.year(2019)--> Jan 2019  (correct)
   * The reverse order drifts to Jan 2020. A single-tick delay is the minimum
   * needed for the reducer to settle; it is invisible to the user because the
   * tap is already being reflected by the selection itself.
   */
  const syncViewTo = useCallback((month: number, year: number) => {
    const view = live.current;
    const monthChanged = month !== view.displayedMonth;
    const yearChanged = year !== view.displayedYear;
    if (!monthChanged && !yearChanged) {
      return;
    }
    if (monthChanged) {
      view.onMonthChange(month);
    }
    if (yearChanged) {
      if (monthChanged) {
        setTimeout(() => {
          live.current.onYearChange(year);
        }, 0);
      } else {
        view.onYearChange(year);
      }
    }
  }, []);

  /**
   * The single write path for the selection — and, by construction, the single
   * place the view follows it. If the user completes a range, the grid opens on
   * the END day; if they are mid-range, it opens on the START they just picked
   * (so a range that runs past the end of the month still lands somewhere the
   * selection is visible).
   *
   * ── THE 3-CLICK RESET ──────────────────────────────────────────────────────
   * Standard range UX (Google Calendar / Airbnb / Uber):
   *   nothing selected          -> click sets FROM
   *   FROM set, no UNTIL        -> click sets UNTIL (range complete)
   *   FROM + UNTIL both set     -> click CLEARS the range and sets a new FROM
   *
   * Left to itself the library does the THIRD case wrong. Its `onChange` reports
   * the *resulting range*, never the day that was pressed, and for a third click
   * it takes the "extend" branch: with FROM=Oct 2 / UNTIL=Oct 25, tapping Nov 10
   * emits `{ startDate: Oct 2, endDate: Nov 10 }` — the old FROM survives and the
   * band swallows Oct 2..Nov 10. Same for FROM=Jan 10 / UNTIL=Jan 15 + tap Jan 18,
   * which silently absorbs Jan 16 and Jan 17.
   *
   * So the fix has two layers:
   *
   * 1. `allowRangeReset` (passed to the picker below) makes the library short-
   *    circuit that branch and emit `{ startDate: <the day you tapped>,
   *    endDate: undefined }`. That is the actual repair — it is the library's
   *    own supported option for this exact state, and it is the ONLY layer that
   *    knows WHICH day was pressed. Verified: after tapping Nov 10 onto a
   *    complete Oct 2..Oct 25 range the library emits the tapped day as FROM with
   *    UNTIL cleared.
   *
   * 2. The `if (startDate && endDate)` guard below is the invariant behind it.
   *    If a complete range was on screen and we are handed another COMPLETE
   *    range, this click was a start-over, not an extension — so drop UNTIL and
   *    promote the pressed day to FROM. It is defence in depth: it keeps the
   *    behaviour if `allowRangeReset` is ever dropped, or the library changes
   *    what it emits on a third click. It reads the LIVE range via `live`, never
   *    the stale closure props.
   */
  const handleChange = useCallback(
    ({ startDate: newStart, endDate: newEnd }: { startDate: DateType; endDate: DateType }) => {
      const {
        start: liveStart,
        end: liveEnd,
        onRangeChange: emit,
      } = live.current;

      // CASE 1: a complete range was already on screen and we are handed another
      // complete range => this click RESETS rather than extends.
      if (liveStart && liveEnd && newStart && newEnd) {
        // The library reports the resulting range, not the pressed day; on the
        // extend branch the pressed day is the new END, so that is what becomes
        // the new FROM. (With `allowRangeReset` on, the library short-circuits
        // before ever reaching here and hands us an already-correct
        // `{ newStart, endDate: undefined }`, which falls through to CASE 2.)
        emit(newEnd, null);
        const parsed = dayjs(newEnd);
        if (parsed.isValid()) {
          syncViewTo(parsed.month(), parsed.year());
        }
        return;
      }

      // CASE 2: building a range (or nothing was selected yet) — take the
      // library's result verbatim. `allowRangeReset` makes this already carry
      // the correct "new FROM, UNTIL cleared" pair.
      emit(newStart, newEnd);

      const anchor = newEnd ?? newStart;
      if (!anchor) {
        return;
      }
      const parsed = dayjs(anchor);
      if (parsed.isValid()) {
        syncViewTo(parsed.month(), parsed.year());
      }
    },
    [syncViewTo],
  );

  // MONTH / YEAR SELECTORS — the LIBRARY'S OWN, no custom header.
  //
  // The library's default header renders `<MonthButton/>` + `<YearButton/>` as
  // two Pressables (testID "btn-month" / "btn-year") next to the nav buttons.
  // Pressing one flips the calendar view to the library's own MONTH / YEAR grid,
  // and picking a value calls `onMonthChange` / `onYearChange` — which this
  // component forwards to the screen, so the grid follows. The demo's
  // "‹ October 2026 ›" title IS that default (navigationPosition="around").
  //
  // The old custom `components` overrides are GONE: the single-letter weekday
  // header ("S M T W T F S") and the navy-disc chevrons were both the "unclean"
  // look the demo supersedes.

  const fromLabel = startDate ? dayjs(startDate).format('DD.MM.YY') : '—';
  const untilLabel = endDate ? dayjs(endDate).format('DD.MM.YY') : '—';

  return (
    <View style={styles.card} testID={testIDPrefix}>
      {/* FROM / UNTIL read-out — the selection summary, above the calendar. */}
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
        // THE 3-CLICK RESET REPAIR. Without this the library EXTENDS an existing
        // range on the third click (FROM=Oct 2 / UNTIL=Oct 25 + tap Nov 10 yields
        // Oct 2..Nov 10) because its `onChange` reports the resulting range and
        // has no idea which day was actually pressed. With it, the library
        // short-circuits that branch and reports the tapped day as the new FROM
        // with UNTIL cleared — the standard range-picker UX. See handleChange.
        allowRangeReset
        // Both reference artboards pad the grid with the neighbouring months'
        // days, dimmed (25-30 Nov above, 1-5 Jan below in December 2018). The
        // library defaults this to `false`, which would render blanks instead —
        // and blanks also remove the only way to reach another month without
        // paging first, which is exactly the interaction AUTO_NAVIGATE is for.
        showOutsideDays
        navigationPosition="around"
        styles={pickerStyles}
      />
    </View>
  );
}

export default DateRangeCalendar;