// LiveMapScreen.tsx — Map tab entry screen (S1–S6, 390pt reference).
// S1 header: AppHeader Profile-legacy geometry (contentHeight=100 + contentCenterOffset=32)
// with the 32pt circular avatar in the right slot; left chevron pops the stack.
// NOTE: contentHeight/contentCenterOffset are the task-spec-mandated exception to
// AppHeader's deprecated-props rule (same values as the frozen Profile header).
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StatusBar, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppHeader from '@shared/components/layout/AppHeader';
import { sizes } from '@shared/theme';
import { mapService } from '@features/map/services/mapService';
import type { LiveMapData, VehicleOption } from '@features/map/types/map';
import { LiveMapView } from '@features/map/components/LiveMapView';
import { MapVehicleCard } from '@features/map/components/MapVehicleCard';
import { SelectVehicleField } from '@features/map/components/SelectVehicleField';
import { MapStackParamList, RootTabParamList } from '@navigation/types';
import { MAP_NAV_GAP, styles } from './styles';

type LiveMapScreenProps = NativeStackScreenProps<MapStackParamList, 'LiveMap'>;

export function LiveMapScreen({ route, navigation }: LiveMapScreenProps) {
  const [data, setData] = useState<LiveMapData | null>(null);
  const [options, setOptions] = useState<VehicleOption[]>([]);
  const [vehicleId, setVehicleId] = useState<string | undefined>(route?.params?.vehicleId);
  // typed cross-tab handle (avatar -> ProfileTab, stack-root back -> HomeTab)
  const tabNav = useNavigation<BottomTabNavigationProp<RootTabParamList>>();
  const insets = useSafeAreaInsets();

  // PATCH L1: BottomNav is absolutely positioned over the scene (height =
  // sizes.bottomNavH + insets.bottom), so the map box has to clear the bar before
  // the 12pt gap is visible: mapBottom === navTop - MAP_NAV_GAP.
  // V5-PART1: `sizes.bottomNavH` == `sizes.bottomNav` (both 56); the mandated token is
  // used so every screen spells the same formula.
  const mapMarginBottom = MAP_NAV_GAP + sizes.bottomNavH + insets.bottom;

  // Load dropdown options once; reload the live payload when the selection changes.
  useEffect(() => {
    let mounted = true;
    mapService.getVehicleOptions().then(opts => {
      if (mounted) {
        setOptions(opts);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    mapService.getLiveMapData(vehicleId).then(payload => {
      if (mounted) {
        setData(payload);
      }
    });
    return () => {
      mounted = false;
    };
  }, [vehicleId]);

  /** S1: left chevron pops the Map stack (falls back to the Home tab at root). */
  const handleBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
      return;
    }
    tabNav.navigate('HomeTab', { screen: 'Home' });
  }, [navigation, tabNav]);

  /** S1: 32pt avatar -> ProfileTab > Profile (cross-tab typed). */
  const handleAvatar = useCallback(() => {
    tabNav.navigate('ProfileTab', { screen: 'ProfileMain' });
  }, [tabNav]);

  /** S2: selection swaps S3 card data + S5 route + camera (animated fit). */
  const handleSelect = useCallback((option: VehicleOption) => {
    setVehicleId(option.id);
  }, []);

  /** S3: View History -> HistoryScreen shell. */
  const handleViewHistory = useCallback(
    (id: string) => {
      navigation.navigate('History', { vehicleId: id });
    },
    [navigation],
  );

  const selectedName = useMemo(() => {
    if (!data) {
      return undefined;
    }
    return options.find(option => option.id === data.vehicle.id)?.name ?? data.vehicle.name;
  }, [data, options]);

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <AppHeader
        title="Live Map"
        showAvatar={false}
        contentHeight={100}
        contentCenterOffset={32}
        onBack={handleBack}
        actions={
          <Pressable onPress={handleAvatar} hitSlop={8}>
            <Image
              source={require('../../../../assets/profile_avatar.png')}
              style={styles.avatar}
            />
          </Pressable>
        }
      />

      {data ? (
        <View style={styles.body}>
          <SelectVehicleField
            selectedName={selectedName}
            options={options}
            onSelect={handleSelect}
          />
          <MapVehicleCard vehicle={data.vehicle} onViewHistory={handleViewHistory} />
          <View style={[styles.mapWrap, { marginBottom: mapMarginBottom }]}>
            <LiveMapView
              route={data.vehicle.route}
              trafficSegment={data.trafficSegment}
              dashedSegment={data.dashedSegment}
              pins={data.pins}
              dots={data.dots}
              car={data.vehicle.car}
            />
          </View>
        </View>
      ) : null}
    </View>
  );
}

export default LiveMapScreen;