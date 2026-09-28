// DateRangeCalendar.tsx — S4: dark month calendar with a FROM/UNTIL range.
// Hand-built grid (6 rows x 7 columns) rather than a Paper calendar: the
// reference paints a dark surface, a red weekday header, a blue range band and
// a WHITE start-day circle, none of which react-native-paper-dates themes.
// The dark Paper modal is used for picking (see DateRangePicker).
import React, { useCallback, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Chevron } from '@shared/components/icons';
import { historyColors, historySizes } from '@shared/theme';
import type { HistoryDateRange, HistoryMonth } from '@features/map/types/history';
import {
  buildMonthGrid,
  formatMonthCaption,
  formatShortDate,
  fromIsoDate,
  shiftMonth,
} from '@features/map/utils/historyDates';

/** Sunday-first header, matching the reference's red S M T W T F S row. */
const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export interface DateRangeCalendarProps {
  /** Currently previewed range (the screen owns the draft + confirm). */
  range: HistoryDateRange;
  /** Displayed month cursor (the screen owns it so it survives re-renders). */
  month: HistoryMonth;
  onMonthChange: (month: HistoryMonth) => void;
  /** Called with the tapped day; the screen applies range semantics. */
  onSelectDay: (date: string) => void;
}

export function DateRangeCalendar({
  range,
  month,
  onMonthChange,
  onSelectDay,
}: DateRangeCalendarProps) {
  const cells = useMemo(() => buildMonthGrid(month.year, month.month), [month]);

  const goPrev = useCallback(
    () => onMonthChange(shiftMonth(month.year, month.month, -1)),
    [month, onMonthChange],
  );
  const goNext = useCallback(
    () => onMonthChange(shiftMonth(month.year, month.month, 1)),
    [month, onMonthChange],
  );

  /** Jump the cursor to the month that owns `iso` (used on confirm). */
  const focusDate = useCallback(
    (iso: string) => {
      const [y, m] = iso.split('-').map(Number);
      onMonthChange({ year: y, month: (m ?? 1) - 1 });
    },
    [onMonthChange],
  );

  return (
    <View style={styles.card} testID="date-range-calendar">
      {/* PATCH T-HISTORY: tooltip arrow pointing up at the S3 trigger field */}
      <View style={styles.tooltipArrow} pointerEvents="none" />
      {/* FROM / UNTIL read-out */}
      <View style={styles.readout}>
        <View style={styles.readoutCol}>
          <Text style={styles.readoutLabel}>FROM</Text>
          <Text
            style={styles.readoutValue}
            onPress={() => focusDate(range.from)}
            accessibilityRole="button"
            testID="calendar-from">
            {formatShortDate(range.from)}
          </Text>
        </View>
        <View style={styles.readoutCol}>
          <Text style={styles.readoutLabel}>UNTIL</Text>
          <Text
            style={[styles.readoutValue, styles.readoutValueUntil]}
            onPress={() => focusDate(range.until)}
            accessibilityRole="button"
            testID="calendar-until">
            {formatShortDate(range.until)}
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
          testID="calendar-prev">
          <Chevron dir="left" color={historyColors.monthCaption} size={10} />
        </Pressable>
        <Text style={styles.monthCaption} testID="calendar-caption">
          {formatMonthCaption(month.year, month.month)}
        </Text>
        <Pressable
          style={styles.navBtn}
          onPress={goNext}
          hitSlop={8}
          accessibilityLabel="Next month"
          testID="calendar-next">
          <Chevron dir="right" color={historyColors.monthCaption} size={10} />
        </Pressable>
      </View>

      {/* weekday header */}
      <View style={styles.weekRow}>
        {WEEKDAYS.map((label, i) => (
          <View key={`${label}-${i}`} style={styles.weekCell}>
            <Text style={styles.weekText}>{label}</Text>
          </View>
        ))}
      </View>

      {/* day grid */}
      <View style={styles.grid} testID="calendar-grid">
        {cells.map(cell => {
          const isStart = cell.date === range.from;
          const isUntil = cell.date === range.until;
          const inRange = cell.date >= range.from && cell.date <= range.until;
          // PATCH T-HISTORY: the range paints ONE contiguous band. The start day
          // paints a white rounded square instead of the band (the reference shows
          // the square inset inside its own column, with the blue band taking over
          // from the next column on).
          const showBand = inRange && !isStart;
          // Rounded only where the band opens/closes — square edges inside a week.
          const roundLeft = showBand && (isStartOfWeek(cell.date) || isStart);
          const roundRight = showBand && (isEndOfWeek(cell.date) || isUntil);
          return (
            <Pressable
              key={cell.date}
              style={[styles.dayCellWrap, cell.outside ? styles.dayOutside : null]}
              onPress={() => onSelectDay(cell.date)}
              accessibilityRole="button"
              accessibilityLabel={cell.date}
              testID={`calendar-day-${cell.date}`}>
              {showBand ? (
                <View
                  style={[
                    styles.band,
                    roundLeft ? styles.bandRoundLeft : null,
                    roundRight ? styles.bandRoundRight : null,
                  ]}
                />
              ) : null}
              <View style={[styles.dayInner, isStart ? styles.dayStart : null]}>
                <Text
                  style={[
                    styles.dayText,
                    cell.outside ? styles.dayTextOutside : null,
                    isStart ? styles.dayTextStart : null,
                  ]}>
                  {cell.day}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** True when `iso` is the first column (Sunday) of its week row. */
function isStartOfWeek(iso: string): boolean {
  return fromIsoDate(iso).getDay() === 0;
}

/** True when `iso` is the last column (Saturday) of its week row. */
function isEndOfWeek(iso: string): boolean {
  return fromIsoDate(iso).getDay() === 6;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: historyColors.panel,
    paddingHorizontal: 10,
    paddingTop: 8,
    paddingBottom: 10,
  },
  // PATCH T-HISTORY: small triangle in the gap above the panel, pointing at the field
  tooltipArrow: {
    position: 'absolute',
    top: -6,
    left: 20,
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderBottomWidth: 7,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: historyColors.panel,
  },
  readout: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  readoutCol: {
    flex: 1,
    alignItems: 'center',
  },
  readoutLabel: {
    fontSize: 8,
    color: historyColors.fromLabel,
    letterSpacing: 0.5,
  },
  readoutValue: {
    marginTop: 2,
    fontSize: 15,
    fontWeight: '700',
    color: historyColors.fromValue,
    textDecorationLine: 'underline',
  },
  readoutValueUntil: {
    color: historyColors.untilValue,
  },
  monthRow: {
    height: historySizes.monthRowH,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  navBtn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: historyColors.monthNavBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthCaption: {
    flex: 1,
    textAlign: 'center',
    fontSize: 13,
    color: historyColors.monthCaption,
  },
  weekRow: {
    flexDirection: 'row',
    height: historySizes.weekdayRowH,
    paddingHorizontal: historySizes.calGridPadH,
  },
  weekCell: {
    width: `${100 / 7}%`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekText: {
    fontSize: 12,
    color: historyColors.weekdayInk,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: historySizes.calGridPadH,
  },
  dayCellWrap: {
    width: `${100 / 7}%`,
    height: historySizes.dayRowH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayOutside: {
    opacity: 0.55,
  },
  // PATCH T-HISTORY: one contiguous band per range row (was a per-day circle)
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: (historySizes.dayRowH - historySizes.dayCell) / 2,
    height: historySizes.dayCell,
    backgroundColor: historyColors.rangeFill,
  },
  bandRoundLeft: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  bandRoundRight: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  // PATCH T-HISTORY: rounded square (was a circle) — the reference start/day shape
  dayInner: {
    width: historySizes.dayCell,
    height: historySizes.dayCell,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayStart: {
    backgroundColor: historyColors.startFill,
  },
  dayText: {
    fontSize: 12,
    color: historyColors.dayInk,
  },
  dayTextOutside: {
    color: historyColors.dayOutsideInk,
  },
  dayTextStart: {
    color: historyColors.startInk,
    fontWeight: '700',
  },
});

export default DateRangeCalendar;
