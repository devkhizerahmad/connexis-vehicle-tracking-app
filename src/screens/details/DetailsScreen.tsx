// DetailsScreen.tsx — "Details" screen assembly (mock-data driven, 390x844 target)
import React, {useCallback, useRef, useState} from 'react';
import {Animated, ScrollView, StatusBar, StyleSheet, Text, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import mock from './details_mock.json';
import {AppHeader} from './AppHeader';
import {PlateStatusRow} from './PlateStatusRow';
import {VehicleInfoCard} from './VehicleInfoCard';
import {KpiRow} from './KpiRow';
import {SensorBlock} from './SensorBlock';
import {RoutesCard} from './RoutesCard';
import {QuickReportGrid} from './QuickReportGrid';
import {OverallActivity} from './OverallActivity';
import {BottomNav} from './BottomNav';
import {C, H, L, S} from '../../theme/detailsTokens';

export default function DetailsScreen() {
  const [toast, setToast] = useState<string | null>(null);
  const toastAnim = useRef(new Animated.Value(0)).current;
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback(
    (msg: string) => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
      setToast(msg);
      Animated.timing(toastAnim, {toValue: 1, duration: 150, useNativeDriver: true}).start();
      toastTimer.current = setTimeout(() => {
        Animated.timing(toastAnim, {toValue: 0, duration: 200, useNativeDriver: true}).start();
      }, L.toastMs);
    },
    [toastAnim],
  );

  return (
    <SafeAreaProvider>
      <View style={styles.screen}>
        <StatusBar barStyle="light-content" />
        <ScrollView
          contentContainerStyle={{paddingBottom: H.bottomNav + 24}}
          showsVerticalScrollIndicator={false}>
          <AppHeader onBack={() => showToast('Back pressed')} />

          <View style={{paddingHorizontal: S.pageMargin, paddingTop: L.gridGap, gap: L.gridGap}}>
          <PlateStatusRow plate={mock.plate} status={mock.status} />

          <VehicleInfoCard
            speedLabel={mock.speedLabel}
            speed={mock.speed}
            updateLabel={mock.updateLabel}
            update={mock.update}
            lastLocationLabel={mock.lastLocationLabel}
            location={mock.location}
            liveLocation={mock.liveLocation}
            onLiveLocation={() => showToast('Opening Live Location…')}
          />

          <KpiRow kpis={mock.kpis} />

          <SensorBlock
            title={mock.fuelSensor.title}
            accent="amber"
            dropdown={mock.fuelSensor.dropdown}
            tiles={mock.fuelSensor.tiles}
            banner={mock.fuelSensor.banner as {kind: 'alert' | 'success'; text: string}}
            onSelectPress={() => showToast('No sensors available yet')}
          />

          <SensorBlock
            title={mock.tempSensor.title}
            accent="blue"
            dropdown={mock.tempSensor.dropdown}
            tiles={mock.tempSensor.tiles}
            banner={mock.tempSensor.banner as {kind: 'alert' | 'success'; text: string}}
            onSelectPress={() => showToast('No sensors available yet')}
          />

          <RoutesCard
            routes={mock.routes}
            viewMore={mock.viewMore}
            onViewMore={() => showToast('Opening all routes…')}
          />

          <QuickReportGrid reports={mock.reports} onTileTap={l => showToast(`${l} tapped`)} />

          <OverallActivity
            title={mock.activity.title}
            tabs={mock.activity.tabs}
            advice={mock.activity.advice}
          />
        </View>
      </ScrollView>

      <BottomNav tabs={mock.nav} active="Home" onTabPress={t => showToast(`${t} tapped`)} />

      {/* Toast */}
      {toast ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.toast,
            {opacity: toastAnim, bottom: H.bottomNav + 16},
          ]}>
          <Text style={{color: C.white, fontSize: 12}}>{toast}</Text>
        </Animated.View>
      ) : null}
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: C.bg,
  },
  toast: {
    position: 'absolute',
    left: S.pageMargin,
    right: S.pageMargin,
    backgroundColor: C.navy,
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
});
