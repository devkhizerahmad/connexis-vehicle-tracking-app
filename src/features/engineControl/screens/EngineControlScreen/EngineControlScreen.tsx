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
//   S8  lock / unlock      ControlSwipeCard > LockUnlockRow (SELECTORS — arming
//                          one never locks anything on its own)
//   S9  privacy policy     ControlSwipeCard's middle child > PrivacyPolicyRow
//   S10 slide to proceed   ControlSwipeCard > rn-swipe-button (the only thing
//                          that can actually perform a lock/unlock)
//   S11 FAQ                FaqCard
//   S12 support            SupportButton
//   bottom nav             rendered by RootNavigator's BottomNav (ENGINE CONTROL active)
//
// Everything is mock-backed today via engineControlService. Apart from the avatar
// (tab switch) every interaction is stubbed with the shared toast — the same
// pattern ReportsScreen uses for its not-yet-wired controls — because no Engine
// Control endpoint exists yet.
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { AppHeader } from '@shared/components/layout/AppHeader';
import { ScreenState } from '@shared/components/feedback/ScreenState';
import { Toast } from '@shared/components/feedback/Toast';
import { useToast } from '@shared/hooks/useToast';
import { ecSizes, sizes } from '@shared/theme';
import { goToLiveMap } from '@shared/utils/navigationHelpers';
import type { RootTabParamList } from '@navigation/types';
import { ChangeFenceButton } from '@features/engineControl/components/ChangeFenceButton';
import { ControlRows } from '@features/engineControl/components/ControlRows';
import { ControlSwipeCard } from '@features/engineControl/components/ControlSwipeCard';
import { FaqCard } from '@features/engineControl/components/FaqCard';
import { GeofenceMap } from '@features/engineControl/components/GeofenceMap';
import { PrivacyPolicyRow } from '@features/engineControl/components/PrivacyPolicyRow';
import { RouteList } from '@features/engineControl/components/RouteList';
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
  const [loadError, setLoadError] = useState<Error | null>(null);
  const [attempt, setAttempt] = useState(0);
  // W4: this screen's `navigation` is a STACK prop (EngineControlStack), but the
  // helper needs the ROOT tab prop to switch tabs — same typed handle LiveMap uses.
  const tabNav = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { message: toast, anim: toastAnim, showToast } = useToast();
  const [avatarBroken, setAvatarBroken] = useState(false);
  // F13: the shared tab bar is an absolute overlay (BottomNav/styles.ts), so the
  // scroll content needs explicit clearance for it plus the device gesture inset.
  const insets = useSafeAreaInsets();
  const scrollPadBottom = sizes.bottomNav + insets.bottom + ecSizes.scrollNavBuffer;

  useEffect(() => {
    let alive = true;
    setLoadError(null);
    engineControlService
      .getEngineControlData()
      .then(payload => {
        if (alive) {
          setData(payload);
        }
      })
      .catch((reason: unknown) => {
        if (alive) {
          setLoadError(reason instanceof Error ? reason : new Error(String(reason)));
        }
      });
    return () => {
      alive = false;
    };
  }, [attempt]);

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
  const handlePrivacy = useCallback(() => showToast('Privacy Policy'), [showToast]);
  const handleSupport = useCallback(() => showToast('Support'), [showToast]);

  const headerAvatar = (
    <Pressable
      onPress={handleAvatar}
      hitSlop={8}
      style={styles.avatar}
      accessibilityRole="button"
      accessibilityLabel="Open profile"
      testID="ec-avatar">
      {/* F1: real photo, never a blank circle. `profile_avatar.png` is the young-man
          portrait (profile.jpeg is the full Profile SCREEN shot and renders as a
          blank corner when cropped to a 32 pt circle). onError swaps in a tinted
          fallback so a missing/broken asset can still not render as white.
          P8: the photo is rendered OVER-SIZED inside the circular `avatar` clip so
          the asset's baked-in white hoop is cropped away — no asset swap. */}
      <Image
        source={require('../../../../assets/profile_avatar.png')}
        style={styles.avatarImage}
        onError={() => setAvatarBroken(true)}
      />
      {avatarBroken ? <View style={styles.avatarFallback} testID="ec-avatar-fallback" /> : null}
    </Pressable>
  );

  if (!data) {
    return (
      <View style={styles.screen}>
        <AppHeader
          title="Engine Control"
          onBack={handleBack}
          showAvatar={false}
          actions={headerAvatar}
        />
        {loadError ? (
          <ScreenState
            kind="error"
            message="We could not load engine control. Check your connection and try again."
            onAction={() => setAttempt(n => n + 1)}
          />
        ) : (
          <ScreenState kind="loading" message="Loading engine control." />
        )}
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
        {/* S2 vehicle identity + live status, with the out-of-geofence alert as
            the card's BOTTOM footer (live correction C3). */}
        <View style={styles.vehicleBlock}>
          <VehicleStatusCards
            vehicle={data.vehicle}
            alert={data.alert}
            onFencePress={handleChangeFence}
          />
        </View>

        {/* S4 read-only geofence map — its own inset, rounded, shadowed card
            (Vehicle-Dashboard rebuild state restored in C2). No alert inside. */}
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
            {/* PATCH EC-SWIPE: the Lock/Unlock pair and the swipe rail now live
                together inside ControlSwipeCard so arming a selector or dragging
                the rail re-renders only that subtree — not this screen, and so
                never the MapView, routes list or FAQ above it. `showToast` is
                referentially stable, so crossing the boundary costs no render.
                Privacy Policy renders as the card's middle child, keeping the
                reference's Lock/Unlock → Policy → Rail order. */}
            <ControlSwipeCard
              lockLabel={data.lockLabel}
              unlockLabel={data.unlockLabel}
              slideLabel={data.slideLabel}
              onNotice={showToast}>
              <PrivacyPolicyRow label={data.privacyLabel} onPress={handlePrivacy} />
            </ControlSwipeCard>
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

      <Toast message={toast} anim={toastAnim} testID="ec-toast" />
    </View>
  );
}

export default EngineControlScreen;
