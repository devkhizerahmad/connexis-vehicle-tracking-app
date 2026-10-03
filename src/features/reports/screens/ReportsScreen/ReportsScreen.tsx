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
//   S4 calendar          ReportsCalendar (dark, verbatim day highlights)
//   S5/S6 pickers        HourMinPicker (variant="reports")
//   S7–S9 categories     ReportCategorySection -> ReportTile x2 each
//   S10 bottom nav       rendered by RootNavigator's BottomNav (REPORT active)
//
// Everything is mock-backed today via reportsService. The only navigation is
// the avatar -> ProfileTab; the back chevron is intentionally inert because
// this screen is the stack root.
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  type ScrollViewInstance,
  Text,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader } from '@shared/components/layout/AppHeader';
import {
  SelectField,
  type SelectFieldOption,
} from '@shared/components/controls/SelectField';
import { HourMinPicker } from '@shared/components/controls/HourMinPicker';
import { useCollapsible } from '@shared/hooks/useCollapsible';
import { spacing, sizes } from '@shared/theme';
import { reportsService } from '@features/reports/services/reportsService';
import { ReportCategorySection } from '@features/reports/components/ReportCategorySection';
import { ReportsCalendar } from '@features/reports/components/ReportsCalendar';
import type { ReportsData } from '@features/reports/types/reports';
import type { MonthCursor } from '@features/map/utils/historyDates';
import type { ReportStackParamList } from '@navigation/types';
import { styles } from './styles';

type ReportsScreenProps = NativeStackScreenProps<ReportStackParamList, 'Reports'>;

/** Legacy header tuning, identical to the History pass (header standard exception). */
const HEADER_CONTENT_H = 80;
const HEADER_CENTER_OFFSET = 17;

export function ReportsScreen({ navigation, route }: ReportsScreenProps) {
  // The shared BottomNav is an absolute overlay (RootNavigator's tabBar), so the
  // scroll content clears it explicitly — same pattern Engine Control uses.
  const insets = useSafeAreaInsets();
  const scrollPadBottom = sizes.bottomNavH + insets.bottom + 12;
  // ReportsScreen is reachable directly with a vehicleId (Home's card "Reports"
  // button). Seeding it here pre-selects that vehicle; an unknown/absent id leaves
  // the "Select Vehicle" placeholder untouched (selectedLabel resolves via find()).
  const [selectedVehicle, setSelectedVehicle] = useState<string | undefined>(
    route?.params?.vehicleId,
  );
  const [data, setData] = useState<ReportsData | null>(null);
  const [vehicleOpen, setVehicleOpen] = useState(false);
  const [cursor, setCursor] = useState<MonthCursor>({ year: 2018, month: 11 });
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

  // stub toast — the target report flows are not wired yet
  const [toast, setToast] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (message: string) => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
      setToast(message);
      Animated.timing(toastAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      toastTimer.current = setTimeout(() => {
        Animated.timing(toastAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      }, spacing.toastMs);
    },
    [toastAnim],
  );

  useEffect(
    () => () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    },
    [],
  );


  useEffect(() => {
    let mounted = true;
    reportsService.getReportsData().then(payload => {
      if (!mounted) {
        return;
      }
      setData(payload);
      // seed the pickers from the mock's pre-selected indices
      setHour(payload.hourRow.chips[payload.hourRow.selected] ?? '');
      setMinute(payload.minRow.chips[payload.minRow.selected] ?? '');
    });
    return () => {
      mounted = false;
    };
  }, []);

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

  const handleSelectDay = useCallback(
    (day: number) => {
      showToast(`Day ${day} selected`);
    },
    [showToast],
  );

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
  // Reports supplies its OWN tappable 32pt avatar there rather than asking the
  // shared header to grow an onPress prop (which would touch frozen screens).
  const headerAvatar = useMemo(
    () => (
      <Pressable
        onPress={handleAvatar}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Open profile"
        testID="reports-avatar">
        <Image source={require('../../../../assets/profile.jpeg')} style={styles.avatar} />
      </Pressable>
    ),
    [handleAvatar],
  );

  if (!data) {
    // header-only shell while the mock payload resolves
    return (
      <View style={styles.screen}>
        <AppHeader
          title="Reports"
          onBack={handleBack}
          showAvatar={false}
          actions={headerAvatar}
          contentHeight={HEADER_CONTENT_H}
          contentCenterOffset={HEADER_CENTER_OFFSET}
        />
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
        contentHeight={HEADER_CONTENT_H}
        contentCenterOffset={HEADER_CENTER_OFFSET}
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
            <ReportsCalendar
              state={data.calendar}
              cursor={cursor}
              onMonthChange={setCursor}
              onSelectDay={handleSelectDay}
            />

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

      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.toast, { opacity: toastAnim }]}
          testID="reports-toast">
          <Text style={styles.toastText}>{toast}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

export default ReportsScreen;

