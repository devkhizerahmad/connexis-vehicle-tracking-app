// ReportsCalendar.tsx — S4: the dark December-2018 month grid.
//
// WHY THIS IS NOT `shared/components/controls/DateRangeCalendar`:
// that component is consumed by the UI-FROZEN History screen and paints a
// CONTIGUOUS range band derived from range.from..range.until. The Reports
// reference highlights a deliberately NON-CONTIGUOUS set of days (13 white,
// then 14/15 and 23/24 blue), so a contiguous derivation would be wrong.
// The date maths are still shared — buildMonthGrid / shiftMonth /
// formatMonthCaption come from features/map/utils/historyDates, unchanged.
//
// Day highlighting is read VERBATIM from the mock (`startDay`, `blueDays`)
// and is only applied while the displayed month is the mock's own month;
// stepping to another month shows a plain grid rather than inventing a range.
import React, { memo, useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Chevron } from '@shared/components/icons';
import { reportColors, reportSizes } from '@shared/theme';
import {
  buildMonthGrid,
  formatMonthCaption,
  shiftMonth,
  type MonthCursor,
} from '@features/map/utils/historyDates';
import type { CalendarState } from '@features/reports/types/reports';

/** Sunday-first header — the reference's S M T W T F S row. */
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export interface ReportsCalendarProps {
  state: CalendarState;
  /** Displayed month cursor — the screen owns it so it survives re-renders. */
  cursor: MonthCursor;
  onMonthChange: (cursor: MonthCursor) => void;
  onSelectDay: (day: number) => void;
}

/** One grid cell. Memoized so a month step re-renders 42 cheap leaves (G2/G5). */
const DayCell = memo(function DayCell({
  day,
  outside,
  isStart,
  isBlue,
  onPressDay,
}: {
  day: number;
  outside: boolean;
  isStart: boolean;
  isBlue: boolean;
  onPressDay: (day: number) => void;
}) {
  const handlePress = useCallback(() => onPressDay(day), [onPressDay, day]);

  const cellStyle = [
    styles.dayCell,
    isStart ? styles.dayStart : null,
    isBlue ? styles.dayBlue : null,
  ];
  const textStyle = [
    styles.dayText,
    outside ? styles.dayTextOutside : null,
    isStart ? styles.dayTextStart : null,
    isBlue ? styles.dayTextBlue : null,
  ];

  return (
    <Pressable
      style={styles.dayWrap}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`Day ${day}`}
      testID={`reports-day-${day}`}>
      <View style={cellStyle}>
        <Text style={textStyle}>{day}</Text>
      </View>
    </Pressable>
  );
});

export function ReportsCalendar({
  state,
  cursor,
  onMonthChange,
  onSelectDay,
}: ReportsCalendarProps) {
  const cells = useMemo(() => buildMonthGrid(cursor.year, cursor.month), [cursor]);

  /** Highlights only exist on the mock's own month; elsewhere the grid is plain. */
  const onMockMonth =
    cursor.year === state.yearMonth.y && cursor.month === state.yearMonth.m;

  const startDay = onMockMonth ? state.startDay : -1;
  const blueDays = onMockMonth ? state.blueDays : [];

  const goPrev = useCallback(
    () => onMonthChange(shiftMonth(cursor.year, cursor.month, -1)),
    [cursor, onMonthChange],
  );
  const goNext = useCallback(
    () => onMonthChange(shiftMonth(cursor.year, cursor.month, 1)),
    [cursor, onMonthChange],
  );

  return (
    <View style={styles.card} testID="reports-calendar">
      {/* FROM / UNTIL read-out */}
      <View style={styles.readout}>
        <View style={styles.readoutCol}>
          <Text style={styles.readoutLabel}>FROM</Text>
          <Text style={styles.readoutValue} testID="reports-calendar-from">
            {state.fromLabel}
          </Text>
        </View>
        <View style={styles.readoutCol}>
          <Text style={styles.readoutLabel}>UNTIL</Text>
          <Text
            style={[styles.readoutValue, styles.readoutValueUntil]}
            testID="reports-calendar-until">
            {state.untilLabel}
          </Text>
        </View>
      </View>


      {/* month caption + prev/next */}
      <View style={styles.monthRow}>
        <Pressable
          style={styles.navBtn}
          onPress={goPrev}
          hitSlop={8}
          accessibilityLabel="Previous month"
          testID="reports-calendar-prev">
          <Chevron dir="left" color={reportColors.calMonthInk} size={10} />
        </Pressable>
        <Text style={styles.monthCaption} testID="reports-calendar-month">
          {formatMonthCaption(cursor.year, cursor.month)}
        </Text>
        <Pressable
          style={styles.navBtn}
          onPress={goNext}
          hitSlop={8}
          accessibilityLabel="Next month"
          testID="reports-calendar-next">
          <Chevron dir="right" color={reportColors.calMonthInk} size={10} />
        </Pressable>
      </View>

      {/* weekday header */}
      <View style={styles.weekRow}>
        {WEEKDAYS.map((day, index) => (
          <View key={`${day}-${index}`} style={styles.weekCell}>
            <Text style={styles.weekText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* 6 x 7 day grid */}
      <View style={styles.grid}>
        {cells.map(cell => (
          <DayCell
            key={cell.date}
            day={cell.day}
            outside={cell.outside}
            isStart={cell.day === startDay}
            isBlue={blueDays.indexOf(cell.day) !== -1}
            onPressDay={onSelectDay}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: reportSizes.gutter,
    marginTop: 8,
    padding: 12,
    borderRadius: 4,
    backgroundColor: reportColors.calBg,
  },
  readout: {
    height: reportSizes.calHeaderH,
    flexDirection: 'row',
  },
  readoutCol: {
    flex: 1,
    justifyContent: 'center',
  },
  readoutLabel: {
    fontSize: 8,
    color: reportColors.calLabel,
  },
  readoutValue: {
    marginTop: 2,
    fontSize: 16,
    fontWeight: '700',
    color: reportColors.calValue,
    textDecorationLine: 'underline',
  },
  readoutValueUntil: {
    color: reportColors.calValueDim,
    textAlign: 'right',
  },
  monthRow: {
    height: reportSizes.calMonthH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navBtn: {
    width: reportSizes.calNavBtn,
    height: reportSizes.calNavBtn,
    borderRadius: reportSizes.calNavBtn / 2,
    backgroundColor: reportColors.calMonthArrowBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthCaption: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    color: reportColors.calMonthInk,
  },
  weekRow: {
    height: reportSizes.calWeekdayH,
    flexDirection: 'row',
  },
  weekCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekText: {
    fontSize: 8,
    color: reportColors.weekdayPink,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayWrap: {
    width: `${100 / 7}%`,
    height: reportSizes.calDayRowH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayCell: {
    width: '86%',
    height: '86%',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayStart: {
    backgroundColor: reportColors.dayStartBg,
  },
  dayBlue: {
    backgroundColor: reportColors.dayBlueBg,
  },
  dayText: {
    fontSize: 11,
    color: reportColors.dayInk,
  },
  dayTextOutside: {
    color: reportColors.calValueDim,
  },
  dayTextStart: {
    color: reportColors.dayStartInk,
    fontWeight: '700',
  },
  dayTextBlue: {
    color: reportColors.dayBlueInk,
  },
});

export default ReportsCalendar;
