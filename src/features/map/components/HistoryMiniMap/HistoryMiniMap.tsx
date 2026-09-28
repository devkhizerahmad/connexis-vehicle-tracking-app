// HistoryMiniMap.tsx — S6: light mini-map with a dashed red "already driven"
// leg, a solid green "remaining" leg, a junction pin, and the red alert banner.
import React, { forwardRef, useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { NavArrow, Pin } from '@shared/components/icons';
import { historyColors, historySizes } from '@shared/theme';
import type {
  HistoryMapGeometry,
  HistoryRoutePoint,
  HistorySegment,
} from '@features/map/types/history';
import { historyMapStyle } from './historyMapStyle';

export interface HistoryMiniMapProps {
  geometry: HistoryMapGeometry;
  /** Red banner copy under the map (S6). */
  alertText: string;
}

const toLatLngs = (points: HistoryRoutePoint[]) =>
  points.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));

const sliceSegment = (points: HistoryRoutePoint[], seg: HistorySegment) =>
  points.slice(seg.startIndex, seg.endIndex + 1);

const EDGE_PADDING = { top: 28, right: 28, bottom: 28, left: 28 };

export const HistoryMiniMap = forwardRef<MapView, HistoryMiniMapProps>(
  function HistoryMiniMap({ geometry, alertText }, ref) {
    const innerRef = useRef<MapView | null>(null);
    const setRefs = useCallback(
      (instance: MapView | null) => {
        innerRef.current = instance;
        if (typeof ref === 'function') {
          ref(instance);
        } else if (ref) {
          ref.current = instance;
        }
      },
      [ref],
    );

    const dashedCoords = useMemo(
      () => toLatLngs(sliceSegment(geometry.route, geometry.dashedSegment)),
      [geometry],
    );
    const solidCoords = useMemo(
      () => toLatLngs(sliceSegment(geometry.route, geometry.solidSegment)),
      [geometry],
    );

    /** Fit both legs as soon as the native map is ready. */
    const handleMapReady = useCallback(() => {
      innerRef.current?.fitToCoordinates(toLatLngs(geometry.route), {
        edgePadding: EDGE_PADDING,
        animated: false,
      });
    }, [geometry.route]);

    return (
      <View style={styles.wrap} testID="history-mini-map">
        <MapView
          ref={setRefs}
          onMapReady={handleMapReady}
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          customMapStyle={historyMapStyle}
          toolbarEnabled={false}
          showsCompass={false}
          zoomControlEnabled={false}
          showsMyLocationButton={false}
          loadingEnabled={false}
          scrollEnabled={false}
          zoomEnabled={false}
          pitchEnabled={false}
          rotateEnabled={false}>
          <Polyline
            coordinates={dashedCoords}
            strokeWidth={4}
            strokeColor={historyColors.mapRouteRed}
            lineDashPattern={[10, 6]}
          />
          {/* PATCH T-HISTORY: the "remaining" leg is ALSO dashed in the reference */}
          <Polyline
            coordinates={solidCoords}
            strokeWidth={4}
            strokeColor={historyColors.mapRouteGreen}
            lineDashPattern={[10, 6]}
          />
          <Marker
            coordinate={{
              latitude: geometry.junctionPinCoordinate[0],
              longitude: geometry.junctionPinCoordinate[1],
            }}
            anchor={{ x: 0.5, y: 1 }}
            tracksViewChanges={false}>
            <Pin color={historyColors.mapPinInk} size={16} />
          </Marker>
        </MapView>
        <View style={styles.alert} testID="history-alert">
          {/* PATCH T-HISTORY: the reference banner carries a navigation arrow, not ⚠ */}
          <NavArrow color={historyColors.alertInk} size={16} />
          <Text style={styles.alertText} numberOfLines={2}>
            {alertText}
          </Text>
        </View>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  wrap: {
    height: historySizes.miniMapH,
    overflow: 'hidden',
    backgroundColor: '#F2F1EC',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  alert: {
    position: 'absolute',
    // PATCH T-HISTORY: the reference banner is inset with rounded corners,
    // floating above the map's bottom edge (it used to be a full-bleed strip).
    left: historySizes.alertBannerInset,
    right: historySizes.alertBannerInset,
    bottom: historySizes.alertBannerInset,
    minHeight: historySizes.alertBannerH,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 4,
    backgroundColor: historyColors.alertBg,
  },
  alertText: {
    flex: 1,
    color: historyColors.alertInk,
    fontSize: 11,
    lineHeight: 14,
  },
});

export default HistoryMiniMap;
