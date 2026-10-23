// ReportsScreen — S1–S10: the Reports root of the REPORT stack.
//
// PLACEMENT (user-confirmed, overrides the reference artboard):
//   The reference capture highlights the MAP tab, which is a design
//   inconsistency. Reports is registered as the ROOT screen of ReportStack so
//   tapping the bottom "Report" tab opens it with the REPORT tab highlighted.
//   The inner layout below stays pixel-perfect vs the reference.
//
// Section map:
//   S1 header            AppHeader, title "Reports", visible (no-op) back, avatar
//   S2 select vehicle    SelectField + inline 4-option list
//   S3 select date&time  SelectField + 8pt pointer; toggles S4–S6 (expanded)
//   S4 calendar          DateRangeCalendar — the SAME shared component History uses
//   S5/S6 pickers        HourMinPicker (variant="reports") — UNCHANGED, decorative
//   S7–S9 categories     ReportCategorySection -> ReportTile x2 each
//   S10 bottom nav       rendered by RootNavigator's BottomNav (REPORT active)
//
// ASSUMPTION — CONTIGUOUS RANGE OVERRIDES THE REFERENCE:
// The reference artboard highlights a deliberately NON-CONTIGUOUS set of days
// (13 white, then 14/15 and 23/24 blue) with 16–22 left blank. That cannot be
// produced by a range picker, because a range from 13 to 24 contains every day
// in between. The shared calendar is a standard `mode="range"` picker, so
// Reports now highlights 13 (white start) then 14→24 (blue) with no gaps.
// The non-contiguous design in the reference is OVERRIDDEN, as specified.
// The alternative — `mode="multiple"` — would reproduce the gaps but has no
// meaningful auto-navigate behaviour and no FROM/UNTIL semantics.
//
// Everything else is mock-backed today via reportsService. The only navigation is
// the avatar -> ProfileTab; the back chevron is intentionally inert because
// this screen is the stack root.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  type ScrollViewInstance,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { DateType } from 'react-native-ui-datepicker';
import { AppHeader } from '@shared/components/layout/AppHeader';
import { ScreenState } from '@shared/components/feedback/ScreenState';
import {
  SelectField,
  type SelectFieldOption,
} from '@shared/components/controls/SelectField';
import { DateRangeCalendar } from '@shared/components/controls/DateRangeCalendar';
import { HourMinPicker } from '@shared/components/controls/HourMinPicker';
import { useCollapsible } from '@shared/hooks/useCollapsible';
import { useToast } from '@shared/hooks/useToast';
import { useAsyncData } from '@shared/hooks/useAsyncData';
import { Toast } from '@shared/components/feedback/Toast';
import { spacing, sizes } from '@shared/theme';
import { reportsService } from '@features/reports/services/reportsService';
import { ReportCategorySection } from '@features/reports/components/ReportCategorySection';
import type { ReportStackParamList } from '@navigation/types';
import { styles } from './styles';

type ReportsScreenProps = NativeStackScreenProps<ReportStackParamList, 'Reports'>;

/**
 * `REPORTS_INITIAL = MOCK_VALUES`: the calendar opens on the mock's own window
 * (from 13.12.18, until 24.12.18, December 2018) so the rest state reproduces
 * the reference artboard. These are the SAME numbers the mock JSON carries —
 * they are read from the payload below rather than duplicated as a second
 * source of truth, so the two can never disagree.
 */
const MOCK_START_DATE = '2018-12-13';
const MOCK_END_DATE = '2018-12-24';
const MOCK_MONTH = 11; // zero-based => December
const MOCK_YEAR = 2018;

export function ReportsScreen({ navigation, route }: ReportsScreenProps) {
  // The shared BottomNav is an absolute overlay (RootNavigator's tabBar), so the
  // scroll content clears it explicitly — same pattern Engine Control uses.
  const insets = useSafeAreaInsets();
  const scrollPadBottom = sizes.bottomNavH + insets.bottom + 12;
  // ReportsScreen is reachable directly with a vehicleId (Home's card "Reports"
  // button). Seeding it here pre-selects that vehicle; an unknown/absent id leaves
  // the "Select Vehicle" placeholder untouched (selectedLabel resolves via find()).
  const incomingVehicleId = route?.params?.vehicleId;
  const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>(
    incomingVehicleId,
  );

  // M2: same defect class as B5 - the Report tab stays mounted, so a vehicle
  // picked on Home/Details never replaced the one seeded at first mount. Consume
  // the param afterwards so a later dropdown choice is not overwritten.
  useEffect(() => {
    if (!incomingVehicleId) {
      return;
    }
    setSelectedVehicle(incomingVehicleId);
    navigation.setParams({ vehicleId: undefined });
  }, [incomingVehicleId, navigation]);
  // M31: shared load lifecycle. `retryLoad` is what the error state calls.
  const {
    data,
    error: loadError,
    retry: retryLoad,
  } = useAsyncData(() => reportsService.getReportsData(), 'reports');
  const [vehicleOpen, setVehicleOpen] = useState(false);
  /** S4 range selection + the grid's view cursor, both owned by this screen. */
  const [startDate, setStartDate] = useState<DateType>(MOCK_START_DATE);
  const [endDate, setEndDate] = useState<DateType>(MOCK_END_DATE);
  const [displayedMonth, setDisplayedMonth] = useState<number>(MOCK_MONTH);
  const [displayedYear, setDisplayedYear] = useState<number>(MOCK_YEAR);
  const [hour, setHour] = useState<string>('');
  const [minute, setMinute] = useState<string>('');

  // S3–S6 collapse (250ms via the shared hook), EXPANDED on first mount.
  // `isExpanded` is the single source of truth shared by the S3 chevron, the
  // pointer triangle and the S4–S6 body.
  const { isExpanded, toggle, anim, animatedHeight, onMeasureLayout } =
    useCollapsible(true);

  // When the body opens, bring the calendar back into view from the top. Guarded by
  // a ref so it only fires on the collapsed -> expanded transition, and deferred
  // past the height animation: firing it on the same frame as the toggle means the
  // content is still short, so the offset gets clamped and the user is left parked
  // mid-list instead of at the calendar. Closing never moves the scroll position.
  const scrollViewRef = useRef<ScrollViewInstance>(null);
  const wasExpandedRef = useRef(true);

  useEffect(() => {
    const wasExpanded = wasExpandedRef.current;
    wasExpandedRef.current = isExpanded;
    if (!isExpanded || wasExpanded) {
      return undefined;
    }
    const timer = setTimeout(() => {
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }, spacing.collapseMs + 60);
    return () => clearTimeout(timer);
  }, [isExpanded]);

  const { message: toast, anim: toastAnim, showToast } = useToast();


  // Seed the pickers from the mock's pre-selected indices once the payload
  // lands. Keyed on `data`, so a retry reseeds from the fresh payload.
  useEffect(() => {
    if (!data) {
      return;
    }
    setHour(data.hourRow.chips[data.hourRow.selected] ?? '');
    setMinute(data.minRow.chips[data.minRow.selected] ?? '');
  }, [data]);

  /** S1: the only real navigation on this screen. */
  const handleAvatar = useCallback(() => {
    navigation
      .getParent<{ navigate: (name: string) => void }>()
      ?.navigate('ProfileTab');
  }, [navigation]);

  // stack root: back is intentionally disabled (chevron stays for pixel-match)
  const handleBack = useCallback(() => {
    // stack root: back disabled
  }, []);

  const handleVehicleToggle = useCallback(() => setVehicleOpen(prev => !prev), []);

  const handleVehicleSelect = useCallback(
    (option: SelectFieldOption) => {
      setSelectedVehicle(option.id);
      setVehicleOpen(false);
      showToast(`${option.label} selected`);
    },
    [showToast],
  );

  /** S4 day tap: record the new range. The calendar auto-navigates its own view. */
  const handleRangeChange = useCallback((nextStart: DateType, nextEnd: DateType) => {
    setStartDate(nextStart);
    setEndDate(nextEnd);
  }, []);

  /** S4 month chevron / selector. Moves the VIEW only — never the selection. */
  const handleMonthChange = useCallback((month: number) => {
    setDisplayedMonth(month);
  }, []);

  const handleYearChange = useCallback((year: number) => {
    setDisplayedYear(year);
  }, []);

  const handleHour = useCallback(
    (value: string) => {
      setHour(value);
      showToast(`Hour ${value}`);
    },
    [showToast],
  );

  const handleMinute = useCallback(
    (value: string) => {
      setMinute(value);
      showToast(`Min ${value}`);
    },
    [showToast],
  );

  const handleTilePress = useCallback(
    (title: string) => {
      showToast(`${title} opened`);
    },
    [showToast],
  );

  const handleShare = useCallback(
    (title: string) => {
      showToast(`${title} shared`);
    },
    [showToast],
  );

  const handleAdd = useCallback(
    (title: string) => {
      showToast(`${title} added`);
    },
    [showToast],
  );

  const vehicleOptions = useMemo<SelectFieldOption[]>(
    () => (data?.vehicleOptions ?? []).map(v => ({ id: v.id, label: v.name })),
    [data],
  );

  const selectedLabel = useMemo(
    () => vehicleOptions.find(o => o.id === selectedVehicle)?.label,
    [vehicleOptions, selectedVehicle],
  );

  const categories = useMemo(
    () =>
      (data?.categories ?? []).map(category => (
        <ReportCategorySection
          key={category.title}
          category={category}
          onTilePress={handleTilePress}
          onShare={handleShare}
          onAdd={handleAdd}
        />
      )),
    [data, handleTilePress, handleShare, handleAdd],
  );

  // S1 right slot. AppHeader only renders `actions` when showAvatar is false, so
  // Reports supplies its OWN tappable avatar there rather than asking the
  // shared header to grow an onPress prop (which would touch frozen screens).
  // TOP-HEADER STANDARD: the shared 32dp portrait (`profile_avatar.png`), not
  // the full Profile-screen JPEG, which cropped to a circle as a white disc.
  const headerAvatar = useMemo(
    () => (
      <Pressable
        onPress={handleAvatar}
        hitSlop={6}
        accessibilityRole="button"
        accessibilityLabel="Open profile"
        testID="reports-avatar">
        <View style={styles.avatarFrame}>
          <Image source={require('../../../../assets/profile_avatar.png')} style={styles.avatar} />
        </View>
      </Pressable>
    ),
    [handleAvatar],
  );

  if (!data) {
    return (
      <View style={styles.screen}>
        <AppHeader
          title="Reports"
          onBack={handleBack}
          showAvatar={false}
          actions={headerAvatar}
        />
        {loadError ? (
          <ScreenState
            kind="error"
            message="We could not load your reports. Check your connection and try again."
            onAction={retryLoad}
          />
        ) : (
          <ScreenState kind="loading" message="Loading your reports." />
        )}
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Reports"
        onBack={handleBack}
        showAvatar={false}
        actions={headerAvatar}
      />

      <ScrollView
        ref={scrollViewRef}
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollPadBottom }]}
        showsVerticalScrollIndicator={false}
        testID="reports-scroll">
        {/* S2 select vehicle */}
        <View style={styles.fieldBlock}>
          <SelectField
            label={selectedLabel ?? 'Select Vehicle'}
            onPress={handleVehicleToggle}
            options={vehicleOpen ? vehicleOptions : undefined}
            selectedId={selectedVehicle}
            onSelect={handleVehicleSelect}
            testID="reports-vehicle-field"
          />
        </View>

        {/* S3 select date & time — the pointer triangle ties it to S4 */}
        <View style={styles.fieldBlock}>
          <SelectField
            label="Select Date & Time"
            onPress={toggle}
            showPointer
            expanded={isExpanded}
            testID="reports-date-field"
          />
        </View>

        {/* S4–S6 collapsible date/time body (250ms, expanded by default) */}
        <Animated.View
          style={[styles.collapseWrap, { height: animatedHeight, opacity: anim }]}>
          <View
            onLayout={e => onMeasureLayout(e.nativeEvent.layout.height)}
            testID="reports-date-body">
            <View style={styles.calendarBlock}>
              <DateRangeCalendar
                startDate={startDate}
                endDate={endDate}
                displayedMonth={displayedMonth}
                displayedYear={displayedYear}
                onRangeChange={handleRangeChange}
                onMonthChange={handleMonthChange}
                onYearChange={handleYearChange}
                testIDPrefix="reports-calendar"
              />
            </View>

            <View style={styles.pickerRow}>
              <HourMinPicker
                label={data.hourRow.label}
                options={data.hourRow.chips}
                selected={hour}
                onSelect={handleHour}
                variant="reports"
                testID="reports-hour"
              />
            </View>
            <View style={styles.pickerRow}>
              <HourMinPicker
                label={data.minRow.label}
                options={data.minRow.chips}
                selected={minute}
                onSelect={handleMinute}
                variant="reports"
                testID="reports-min"
              />
            </View>
          </View>
        </Animated.View>

        {/* S7–S9 category cards */}
        {categories}
      </ScrollView>

      <Toast message={toast} anim={toastAnim} testID="reports-toast" />
    </View>
  );
}

export default ReportsScreen;

