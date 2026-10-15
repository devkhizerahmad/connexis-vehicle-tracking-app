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
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MD3DarkTheme, Provider as PaperProvider } from 'react-native-paper';
import dayjs from 'dayjs';
import type { DateType } from 'react-native-ui-datepicker';
import { AppHeader } from '@shared/components/layout/AppHeader';
import { ArrowLeft } from '@shared/components/icons';
import { DateRangeCalendar, DateRangeField } from '@shared/components/controls/DateRangeCalendar';
import { historyColors } from '@shared/theme';
import { sizes } from '@shared/theme';
import { historyService } from '@features/map/services/historyService';
import { HistoryListRow } from '@features/map/components/HistoryListRow';
import { HistoryMiniMap } from '@features/map/components/HistoryMiniMap';
import { HistorySummaryPanel } from '@features/map/components/HistorySummaryPanel';
import { PlaybackPanel } from '@features/map/components/PlaybackPanel';
import { formatShortDate, fromIsoDate } from '@features/map/utils/historyDates';
import type { HistoryData, HistoryDateRange } from '@features/map/types/history';
import type { MapStackParamList } from '@navigation/types';
import { styles } from './styles';

type HistoryScreenProps = NativeStackScreenProps<MapStackParamList, 'History'>;

/** The mock's calendar opens on December 2018 (`month` is ZERO-based). */
const DEFAULT_MONTH = 11;
const DEFAULT_YEAR = 2018;

/**
 * Paper theme, retained for History's other Paper-based surfaces.
 *
 * MUST be spread over `MD3DarkTheme` rather than written as a bare literal:
 * `PaperProvider` merges with a SHALLOW spread, so a partial `colors` object
 * REPLACES the whole default palette and drops `colors.elevation` — which
 * Paper's `AnimatedCrossView` dereference (`theme.colors.elevation.level3`).
 * Deriving from MD3DarkTheme keeps every token and only overrides the handful
 * that carry the History look.
 */
const paperTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: historyColors.rangeEdge,
    background: historyColors.panel,
    surface: historyColors.panel,
    onSurface: historyColors.panelTitle,
    onBackground: historyColors.panelTitle,
    outline: historyColors.panelBorder,
    backdrop: 'rgba(0,0,0,0.6)',
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level0: historyColors.panel,
      level1: historyColors.panel,
      level2: historyColors.panel,
      level3: historyColors.panelSoft,
      level4: historyColors.panelSoft,
      level5: historyColors.panelSoft,
    },
  },
};

export function HistoryScreen({ route, navigation }: HistoryScreenProps) {
  const vehicleId = route.params?.vehicleId;
  // V5-PART1: the shared BottomNav is an absolute overlay (RootNavigator's tabBar),
  // so the list clears it explicitly — same pattern Engine Control uses (F13).
  const insets = useSafeAreaInsets();
  const scrollPadBottom = sizes.bottomNavH + insets.bottom + 12;

  const [data, setData] = useState<HistoryData | null>(null);
  /** Range the panels currently reflect; changing it triggers a refetch. */
  const [range, setRange] = useState<HistoryDateRange | null>(null);
  /** Range being edited in the calendar until the day tap commits it. */
  const [draftRange, setDraftRange] = useState<HistoryDateRange | null>(null);
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

  // Initial load — no range yet, so the service returns its mock default.
  useEffect(() => {
    let cancelled = false;
    historyService.getHistoryData(vehicleId).then(payload => {
      if (cancelled) {
        return;
      }
      setData(payload);
      setRange(payload.range);
      setDraftRange(payload.range);
      setDisplayedMonth(payload.month.month);
      setDisplayedYear(payload.month.year);
      setViewSeeded(true);
    });
    return () => {
      cancelled = true;
    };
  }, [vehicleId]);

  /** Confirmed range changed -> refetch for the new window. */
  useEffect(() => {
    if (!range) {
      return undefined;
    }
    let cancelled = false;
    historyService.getHistoryData(vehicleId, range).then(payload => {
      if (!cancelled) {
        setData(payload);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [range, vehicleId]);

  const handleBack = useCallback(() => navigation.goBack(), [navigation]);

  /**
   * S4 day tap, in `DateType` terms.
   *
   * The calendar component already auto-navigates its own view to the tapped day
   * (AUTO_NAVIGATE), so this handler only records the selection; it must NOT
   * re-derive the month, or it would race the component's own navigation.
   * Commits immediately — otherwise the grid would look interactive but never
   * refetch. The current window is read from a ref so this never calls setState
   * from inside another setState updater.
   */
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
  const draftRef = useRef<HistoryDateRange | null>(draftRange);
  useEffect(() => {
    draftRef.current = draftRange;
  }, [draftRange]);

  const handleRangeChange = useCallback((start: DateType, end: DateType) => {
    if (!start) {
      return;
    }
    const from = dayjs(start).format('YYYY-MM-DD');
    const until = end ? dayjs(end).format('YYYY-MM-DD') : from;
    const next = { from, until };
    draftRef.current = next;
    // Always advance the DRAFT so the S4 read-out tracks the tap...
    setDraftRange(next);
    // ...but only advance the CONFIRMED range once it is complete, so a
    // half-finished selection never refetches and the summary/mini-map/list
    // cannot flicker while the user is still picking the second day.
    if (end) {
      setRange(next);
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
   * S3 field tap. The calendar is permanently inline on History, so there is no
   * second range UI left to open — this just brings the calendar back into view
   * if the user has scrolled past it, which is what the field's old modal tap
   * effectively did.
   */
  const listRef = useRef<FlatList<HistoryData['stops'][number]>>(null);
  const handleFocusCalendar = useCallback(() => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const rangeLabel = useMemo(
    () =>
      range
        ? `${formatShortDate(range.from)} - ${formatShortDate(range.until)}`
        : undefined,
    [range],
  );

  if (!data || !range || !draftRange || !viewSeeded) {
    return (
      <View style={styles.screen}>
        <AppHeader title="History" onBack={handleBack} />
      </View>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <View style={styles.screen}>
        <AppHeader title="History" onBack={handleBack} />

        <FlatList
          ref={listRef}
          data={data.stops}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <HistoryListRow stop={item} isLast={index === data.stops.length - 1} />
          )}
          style={styles.list}
          contentContainerStyle={[styles.listContent, { paddingBottom: scrollPadBottom }]}
          showsVerticalScrollIndicator={false}
          testID="history-list"
          ListHeaderComponent={
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
                  testID="history-view-live">
                  <ArrowLeft color={historyColors.viewLiveInk} size={14} />
                  <Text style={styles.viewLiveText}>{'View Live'}</Text>
                </Pressable>
              </View>

              {/* S3 date field + S4 calendar (the SAME component Reports uses) */}
              <DateRangeField value={rangeLabel} onPress={handleFocusCalendar} />
              <DateRangeCalendar
                startDate={fromIsoDate(draftRange.from)}
                endDate={fromIsoDate(draftRange.until)}
                displayedMonth={displayedMonth}
                displayedYear={displayedYear}
                onRangeChange={handleRangeChange}
                onMonthChange={handleMonthChange}
                onYearChange={handleYearChange}
                testIDPrefix="history-calendar"
              />

              {/* S5 summary */}
              <HistorySummaryPanel summary={data.summary} />

              {/* S6 mini map */}
              <HistoryMiniMap geometry={data.map} alertText={data.alertText} />

              {/* S7 playback + S8 hour/min jumpers */}
              <PlaybackPanel playback={data.playback} filters={data.filters} />

              {/* S9 section header */}
              <View style={styles.sectionBar}>
                <Text style={styles.sectionBarText}>History</Text>
              </View>
            </View>
          }
        />
      </View>
    </PaperProvider>
  );
}

export default HistoryScreen;

