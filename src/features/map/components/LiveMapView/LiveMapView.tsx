// LiveMapView.tsx — S5: Google Maps dark-night map with route overlays.
// Camera (PATCH L3): fitToCoordinates(route, padding 40) runs on onMapReady, then
// 600ms later animateCamera({ center: routeMid, pitch 30, zoom 13, heading 0 }) with
// duration 600. setCamera() was being overridden by the fit animation, which left the
// map flat top-down; animateCamera() applies the 3D tilt reliably.
// Pan/zoom enabled, no compass/toolbar/zoom controls.
import React, { forwardRef, useCallback, useEffect, useMemo, useRef } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Pin } from '@shared/components/icons';
import type { MapDot, MapPin, MapSegment, RoutePoint } from '@features/map/types/map';
import { darkMapStyle, mapColors } from './darkMapStyle';

export interface LiveMapViewProps {
  route: RoutePoint[];
  trafficSegment: MapSegment;
  dashedSegment: MapSegment;
  pins: MapPin[];
  dots: MapDot[];
  car: { coordinate: RoutePoint; heading: number };
}

const EDGE_PADDING = { top: 40, right: 40, bottom: 40, left: 40 };
/** S5/L3: pitch + zoom applied by the post-fit animateCamera move. */
const MAP_PITCH = 30;
const MAP_ZOOM = 13;
const CAMERA_SEQ_MS = 600;

const toLatLngs = (points: RoutePoint[]) =>
  points.map(([lat, lng]) => ({ latitude: lat, longitude: lng }));

/** Inclusive index slice into the route polyline. */
const sliceSegment = (points: RoutePoint[], seg: MapSegment) =>
  points.slice(seg.startIndex, seg.endIndex + 1);

const INITIAL_REGION = {
  latitude: 31.5,
  longitude: 74.374,
  latitudeDelta: 0.16,
  longitudeDelta: 0.12,
};

export const LiveMapView = forwardRef<MapView, LiveMapViewProps>(
  function LiveMapView(props, ref) {
    const innerRef = useRef<MapView | null>(null);
    const setRefs = (instance: MapView | null) => {
      innerRef.current = instance;
      if (typeof ref === 'function') {
        ref(instance);
      } else if (ref) {
        ref.current = instance;
      }
    };

    const latLngRoute = useMemo(() => toLatLngs(props.route), [props.route]);
    const isReadyRef = useRef(false);
    const cameraTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    /** L3: fit the route, then move the camera to a pitched view 600ms later. */
    const runCameraSequence = useCallback(() => {
      const map = innerRef.current;
      if (!map || props.route.length < 2) {
        return;
      }
      map.fitToCoordinates(toLatLngs(props.route), {
        edgePadding: EDGE_PADDING,
        animated: true,
      });
      if (cameraTimerRef.current) {
        clearTimeout(cameraTimerRef.current);
      }
      cameraTimerRef.current = setTimeout(() => {
        const mid = props.route[Math.floor(props.route.length / 2)];
        innerRef.current?.animateCamera(
          {
            center: { latitude: mid[0], longitude: mid[1] },
            pitch: MAP_PITCH,
            zoom: MAP_ZOOM,
            heading: 0,
          },
          { duration: CAMERA_SEQ_MS },
        );
      }, CAMERA_SEQ_MS);
    }, [props.route]);

    // L3: first load — run once the native map exists (a pre-ready fit is a no-op
    // on Android), instead of relying on the mount effect.
    const handleMapReady = useCallback(() => {
      isReadyRef.current = true;
      runCameraSequence();
    }, [runCameraSequence]);

    // L3: vehicle switch — re-fit + re-tilt only when the map is already ready.
    // Runs on route-identity change only, so idle re-renders never re-trigger (G1/G2).
    useEffect(() => {
      if (!isReadyRef.current) {
        return undefined;
      }
      runCameraSequence();
      return undefined;
    }, [runCameraSequence]);

    // Cancel a pending tilt if the view unmounts mid-sequence.
    useEffect(
      () => () => {
        if (cameraTimerRef.current) {
          clearTimeout(cameraTimerRef.current);
        }
      },
      [],
    );

    const pinMarkers = useMemo(
      () =>
        props.pins.map(pin => (
          <Marker
            key={pin.id}
            coordinate={{
              latitude: pin.coordinate[0],
              longitude: pin.coordinate[1],
            }}
            anchor={{ x: 0.5, y: 1 }}
            tracksViewChanges={false}>
            <Pin color={mapColors.routeGreen} size={16} />
          </Marker>
        )),
      [props.pins],
    );

    const dotMarkers = useMemo(
      () =>
        props.dots.map(dot => (
          <Marker
            key={dot.id}
            coordinate={{
              latitude: dot.coordinate[0],
              longitude: dot.coordinate[1],
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}>
            <View style={styles.dot} />
          </Marker>
        )),
      [props.dots],
    );

    const trafficCoords = useMemo(
      () => toLatLngs(sliceSegment(props.route, props.trafficSegment)),
      [props.route, props.trafficSegment],
    );
    const dashedCoords = useMemo(
      () => toLatLngs(sliceSegment(props.route, props.dashedSegment)),
      [props.route, props.dashedSegment],
    );

    return (
      <MapView
        ref={setRefs}
        onMapReady={handleMapReady}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        customMapStyle={darkMapStyle}
        initialRegion={INITIAL_REGION}
        toolbarEnabled={false}
        showsCompass={false}
        zoomControlEnabled={false}
        showsMyLocationButton={false}
        loadingEnabled={false}
        rotateEnabled
        pitchEnabled
        scrollEnabled
        zoomEnabled>
        <Polyline coordinates={latLngRoute} strokeWidth={4} strokeColor={mapColors.routeGreen} />
        <Polyline coordinates={trafficCoords} strokeWidth={5} strokeColor={mapColors.trafficRed} />
        <Polyline
          coordinates={dashedCoords}
          strokeWidth={3}
          strokeColor={mapColors.dashWhite}
          lineDashPattern={[8, 6]}
        />
        {pinMarkers}
        {dotMarkers}
        {/* car marker: flat, rotated by heading (0 = north) */}
        <Marker
          coordinate={{
            latitude: props.car.coordinate[0],
            longitude: props.car.coordinate[1],
          }}
          rotation={props.car.heading}
          flat
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={false}>
          <Image source={require('../../../../assets/img_car_sedan.png')} style={styles.car} />
        </Marker>
      </MapView>
    );
  },
);

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: mapColors.routeGreen,
  },
  car: {
    width: 34,
    height: 34,
  },
});

export default LiveMapView;