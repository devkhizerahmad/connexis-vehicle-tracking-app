// DetailsScreen.tsx — Details screen assembly (390x844 target)
import React, { useState } from 'react';
import { ScrollView, StatusBar, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type {
  HomeStackParamList,
  RootTabParamList,
} from '@navigation/types';
import AppHeader from '@shared/components/layout/AppHeader';
import { ScreenState } from '@shared/components/feedback/ScreenState';
import { Toast } from '@shared/components/feedback/Toast';
import { useToast } from '@shared/hooks/useToast';
import PlateStatusRow from '@shared/components/vehicle/PlateStatusRow';
import VehicleInfoCard from '@shared/components/vehicle/VehicleInfoCard';
import KpiRow from '@features/home/components/KpiRow';
import SensorBlock from '@features/home/components/SensorBlock';
import RoutesCard from '@features/home/components/RoutesCard';
import QuickReportGrid from '@features/home/components/QuickReportGrid';
import OverallActivity from '@features/home/components/OverallActivity';
import { useVehicleDetails } from '@features/home/hooks/useVehicleDetails';
import { calculateKpiGap } from '@shared/utils/styleFactories';
import { goToLiveMap } from '@shared/utils/navigationHelpers';
import { spacing, sizes } from '@shared/theme';
import { styles } from './styles';

/**
 * B9: Details is a Home-stack screen, so its props are typed against the stack —
 * `navigation?: any` is gone, and the eight `as any` casts on the details
 * payload are gone too (that payload already matched its component props).
 * Cross-TAB navigation (the "live location" button) uses the same hook pattern
 * as LiveMapScreen.
 */
type DetailsScreenProps = NativeStackScreenProps<HomeStackParamList, 'Details'>;

export function DetailsScreen({ route, navigation }: DetailsScreenProps) {
  const vehicleId = route.params?.vehicleId ?? 'LFA-1464';
  const tabNav = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const { details, loading, error, retry } = useVehicleDetails(vehicleId);

  const { message: toast, anim: toastAnim, showToast } = useToast();
  const [cardH, setCardH] = useState(0);
  const [cyH, setCyH] = useState(0);

  const kpiGap = calculateKpiGap(cardH, cyH);

  // V5-PART1: Details lives INSIDE HomeTab, so RootNavigator's CustomTabBar already
  // draws the (absolute) BottomNav here — this screen's own <BottomNav> was the
  // second bar. The scroll content now clears the overlay instead, including the
  // device inset so it holds on gesture-bar AND 3-button devices.
  const insets = useSafeAreaInsets();
  const scrollPadBottom = sizes.bottomNavH + insets.bottom + 12;

  if (!details) {
    return (
      <SafeAreaProvider>
        <View style={styles.screen}>
          <StatusBar barStyle="light-content" />
          <AppHeader variant="standard" onBack={() => navigation.goBack()} />
          {loading ? (
            <ScreenState kind="loading" message="Loading vehicle details." />
          ) : error ? (
            <ScreenState
              kind="error"
              message="We could not load this vehicle. Check your connection and try again."
              onAction={retry}
            />
          ) : (
            <ScreenState
              kind="empty"
              title="Vehicle not found"
              message="This vehicle is no longer available."
            />
          )}
        </View>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.screen}>
        <StatusBar barStyle="light-content" />
        {/*
          TOP-HEADER STANDARD: the back affordance now really pops the stack
          (it used to raise a toast and stay put). The shared header supplies
          the "Back" label and the 44dp target.
        */}
        <AppHeader variant="standard" onBack={() => navigation.goBack()} />

        <ScrollView
          contentContainerStyle={[styles.scrollViewContent, { paddingBottom: scrollPadBottom }]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.contentPadding}>
            <PlateStatusRow plate={details.plate} status={details.status} />

            <View onLayout={e => setCardH(e.nativeEvent.layout.height)}>
              <VehicleInfoCard
                speedLabel={details.speedLabel}
                speed={details.speed}
                updateLabel={details.updateLabel}
                update={details.update}
                lastLocationLabel={details.lastLocationLabel}
                location={details.location}
                liveLocation={details.liveLocation}
                // W3: open Live Map for THIS vehicle. Handler-only change; the
                // button's pin glyph/label/style stay frozen.
                onLiveLocation={() => {
                  if (navigation) {
                    goToLiveMap(tabNav, vehicleId);
                  }
                }}
                onCyanHeight={setCyH}
              />
            </View>

            <View style={{ marginTop: Math.max(0, kpiGap - spacing.gridGap) }}>
              <KpiRow kpis={details.kpis} />
            </View>

            <SensorBlock
              title={details.fuelSensor.title}
              accent="amber"
              dropdown={details.fuelSensor.dropdown}
              tiles={details.fuelSensor.tiles}
              banner={details.fuelSensor.banner}
              onSelectPress={() => showToast('No sensors available yet')}
            />

            <SensorBlock
              title={details.tempSensor.title}
              accent="blue"
              dropdown={details.tempSensor.dropdown}
              tiles={details.tempSensor.tiles}
              banner={details.tempSensor.banner}
              onSelectPress={() => showToast('No sensors available yet')}
            />

            <RoutesCard
              routes={details.routes}
              viewMore={details.viewMore}
              onViewMore={() => showToast('Opening all routes…')}
            />

            <QuickReportGrid
              reports={details.reports}
              onTileTap={l => showToast(`${l} tapped`)}
            />

            <OverallActivity
              title={details.activity.title}
              tabs={details.activity.tabs}
              advice={details.activity.advice}
              score={details.activity.score}
            />
          </View>
        </ScrollView>

        <Toast message={toast} anim={toastAnim} testID="details-toast" />
      </View>
    </SafeAreaProvider>
  );
}

export default DetailsScreen;
