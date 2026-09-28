// HistoryScreen — S1–S9: route playback & history for one vehicle.
//
// Section map (reference 318x1280 capture):
//   S1 header            AppHeader standard, title "History", avatar
//   S2 vehicle chip      black pill (photo + name) + "< View Live" link
//   S3 date field        DateRangeField -> opens the paper-dates range modal
//   S4 calendar          DateRangeCalendar (dark, inline)
//   S5 summary           total km card + running/idle bars
//   S6 mini map          HistoryMiniMap (LIGHT style) + red alert banner
//   S7 playback          PlaybackPanel (Reanimated scrubber)
//   S8 hour/min jumpers  inside PlaybackPanel
//   S9 history list      FlatList of HistoryListRow (virtualised)
//
// Data flows from historyService.getHistoryData(vehicleId, range); the screen
// owns a DRAFT range so picking in the calendar never refetches mid-edit — the
// paper-dates modal's confirm is the only commit path. Frozen screens untouched.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FlatList, Image, Pressable, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MD3DarkTheme, Provider as PaperProvider } from 'react-native-paper';
// The paper-dates modal resolves its own copy ("Save", "Close", "Select period")
// from a REGISTRY that ships EMPTY. Without this it console.warns on every
// render and falls back to the raw key ("save", "close").
import { DatePickerModal, en, registerTranslation } from 'react-native-paper-dates';
import { AppHeader } from '@shared/components/layout/AppHeader';
import { ArrowLeft } from '@shared/components/icons';
import { DateRangeCalendar, DateRangeField } from '@shared/components/controls/DateRangeCalendar';
import { historyColors } from '@shared/theme';
import { historyService } from '@features/map/services/historyService';
import { HistoryListRow } from '@features/map/components/HistoryListRow';
import { HistoryMiniMap } from '@features/map/components/HistoryMiniMap';
import { HistorySummaryPanel } from '@features/map/components/HistorySummaryPanel';
import { PlaybackPanel } from '@features/map/components/PlaybackPanel';
import { formatShortDate, fromIsoDate, toIsoDate } from '@features/map/utils/historyDates';
import type { HistoryData, HistoryDateRange, HistoryMonth } from '@features/map/types/history';
import type { MapStackParamList } from '@navigation/types';
import { styles } from './styles';

type HistoryScreenProps = NativeStackScreenProps<MapStackParamList, 'History'>;

// paper-dates needs its locale copy registered once per process, before first use.
registerTranslation('en', en);

/**
 * Paper theme matching the dark S4 surface so the modal matches the calendar.
 *
 * MUST be spread over `MD3DarkTheme` rather than written as a bare literal:
 * `PaperProvider` merges with a SHALLOW spread, so a partial `colors` object
 * REPLACES the whole default palette and drops `colors.elevation` — which
 * paper-dates' `CalendarHeader` / `AnimatedCrossView` dereference
 * (`theme.colors.elevation.level3`) and crash on as soon as the modal becomes
 * visible. Deriving from MD3DarkTheme keeps every token the modal reads and
 * only overrides the handful that carry the History look.
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
    // The modal body sits on the same navy-black as the inline S4 calendar.
    // `CalendarHeader` / `AnimatedCrossView` read these levels unconditionally,
    // so every one must stay a defined string.
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

  const [data, setData] = useState<HistoryData | null>(null);
  /** Range the panels currently reflect; changing it triggers a refetch. */
  const [range, setRange] = useState<HistoryDateRange | null>(null);
  /** Range being edited in the calendar until the modal is confirmed. */
  const [draftRange, setDraftRange] = useState<HistoryDateRange | null>(null);
  const [month, setMonth] = useState<HistoryMonth | null>(null);
  const [pickerOpen, setPickerOpen] = useState(false);

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
      setMonth(payload.month);
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
   * S4 day tap. First tap (or a tap outside the current range) starts a new
   * window at that day; a tap strictly inside the window closes it there.
   * An inline tap commits immediately — otherwise the grid would look
   * interactive but never refetch. The current window is read from a ref so
   * this never calls setState from inside another setState updater.
   */
  const draftRef = useRef<HistoryDateRange | null>(draftRange);
  useEffect(() => {
    draftRef.current = draftRange;
  }, [draftRange]);

  const handleSelectDay = useCallback((date: string) => {
    const prev = draftRef.current;
    if (!prev) {
      return;
    }
    const next =
      date <= prev.from || date >= prev.until
        ? { from: date, until: date }
        : { from: prev.from, until: date };
    draftRef.current = next;
    setDraftRange(next);
    setRange(next);
  }, []);

  const rangeLabel = useMemo(
    () =>
      range
        ? `${formatShortDate(range.from)} - ${formatShortDate(range.until)}`
        : undefined,
    [range],
  );

  if (!data || !range || !draftRange || !month) {
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
          data={data.stops}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <HistoryListRow stop={item} isLast={index === data.stops.length - 1} />
          )}
          style={styles.list}
          contentContainerStyle={styles.listContent}
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

              {/* S3 date field + S4 calendar */}
              <DateRangeField value={rangeLabel} onPress={() => setPickerOpen(true)} />
              <DateRangeCalendar
                range={draftRange}
                month={month}
                onMonthChange={setMonth}
                onSelectDay={handleSelectDay}
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

        <DatePickerModal
          visible={pickerOpen}
          mode="range"
          locale="en"
          startDate={fromIsoDate(draftRange.from)}
          endDate={fromIsoDate(draftRange.until)}
          onDismiss={() => setPickerOpen(false)}
          onConfirm={({ startDate, endDate }) => {
            if (startDate && endDate) {
              const next = { from: toIsoDate(startDate), until: toIsoDate(endDate) };
              draftRef.current = next;
              setDraftRange(next);
              setRange(next);
            }
            setPickerOpen(false);
          }}
        />
      </View>
    </PaperProvider>
  );
}

export default HistoryScreen;

