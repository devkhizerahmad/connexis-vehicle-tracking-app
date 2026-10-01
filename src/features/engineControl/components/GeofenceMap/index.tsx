// GeofenceMap (S4) — read-only Google map with the geofence circle, the vehicle
// pin and the two corner overlays ("Last Updated" box + "Current Fence" chip).
// All gestures are disabled: the reference is a static snapshot, and disabling
// them keeps the parent ScrollView's vertical scroll intact.
import React, { memo, useMemo } from 'react';
import { Text, View } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { DiamondMarker, ShieldCheckGlyph, TeardropPin } from '@shared/components/icons';
import { ecColors } from '@shared/theme';
import type { EngineMapState } from '@features/engineControl/types/engineControl';
import { ecLightMapStyle, styles } from './styles';

export interface GeofenceMapProps {
  state: EngineMapState;
}

function GeofenceMapImpl({ state }: GeofenceMapProps) {
  const fenceCenter = useMemo(
    () => ({ latitude: state.fence.latitude, longitude: state.fence.longitude }),
    [state.fence.latitude, state.fence.longitude],
  );
  const pinCoord = useMemo(
    () => ({ latitude: state.pin.latitude, longitude: state.pin.longitude }),
    [state.pin.latitude, state.pin.longitude],
  );
  const teardropCoord = useMemo(
    () => ({ latitude: state.teardrop.latitude, longitude: state.teardrop.longitude }),
    [state.teardrop.latitude, state.teardrop.longitude],
  );

  return (
    <View style={styles.wrap} testID="ec-map">
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={ecLightMapStyle}
        initialRegion={state.region}
        scrollEnabled={false}
        zoomEnabled={false}
        rotateEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
        showsCompass={false}
        zoomControlEnabled={false}
        showsMyLocationButton={false}
        showsUserLocation={false}
        loadingEnabled={false}
        testID="ec-map-view">
        <Circle
          center={fenceCenter}
          radius={state.fence.radius}
          strokeColor={ecColors.mapFence}
          strokeWidth={3}
          fillColor={ecColors.mapFenceFill}
        />
        {state.dots.map(dot => (
          <Marker
            key={dot.id}
            coordinate={{ latitude: dot.latitude, longitude: dot.longitude }}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}>
            <DiamondMarker color={ecColors.mapDiamond} size={18} />
          </Marker>
        ))}
        <Marker
          coordinate={pinCoord}
          anchor={{ x: 0.5, y: 1 }}
          tracksViewChanges={false}
          testID="ec-map-pin">
          <TeardropPin color={ecColors.mapPin} size={20} />
        </Marker>
        <Marker
          coordinate={teardropCoord}
          anchor={{ x: 0.5, y: 1 }}
          tracksViewChanges={false}
          testID="ec-map-teardrop">
          <TeardropPin color={ecColors.mapPin} size={18} />
        </Marker>
      </MapView>

      <View style={styles.updatedBox} pointerEvents="none">
        <Text style={styles.updatedLabel} numberOfLines={1}>
          {state.lastUpdatedLabel}
        </Text>
        <Text style={styles.updatedValue} numberOfLines={1}>
          {state.lastUpdatedValue}
        </Text>
      </View>

      <View style={styles.fenceChip} pointerEvents="none">
        <View style={styles.fenceChipIcon}>
          <ShieldCheckGlyph color={ecColors.mapChipInk} size={14} />
        </View>
        <Text style={styles.fenceChipText} numberOfLines={1}>
          {state.fenceLabel}
        </Text>
      </View>
    </View>
  );
}

export const GeofenceMap = memo(GeofenceMapImpl);
export default GeofenceMap;
