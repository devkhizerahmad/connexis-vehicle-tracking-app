// ============================================================================
// TODO(KNOWN-ISSUE) — Engine Control map native-surface leak on remount.
// PRE-EXISTING. NOT a JS leak and NOT introduced by the rn-swipe-button work.
//
// Measured on R9YR30BS1LJ (780x1688 @320dpi), via `adb shell dumpsys meminfo`:
//   5x Engine Control remounts -> +46 MB PSS, and it repeats
//   (batch 1: +60 MB, batch 2: +46 MB, batch 3: +46 MB)  ~= 9.2 MB per remount
//   CONTROL: 15x remounts of the Profile tab (NO map) -> -8.7 MB, i.e. flat.
// Native Heap sits at ~258 MB, consistent with native map-surface / bitmap
// accumulation from react-native-maps teardown rather than a JS retention bug.
//
// DO NOT patch this speculatively. The full diagnostic plan (including the
// leading mitigation hypothesis and the react-native-screens / New-Arch angle)
// lives in KNOWN_ISSUES.md at the repo root. Production risk: OOM after
// prolonged tab-thrashing. Needs its own dedicated session.
// ============================================================================
// GeofenceMap (S4) — read-only Google map with the geofence circle and the two
// corner overlays ("Last Updated" box + "Current Fence" chip). All gestures are
// disabled: the reference is a static snapshot, and disabling them keeps the
// parent ScrollView's vertical scroll intact.
//
// PHASE-1 DESIGN LANGUAGE (P5):
//   (a) the washed-out custom light map style is GONE — the provider now paints
//       the DEFAULT colourful Google style, which is what the reference shows;
//   (b) the camera is FITTED to the fence + every marker (see fitRegion.ts) so
//       the ring sits inside the viewport with air on all four sides instead of
//       being cropped at the top/right edge as the old static region did;
//   (c) markers are simplified to SMALL RED PINS — the two blue diamonds are
//       gone and the big red direction-arrow teardrops shrank from 18/20 to 12;
//   (d) NOT done, deliberately: the Google logo is mandatory attribution and
//       react-native-maps exposes no size/opacity prop for it. See styles.ts.
import React, { memo, useMemo } from 'react';
import { Text, useWindowDimensions, View } from 'react-native';
import MapView, { Circle, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { TeardropPin } from '@shared/components/icons';
import { ecColors, ecSizes } from '@shared/theme';
import type { EngineMapState } from '@features/engineControl/types/engineControl';
import { fitFenceRegion } from './fitRegion';
import { styles } from './styles';

export interface GeofenceMapProps {
  state: EngineMapState;
}

function GeofenceMapImpl({ state }: GeofenceMapProps) {
  const { width } = useWindowDimensions();
  const fenceCenter = useMemo(
    () => ({ latitude: state.fence.latitude, longitude: state.fence.longitude }),
    [state.fence.latitude, state.fence.longitude],
  );

  /**
   * P5b: derived from the mock's own fence radius + pin coordinates and the
   * REAL viewport width (the map is edge-to-edge, so the container width IS the
   * window width). Recomputed only when one of those inputs changes.
   */
  const region = useMemo(
    () => fitFenceRegion(state, width, ecSizes.mapH, ecSizes.mapFitPadFactor),
    [state, width],
  );

  return (
    <View style={styles.wrap} testID="ec-map">
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={region}
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
        // P5a (cont.): with no `customMapStyle` the provider paints Google's own
        // DEFAULT style — but "default" means FOLLOW_SYSTEM, and this device is
        // in night mode, so it resolved to Google's DARK style and the map came
        // back dark navy. `userInterfaceStyle="light"` is a native
        // MapOptions.mapColorScheme(MapColorScheme.LIGHT) toggle, not a style
        // array: it still renders Google's DEFAULT (colourful) style, just pinned
        // to its light palette. react-native-mmaps 1.29.8 has no `colorScheme`
        // prop; this is the supported equivalent, and it is an initialProp so it
        // must be present on the first render (it is).
        userInterfaceStyle="light"
        testID="ec-map-view">
        <Circle
          center={fenceCenter}
          radius={state.fence.radius}
          strokeColor={ecColors.mapFence}
          strokeWidth={ecSizes.mapFenceStroke}
          fillColor={ecColors.mapFenceFill}
        />
        {state.dots.map(dot => (
          <Marker
            key={dot.id}
            coordinate={{ latitude: dot.latitude, longitude: dot.longitude }}
            anchor={{ x: 0.5, y: 1 }}
            tracksViewChanges={false}>
            <TeardropPin color={ecColors.mapPin} size={ecSizes.mapPinSize} />
          </Marker>
        ))}
        <Marker
          coordinate={{ latitude: state.pin.latitude, longitude: state.pin.longitude }}
          anchor={{ x: 0.5, y: 1 }}
          tracksViewChanges={false}
          testID="ec-map-pin">
          <TeardropPin color={ecColors.mapPin} size={ecSizes.mapPinSize} />
        </Marker>
        <Marker
          coordinate={{ latitude: state.teardrop.latitude, longitude: state.teardrop.longitude }}
          anchor={{ x: 0.5, y: 1 }}
          tracksViewChanges={false}
          testID="ec-map-teardrop">
          <TeardropPin color={ecColors.mapPin} size={ecSizes.mapPinSize} />
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
        <Text style={styles.fenceChipText} numberOfLines={1}>
          {state.fenceLabel}
        </Text>
      </View>
    </View>
  );
}

export const GeofenceMap = memo(GeofenceMapImpl);
export default GeofenceMap;