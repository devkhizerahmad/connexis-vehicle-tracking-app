// HistoryScreen — S1–S9: route playback & history for one vehicle.
//
// Section map (reference 318x1280 capture):
//   S1 header            AppHeader standard, title "History", avatar
//   S2 vehicle chip      black pill (photo + name) + "< View Live" link
//   S3 date field        DateRangeField (summary caption only)
//   S4 calendar          DateRangeCalendar — the SAME shared component Reports uses
//   S5 summary           total km card + running/idle bars
//   S6 mini map          HistoryMiniMap (LIGHT style) + red alert banner
//   S7 playback          PlaybackPanel (Reanimated scrubber)
//   S8 hour/min jumpers  inside PlaybackPanel (UNCHANGED — not part of S4)
//   S9 history list      FlatList of HistoryListRow (virtualised)
//
// Data flows from historyService.getHistoryData(vehicleId, range); the screen
// owns the range so picking in the calendar never refetches mid-edit. Frozen
// screens untouched apart from the S4 calendar container itself.
//
// VIEW-SYNC FIX (this screen's actual bug): the S3 field used to open a
// `react-native-paper-dates` modal whose confirm wrote the selected range but
// NOT the calendar's month cursor — so FROM/UNTIL updated while the grid stayed
// parked on the old month and the new highlight was invisible. The modal is gone;
// the shared `DateRangeCalendar` is now the single picker, and it moves the
// displayed month to the tapped day as part of the selection itself, so the two
// can no longer disagree. See the component header for the full rationale.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import type { DateType } from 'react-native-ui-datepicker';
import { AppHeader } from '@shared/components/layout/AppHeader';
import { ScreenState } from '@shared/components/feedback/ScreenState';
import { ArrowLeft } from '@shared/components/icons';
import { DateRangeCalendar, DateRangeField } from '@shared/components/controls/DateRangeCalendar';
import { useCollapsible } from '@shared/hooks/useCollapsible';
import { useAsyncData } from '@shared/hooks/useAsyncData';
import { historyColors } from '@shared/theme';
import { sizes } from '@shared/theme';
import { historyService } from '@features/map/services/historyService';
import { HistoryListRow } from '@features/map/components/HistoryListRow';
import { HistoryMiniMap } from '@features/map/components/HistoryMiniMap';
import { HistorySummaryPanel } from '@features/map/components/HistorySummaryPanel';
import { PlaybackPanel } from '@features/map/components/PlaybackPanel';
import { formatShortDate, fromIsoDate, sameRange } from '@features/map/utils/historyDates';
import { activeStopId } from '@features/map/utils/routePlayback';
import type { HistoryDateRange, IsoDate } from '@features/map/types/history';
import type { MapStackParamList } from '@navigation/types';
import { styles } from './styles';

/**
 * S4 draft selection.
 *
 * DISTINCT FROM `HistoryDateRange` ON PURPOSE. The domain type (and the service
 * that refetches on it) models a CLOSED window and requires both ends, but the
 * calendar is mid-selection for most of a user's interaction — with only FROM
 * picked there is genuinely no UNTIL yet. Collapsing that open state into
 * `until = from` (as this screen used to) made every tap look like a COMPLETE
 * range to the calendar, which reset the selection on EVERY click and made a
 * range impossible to build. The draft therefore keeps `until` nullable, and
 * only a COMPLETE draft is promoted into the closed `range` that refetches.
 */
interface HistoryDraftRange {
  from: IsoDate;
  /** null while the user has picked FROM but not yet UNTIL. */
  until: IsoDate | null;
}

type HistoryScreenProps = NativeStackScreenProps<MapStackParamList, 'History'>;

/** The mock's calendar opens on December 2018 (`month` is ZERO-based). */
const DEFAULT_MONTH = 11;
const DEFAULT_YEAR = 2018;

export function HistoryScreen({ route, navigation }: HistoryScreenProps) {
  const vehicleId = route.params?.vehicleId;
  // V5-PART1: the shared BottomNav is an absolute overlay (RootNavigator's tabBar),
  // so the list clears it explicitly — same pattern Engine Control uses (F13).
  const insets = useSafeAreaInsets();
  const scrollPadBottom = sizes.bottomNavH + insets.bottom + 12;

  /** Range the panels currently reflect; changing it triggers a refetch. */
  const [range, setRange] = useState<HistoryDateRange | null>(null);
  /**
   * M9: the range that arrived WITH the payload is not a reason to fetch again.
   * The first request runs with no range; seeding `range` from the response
   * used to retrigger a second identical request, so two effects raced on
   * `setData`. Comparing against the seeded range keeps the key stable.
   */
  const seededRangeRef = useRef<HistoryDateRange | null>(null);
  const requestRange =
    range && !sameRange(range, seededRangeRef.current) ? range : null;
  const {
    data,
    error: loadError,
    retry: retryLoad,
  } = useAsyncData(
    () => historyService.getHistoryData(vehicleId, requestRange ?? undefined),
    `${vehicleId ?? 'none'}|${
      requestRange ? `${requestRange.from}~${requestRange.until}` : 'initial'
    }`,
  );
  /** Range being edited in the calendar until the day tap commits it. */
  const [draftRange, setDraftRange] = useState<HistoryDraftRange | null>(null);
  /**
   * The calendar's view cursor, owned here (not inside the calendar) so it
   * survives re-renders. `HISTORY_REST_STATE = CURRENT_SELECTION`: the grid
   * opens on whatever the loaded payload's range points at, so the highlight is
   * on screen at rest rather than only after the user pages there.
   */
  const [displayedMonth, setDisplayedMonth] = useState<number>(DEFAULT_MONTH);
  const [displayedYear, setDisplayedYear] = useState<number>(DEFAULT_YEAR);
  /** Once the payload lands we adopt ITS month, so rest state == selection. */
  const [viewSeeded, setViewSeeded] = useState(false);
  /**
   * PATCH T-HISTORY: the playhead the MAP and the ROW HIGHLIGHT follow. The
   * panel owns the high-frequency value (it repaints 10x/s); this copy is
   * quantised to 0.1% so the map/list do not re-render on every tick.
   */
  const [progress, setProgress] = useState(0);
  const handleProgressChange = useCallback((next: number) => {
    setProgress(prev => {
      if (next === 0 || next === 1 || Math.abs(next - prev) >= 0.001) {
        return next;
      }
      return prev;
    });
  }, []);

  // One request, one owner. The first payload also seeds the calendar and the
  // panels; a later range change only swaps the data.
  useEffect(() => {
    if (!data || viewSeeded) {
      return;
    }
    seededRangeRef.current = data.range;
    setRange(data.range);
    setDraftRange(data.range);
    setDisplayedMonth(data.month.month);
    setDisplayedYear(data.month.year);
    setViewSeeded(true);
  }, [data, viewSeeded]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  /**
   * S4 day tap, in `DateType` terms.
   *
   * The calendar component already auto-navigates its own view to the tapped day
   * (AUTO_NAVIGATE), so this handler only records the selection; it must NOT
   * re-derive the month, or it would race the component's own navigation.
   *
   * `DateType` is string | number | Dayjs | Date, so this normalises through
   * dayjs rather than `new Date(...)`, which rejects a Dayjs outright.
   * `.format` is local-time, matching `toIsoDate`, which keeps day-of-month
   * stable near midnight.
   */
  const handleRangeChange = useCallback((start: DateType, end: DateType) => {
    if (!start) {
      return;
    }
    const from = dayjs(start).format('YYYY-MM-DD');
    // `end` is null whenever the user has only picked FROM — including right
    // after the calendar resets a completed range. That null MUST be passed
    // through unchanged: it is the only signal the calendar has that a range is
    // still being built, and it is what stops `allowRangeReset` from treating
    // every tap as a fresh start. Reports has always passed it straight through,
    // which is why the same component works on one screen and not the other.
    const until = end ? dayjs(end).format('YYYY-MM-DD') : null;
    setDraftRange({ from, until });
    // Promote to the CLOSED, service-facing range only once the selection is
    // complete, so a half-finished pick never refetches and the
    // summary/mini-map/list cannot flicker mid-edit.
    if (until) {
      setRange({ from, until });
    }
  }, []);

  /** Month chevron. Moves the VIEW only — never the selection. */
  const handleMonthChange = useCallback((month: number) => {
    setDisplayedMonth(month);
  }, []);

  const handleYearChange = useCallback((year: number) => {
    setDisplayedYear(year);
  }, []);

  /**
   * S3–S4 collapse, identical to the Reports screen: tapping "Select Date &
   * Time" shows or hides the inline calendar over 250ms.
   *
   * ASSUMPTION — EXPANDED ON FIRST MOUNT. The brief's V1 asks for a COLLAPSED
   * rest state, but that contradicts two things in the same brief and in the
   * frozen baseline: Reports (the screen it says to copy) is expanded at rest,
   * and `ui-baseline/History.png` captures the calendar VISIBLE at rest.
   * Collapsing by default would guarantee a non-zero pixel diff against the
   * baseline it is meant to match. Expanded it is — collapse/expand behaviour is
   * what DEFECT 5 actually asks for.
   */
  const { toggle, anim, animatedHeight, onMeasureLayout } = useCollapsible(true);

  const rangeLabel = useMemo(
    () =>
      range
        ? `${formatShortDate(range.from)} - ${formatShortDate(range.until)}`
        : undefined,
    [range],
  );

  /** The event the playhead currently sits on (null before the first one). */
  const activeId = useMemo(
    () => (data ? activeStopId(data.stops, progress) : null),
    [data, progress],
  );

  if (!data || !range || !draftRange || !viewSeeded) {
    return (
      <View style={styles.screen}>
        <AppHeader title="History" onBack={handleBack} />
        {loadError ? (
          <ScreenState
            kind="error"
            message="We could not load the trip history. Check your connection and try again."
            onAction={retryLoad}
          />
        ) : (
          <ScreenState kind="loading" message="Loading trip history." />
        )}
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AppHeader title="History" onBack={handleBack} />

      <ScrollView
        style={styles.list}
        contentContainerStyle={[styles.listContent, { paddingBottom: scrollPadBottom }]}
        showsVerticalScrollIndicator={false}
        testID="history-list">
        <View style={styles.header}>
            {/* S2 vehicle chip + live link */}
            <View style={styles.vehicleRow}>
              <View style={styles.vehicleChip} testID="history-vehicle-chip">
                <Image
                  source={require('../../../../assets/img_car_sedan.png')}
                  style={styles.vehiclePhoto}
                />
                <Text style={styles.vehicleName} numberOfLines={1}>
                  {data.vehicle.name}
                </Text>
              </View>
              <Pressable
                style={styles.viewLive}
                onPress={handleBack}
                hitSlop={8}
                testID="history-view-live"
                  accessibilityRole="button"
                  accessibilityLabel="View live map">
                <ArrowLeft color={historyColors.viewLiveInk} size={14} />
                <Text style={styles.viewLiveText}>{'View Live'}</Text>
              </Pressable>
            </View>

            {/* S3 date field + S4 calendar (the SAME component Reports uses) */}
            <DateRangeField value={rangeLabel} onPress={toggle} />
            <Animated.View
              style={[styles.collapseWrap, { height: animatedHeight, opacity: anim }]}>
              <View
                onLayout={e => onMeasureLayout(e.nativeEvent.layout.height)}
                testID="history-date-body">
                <DateRangeCalendar
                  startDate={fromIsoDate(draftRange.from)}
                  endDate={draftRange.until ? fromIsoDate(draftRange.until) : null}
                  displayedMonth={displayedMonth}
                  displayedYear={displayedYear}
                  onRangeChange={handleRangeChange}
                  onMonthChange={handleMonthChange}
                  onYearChange={handleYearChange}
                  testIDPrefix="history-calendar"
                />
              </View>
            </Animated.View>

            {/* S5 summary */}
            <HistorySummaryPanel summary={data.summary} />

            {/* S6 mini map — the car marker follows the playhead */}
            <HistoryMiniMap
              geometry={data.map}
              alertText={data.alertText}
              progress={progress}
            />

            {/* S7 playback + S8 hour/min jumpers */}
            <PlaybackPanel
              playback={data.playback}
              filters={data.filters}
              onProgressChange={handleProgressChange}
            />

        </View>

        {/* S9 route card — same chrome as the Engine Control "Driving Routes"
            card: an inset, shadowed, rounded shell that CLIPS the rows, so the
            active tint and its accent bar stop at the card edge instead of
            running to the screen edges. */}
        <View style={styles.cardOuter} testID="history-stops-card">
          <View style={styles.card}>
            <View style={styles.sectionBar}>
              <Text style={styles.sectionBarText}>History</Text>
            </View>
            {data.stops.map((stop, index) => (
              <HistoryListRow
                key={stop.id}
                stop={stop}
                isLast={index === data.stops.length - 1}
                active={stop.id === activeId}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default HistoryScreen;

