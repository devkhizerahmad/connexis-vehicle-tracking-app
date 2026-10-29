// HistoryMiniMap.tsx — S6: light mini-map with a dashed red "already driven"
// leg, a solid green "remaining" leg, a junction pin, and the red alert banner.
import React, { forwardRef, memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { CarGlyph, NavArrow, Pin } from '@shared/components/icons';
import { colors, historyColors, historySizes } from '@shared/theme';
import type {
  HistoryMapGeometry,
  HistoryRoutePoint,
} from '@features/map/types/history';
import { pointAtProgress, splitRouteAtProgress } from '@features/map/utils/routePlayback';
import { historyMapStyle } from './historyMapStyle';

export interface HistoryMiniMapProps {
  geometry: HistoryMapGeometry;
  /** Red banner copy under the map (S6). */
  alertText: string;
  /**
   * Playhead 0..1. The car marker and the driven/remaining legs derive from it,
   * so the map is always showing the same moment as the S7 transport.
   */
  progress?: number;
}

const toLatLngs = (points: HistoryRoutePoint[]) =>
  points.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));

const EDGE_PADDING = { top: 28, right: 28, bottom: 28, left: 28 };

const HistoryMiniMapBase = forwardRef<MapView, HistoryMiniMapProps>(
  function HistoryMiniMap({ geometry, alertText, progress = 0 }, ref) {
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

    // Detach native map ref on unmount
    useEffect(() => {
      return () => {
        innerRef.current = null;
      };
    }, []);

    /** PATCH T-HISTORY: both legs are cut at the playhead, not at fixed indices. */
    const legs = useMemo(
      () => splitRouteAtProgress(geometry.route, progress),
      [geometry.route, progress],
    );
    const traveledCoords = useMemo(() => toLatLngs(legs.traveled), [legs.traveled]);
    const remainingCoords = useMemo(() => toLatLngs(legs.remaining), [legs.remaining]);
    const car = useMemo(
      () => pointAtProgress(geometry.route, progress),
      [geometry.route, progress],
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
          // PATCH T-HISTORY (zoom): the mini-map now behaves like the LIVE map —
          // pinch to zoom, drag to pan, two-finger rotate/tilt. The initial
          // `fitToCoordinates` still frames the whole trip, but the user can
          // zoom in on a stop and the camera stays put while the car moves
          // (progress only re-renders the marker/legs, never the camera).
          scrollEnabled
          zoomEnabled
          pitchEnabled
          rotateEnabled>
          <Polyline
            coordinates={traveledCoords}
            strokeWidth={4}
            strokeColor={historyColors.mapRouteRed}
            lineDashPattern={[10, 6]}
          />
          {/* PATCH T-HISTORY: the "remaining" leg is ALSO dashed in the reference */}
          <Polyline
            coordinates={remainingCoords}
            strokeWidth={4}
            strokeColor={historyColors.mapRouteGreen}
            lineDashPattern={[10, 6]}
          />
          {car ? (
            <Marker
              coordinate={{
                latitude: car.coordinate[0],
                longitude: car.coordinate[1],
              }}
              anchor={{ x: 0.5, y: 0.5 }}
              tracksViewChanges={false}
              testID="history-map-car">
              <View style={styles.carMarker}>
                <CarGlyph color={historyColors.playIconInk} size={16} />
              </View>
            </Marker>
          ) : null}
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

/**
 * Memoised: the History screen re-renders its FlatList header on every
 * playhead tick, and a MapView re-render is the most expensive thing on that
 * screen. The map only needs to redraw when the (quantised) playhead moves.
 */
export const HistoryMiniMap = memo(HistoryMiniMapBase);

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
  /** PATCH T-HISTORY: the moving playhead on the route (white disc, red car). */
  carMarker: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: historyColors.playIconInk,
  },
});

export default HistoryMiniMap;
