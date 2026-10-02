// DetailsScreen.tsx — Details screen assembly (390x844 target)
import React, { useCallback, useRef, useState } from 'react';
import { Animated, ScrollView, StatusBar, Text, View } from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from '@shared/components/layout/AppHeader';
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

interface DetailsScreenProps {
  route?: { params?: { vehicleId?: string } };
  navigation?: any;
}

export function DetailsScreen({ route, navigation }: DetailsScreenProps) {
  const vehicleId = route?.params?.vehicleId ?? 'LFA-1464';
  const { details } = useVehicleDetails(vehicleId);

  const [toast, setToast] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [cardH, setCardH] = useState(0);
  const [cyH, setCyH] = useState(0);

  const kpiGap = calculateKpiGap(cardH, cyH);

  const showToast = useCallback(
    (msg: string) => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
      setToast(msg);
      Animated.timing(toastAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
      toastTimer.current = setTimeout(() => {
        Animated.timing(toastAnim, { toValue: 0, duration: 200, useNativeDriver: true }).start();
      }, spacing.toastMs);
    },
    [toastAnim],
  );

  // V5-PART1: Details lives INSIDE HomeTab, so RootNavigator's CustomTabBar already
  // draws the (absolute) BottomNav here — this screen's own <BottomNav> was the
  // second bar. The scroll content now clears the overlay instead, including the
  // device inset so it holds on gesture-bar AND 3-button devices.
  const insets = useSafeAreaInsets();
  const scrollPadBottom = sizes.bottomNavH + insets.bottom + 12;

  if (!details) {
    return (
      <SafeAreaProvider>
        <View style={styles.screen} />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <View style={styles.screen}>
        <StatusBar barStyle="light-content" />
        <AppHeader variant="standard" onBack={() => showToast('Back pressed')} />

        <ScrollView
          contentContainerStyle={[styles.scrollViewContent, { paddingBottom: scrollPadBottom }]}
          showsVerticalScrollIndicator={false}>
          <View style={styles.contentPadding}>
            <PlateStatusRow plate={details.plate as any} status={details.status as any} />

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
                    goToLiveMap(navigation, vehicleId);
                  }
                }}
                onCyanHeight={setCyH}
              />
            </View>

            <View style={{ marginTop: Math.max(0, kpiGap - spacing.gridGap) }}>
              <KpiRow kpis={details.kpis as any} />
            </View>

            <SensorBlock
              title={details.fuelSensor.title}
              accent="amber"
              dropdown={details.fuelSensor.dropdown}
              tiles={details.fuelSensor.tiles as any}
              banner={details.fuelSensor.banner as any}
              onSelectPress={() => showToast('No sensors available yet')}
            />

            <SensorBlock
              title={details.tempSensor.title}
              accent="blue"
              dropdown={details.tempSensor.dropdown}
              tiles={details.tempSensor.tiles as any}
              banner={details.tempSensor.banner as any}
              onSelectPress={() => showToast('No sensors available yet')}
            />

            <RoutesCard
              routes={details.routes as any}
              viewMore={details.viewMore}
              onViewMore={() => showToast('Opening all routes…')}
            />

            <QuickReportGrid
              reports={details.reports as any}
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

        {toast ? (
          <Animated.View
            pointerEvents="none"
            style={[
              styles.toast,
              { opacity: toastAnim },
            ]}>
            <Text style={styles.toastText}>{toast}</Text>
          </Animated.View>
        ) : null}
      </View>
    </SafeAreaProvider>
  );
}

export default DetailsScreen;
