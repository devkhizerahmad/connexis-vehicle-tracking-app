// fitRegion.ts — P5b: fit the geofence circle + every marker into the camera.
//
// The reference frames the fence so the ring sits INSIDE the map with clear air
// on all four sides, rather than being cropped by the viewport edge. The old
// static `state.region` cropped the ring at the top and right.
//
// This is a rendering concern only: no marker coordinate, radius or ordering is
// touched. It measures the mock's fence radius + marker latitudes/longitudes,
// turns that into a bounding box in METRES, and returns the smallest region
// (centred on that box) whose viewport satisfies both the height and the width
// budget after padding, preserving the real viewport aspect ratio.
import type { EngineMapState } from '@features/engineControl/types/engineControl';

/** Metres per degree of latitude (constant; Mercator's y is latitude-linear). */
const M_PER_DEG_LAT = 111320;

const toRad = (deg: number): number => (deg * Math.PI) / 180;

export function fitFenceRegion(
  state: EngineMapState,
  viewW: number,
  viewH: number,
  padFactor: number,
): EngineMapState['region'] {
  const lat = state.fence.latitude;
  const lon = state.fence.longitude;
  // Metres per degree of longitude at this latitude (shrinks toward the poles).
  const mPerDegLon = M_PER_DEG_LAT * Math.cos(toRad(lat));

  // Start from the fence circle's own extent, then widen to contain every pin.
  const fenceLatDeg = state.fence.radius / M_PER_DEG_LAT;
  const fenceLonDeg = state.fence.radius / mPerDegLon;
  let minLat = lat - fenceLatDeg;
  let maxLat = lat + fenceLatDeg;
  let minLon = lon - fenceLonDeg;
  let maxLon = lon + fenceLonDeg;

  const include = (pLat: number, pLon: number) => {
    minLat = Math.min(minLat, pLat);
    maxLat = Math.max(maxLat, pLat);
    minLon = Math.min(minLon, pLon);
    maxLon = Math.max(maxLon, pLon);
  };
  include(state.pin.latitude, state.pin.longitude);
  include(state.teardrop.latitude, state.teardrop.longitude);
  state.dots.forEach(dot => include(dot.latitude, dot.longitude));

  const centreLat = (minLat + maxLat) / 2;
  const centreLon = (minLon + maxLon) / 2;
  // Ground extent the content needs, in metres, plus the padding allowance.
  const needM = Math.max(maxLat - minLat, (maxLon - minLon) * (mPerDegLon / M_PER_DEG_LAT)) * M_PER_DEG_LAT * padFactor;

  // Non-positive viewport (pre-layout / hidden tab) falls back to the mock's own
  // region rather than producing a zero-delta camera the SDK would reject.
  if (!(viewW > 0) || !(viewH > 0) || !(needM > 0)) {
    return state.region;
  }

  // The binding axis decides the zoom; the other is derived from the real
  // viewport aspect so the map is never letterboxed or over-zoomed.
  const mPerDp = Math.max(needM / viewH, needM / viewW);
  const viewportM = mPerDp * viewH;
  const viewportMW = mPerDp * viewW;

  return {
    latitude: centreLat,
    longitude: centreLon,
    latitudeDelta: viewportM / M_PER_DEG_LAT,
    longitudeDelta: viewportMW / (M_PER_DEG_LAT * Math.cos(toRad(centreLat))),
  };
}

export default fitFenceRegion;