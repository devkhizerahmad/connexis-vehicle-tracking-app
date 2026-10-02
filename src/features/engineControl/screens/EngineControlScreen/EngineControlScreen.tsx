// EngineControlScreen.tsx — S1–S12: the Engine Control root of the ENGINE CONTROL stack.
//
// Section map (reference: design-references/engine control enhance version.png):
//   S1  header             AppHeader variant="standard"; inert back (stack root),
//                          32pt avatar -> ProfileTab
//   S2  vehicle + status   VehicleStatusCards (car card | fence pill + Running + address)
//   S3  geofence alert     FenceAlertBanner
//   S4  geofence map       GeofenceMap (read-only: no pan/zoom, corner overlays)
//   S5  change fence       ChangeFenceButton
//   S6  driving routes     RouteList (3 rows: Moving / Idle / Stop)
//   S7  control vehicle    ControlRows (Live Location, Scheduled Remote Starts)
//   S8  lock / unlock      LockUnlockRow
//   S9  privacy policy     PrivacyPolicyRow
//   S10 slide to proceed   SlideToProceed
//   S11 FAQ                FaqCard
//   S12 support            SupportButton
//   bottom nav             rendered by RootNavigator's BottomNav (ENGINE CONTROL active)
//
// Everything is mock-backed today via engineControlService. Apart from the avatar
// (tab switch) every interaction is stubbed with the shared toast — the same
// pattern ReportsScreen uses for its not-yet-wired controls — because no Engine
// Control endpoint exists yet.
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppHeader } from '@shared/components/layout/AppHeader';
import { ecSizes, sizes, spacing } from '@shared/theme';
import { goToLiveMap } from '@shared/utils/navigationHelpers';
import type { RootTabParamList } from '@navigation/types';
import { ChangeFenceButton } from '@features/engineControl/components/ChangeFenceButton';
import { ControlRows } from '@features/engineControl/components/ControlRows';
import { FaqCard } from '@features/engineControl/components/FaqCard';
import { FenceAlertBanner } from '@features/engineControl/components/FenceAlertBanner';
import { GeofenceMap } from '@features/engineControl/components/GeofenceMap';
import { LockUnlockRow } from '@features/engineControl/components/LockUnlockRow';
import { PrivacyPolicyRow } from '@features/engineControl/components/PrivacyPolicyRow';
import { RouteList } from '@features/engineControl/components/RouteList';
import { SlideToProceed } from '@features/engineControl/components/SlideToProceed';
import { SupportButton } from '@features/engineControl/components/SupportButton';
import { VehicleStatusCards } from '@features/engineControl/components/VehicleStatusCards';
import { engineControlService } from '@features/engineControl/services/engineControlService';
import type { EngineControlData } from '@features/engineControl/types/engineControl';
import type { EngineControlStackParamList } from '@navigation/types';
import { styles } from './styles';

type EngineControlScreenProps = NativeStackScreenProps<
  EngineControlStackParamList,
  'EngineControlMain'
>;

/**
 * W4: the vehicle this screen acts on. Engine Control has no vehicle switcher and its
 * mock exposes no id, so it maps to the shared default vehicle used across the Home /
 * Details / LiveMap / Reports mocks. Exported so the id stays in ONE place.
 */
const CURRENT_VEHICLE_ID = 'LFA-1464';

export function EngineControlScreen({ navigation }: EngineControlScreenProps) {
  const [data, setData] = useState<EngineControlData | null>(null);
  // W4: this screen's `navigation` is a STACK prop (EngineControlStack), but the
  // helper needs the ROOT tab prop to switch tabs — same typed handle LiveMap uses.
  const tabNav = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const [toast, setToast] = useState<string>('');
  const [avatarBroken, setAvatarBroken] = useState(false);
  // F13: the shared tab bar is an absolute overlay (BottomNav/styles.ts), so the
  // scroll content needs explicit clearance for it plus the device gesture inset.
  const insets = useSafeAreaInsets();
  const scrollPadBottom = sizes.bottomNav + insets.bottom + ecSizes.scrollNavBuffer;
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let alive = true;
    engineControlService.getEngineControlData().then(payload => {
      if (alive) {
        setData(payload);
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  // Cancel a pending toast dismissal if the screen unmounts mid-fade.
  useEffect(
    () => () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    },
    [],
  );

  const showToast = useCallback(
    (message: string) => {
      setToast(message);
      toastAnim.setValue(0);
      Animated.timing(toastAnim, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }).start();
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
      toastTimer.current = setTimeout(() => {
        Animated.timing(toastAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            setToast('');
          }
        });
      }, spacing.toastMs);
    },
    [toastAnim],
  );

  // S1 back chevron: this screen IS the stack root, so the chevron stays inert
  // (reference parity + the ReportsScreen precedent).
  const handleBack = useCallback(() => {}, []);

  // S1 avatar -> ProfileTab (cross-tab, same cast ReportsScreen uses).
  const handleAvatar = useCallback(() => {
    navigation.getParent<{ navigate: (name: string) => void }>()?.navigate('ProfileTab');
  }, [navigation]);

  // Stubs: no Engine Control endpoint exists yet, so every control reports back
  // through the toast instead of silently doing nothing.
  const handleChangeFence = useCallback(() => showToast('Change Fence'), [showToast]);
  // W4: "Live Location" opens the Live Map for this screen's vehicle; every other
  // control row (e.g. "Scheduled Remote Starts") keeps its stub toast. Handler-only.
  const handleControlRow = useCallback(
    (id: string) => {
      if (id === 'live-location') {
        goToLiveMap(tabNav, CURRENT_VEHICLE_ID);
        return;
      }
      showToast(id);
    },
    [showToast, tabNav],
  );
  const handleLock = useCallback(() => showToast('Engine locked'), [showToast]);
  const handleUnlock = useCallback(() => showToast('Engine unlocked'), [showToast]);
  const handlePrivacy = useCallback(() => showToast('Privacy Policy'), [showToast]);
  const handleProceed = useCallback(() => showToast('Slide to Proceed'), [showToast]);
  const handleSupport = useCallback(() => showToast('Support'), [showToast]);

  const headerAvatar = (
    <Pressable
      onPress={handleAvatar}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel="Open profile"
      testID="ec-avatar">
      {/* F1: real photo, never a blank circle. `profile_avatar.png` is the young-man
          portrait (profile.jpeg is the full Profile SCREEN shot and renders as a
          blank corner when cropped to a 32 pt circle). onError swaps in a tinted
          fallback so a missing/broken asset can still not render as white. */}
      <Image
        source={require('../../../../assets/profile_avatar.png')}
        style={styles.avatar}
        onError={() => setAvatarBroken(true)}
      />
      {avatarBroken ? <View style={styles.avatarFallback} testID="ec-avatar-fallback" /> : null}
    </Pressable>
  );

  if (!data) {
    // header-only shell while the mock payload resolves
    return (
      <View style={styles.screen}>
        <AppHeader
          title="Engine Control"
          onBack={handleBack}
          showAvatar={false}
          actions={headerAvatar}
        />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <AppHeader
        title="Engine Control"
        onBack={handleBack}
        showAvatar={false}
        actions={headerAvatar}
      />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: scrollPadBottom }]}
        showsVerticalScrollIndicator={false}
        testID="engine-control-scroll">
        {/* S2 vehicle identity + live status */}
        <View style={styles.vehicleBlock}>
          <VehicleStatusCards vehicle={data.vehicle} onFencePress={handleChangeFence} />
        </View>

        {/* S3 out-of-geofence alert */}
        <View style={styles.alertBlock}>
          <FenceAlertBanner message={data.alert} />
        </View>

        {/* S4 read-only geofence map */}
        <View style={styles.mapBlock}>
          <GeofenceMap state={data.map} />
        </View>

        {/* S5 change fence */}
        <View style={styles.fenceBlock}>
          <ChangeFenceButton label={data.changeFenceLabel} onPress={handleChangeFence} />
        </View>

        {/* S6 driving routes */}
        <View style={styles.routesBlock}>
          <RouteList title={data.routesSectionTitle} routes={data.routes} />
        </View>

        {/* S7–S10 one card: rows, lock/unlock, privacy policy, slide to proceed */}
        <View style={styles.controlBlock}>
          <ControlRows
            title={data.controlSectionTitle}
            rows={data.controls}
            onRowPress={handleControlRow}>
            <LockUnlockRow
              lockLabel={data.lockLabel}
              unlockLabel={data.unlockLabel}
              onLock={handleLock}
              onUnlock={handleUnlock}
            />
            <PrivacyPolicyRow label={data.privacyLabel} onPress={handlePrivacy} />
            <SlideToProceed label={data.slideLabel} onProceed={handleProceed} />
          </ControlRows>
        </View>

        {/* S11 FAQ */}
        <View style={styles.faqBlock}>
          <FaqCard title={data.faqTitle} entries={data.faq} />
        </View>

        {/* S12 support */}
        <View style={styles.supportBlock}>
          <SupportButton label={data.supportLabel} onPress={handleSupport} />
        </View>
      </ScrollView>

      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[styles.toast, { opacity: toastAnim }]}
          testID="ec-toast">
          <Text style={styles.toastText}>{toast}</Text>
        </Animated.View>
      ) : null}
    </View>
  );
}

export default EngineControlScreen;
