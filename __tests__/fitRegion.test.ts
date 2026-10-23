// fitRegion.test.ts — B18: the geofence camera maths.
//
// 63 LOC of pure geometry with no tests: metres-per-degree, the longitude
// shrink by cos(latitude), the pad factor and the degenerate-viewport fallback.
// A sign or unit slip here only shows up as a cropped ring on a device, so the
// contract is pinned: the camera CONTAINS the ring and every marker, both axes
// stay positive, and a pre-layout viewport falls back to the mock's own region.
import { fitFenceRegion } from '../src/features/engineControl/components/GeofenceMap/fitRegion';
import type { EngineMapState } from '../src/features/engineControl/types/engineControl';

const LAT = 31.52;
const LON = 74.35;
const RADIUS = 400;

const state: EngineMapState = {
  lastUpdatedLabel: 'Last Updated',
  lastUpdatedValue: '5:40PM',
  fenceLabel: 'Current Fence',
  region: { latitude: LAT, longitude: LON, latitudeDelta: 0.02, longitudeDelta: 0.02 },
  fence: { latitude: LAT, longitude: LON, radius: RADIUS },
  pin: { latitude: LAT, longitude: LON },
  teardrop: { latitude: LAT - 0.002, longitude: LON + 0.002 },
  dots: [
    { id: 'a', latitude: LAT + 0.001, longitude: LON - 0.001 },
    { id: 'b', latitude: LAT - 0.0015, longitude: LON + 0.0015 },
  ],
};

const M_PER_DEG_LAT = 111320;
const metresPerDegLon = (lat: number) => M_PER_DEG_LAT * Math.cos((lat * Math.PI) / 180);

describe('fitFenceRegion (B18)', () => {
  it('contains the whole fence ring on both axes', () => {
    const region = fitFenceRegion(state, 360, 200, 1.25);
    const halfLatM = (region.latitudeDelta / 2) * M_PER_DEG_LAT;
    const halfLonM = (region.longitudeDelta / 2) * metresPerDegLon(region.latitude);

    expect(halfLatM).toBeGreaterThanOrEqual(RADIUS);
    expect(halfLonM).toBeGreaterThanOrEqual(RADIUS);
  });

  it('contains every marker', () => {
    const region = fitFenceRegion(state, 360, 200, 1.25);
    const latPad = region.latitudeDelta / 2;
    const lonPad = region.longitudeDelta / 2;
    const markers = [state.pin, state.teardrop, ...state.dots];

    for (const marker of markers) {
      expect(Math.abs(marker.latitude - region.latitude)).toBeLessThanOrEqual(latPad);
      expect(Math.abs(marker.longitude - region.longitude)).toBeLessThanOrEqual(lonPad);
    }
  });

  it('returns a positive, finite camera', () => {
    const region = fitFenceRegion(state, 360, 200, 1.25);

    expect(Number.isFinite(region.latitude)).toBe(true);
    expect(Number.isFinite(region.longitude)).toBe(true);
    expect(region.latitudeDelta).toBeGreaterThan(0);
    expect(region.longitudeDelta).toBeGreaterThan(0);
  });

  it('applies the pad factor, so the ring is not flush with the edge', () => {
    const tight = fitFenceRegion(state, 360, 200, 1);
    const padded = fitFenceRegion(state, 360, 200, 1.5);

    expect(padded.latitudeDelta).toBeGreaterThan(tight.latitudeDelta);
    expect(padded.longitudeDelta).toBeGreaterThan(tight.longitudeDelta);
  });

  it('keeps the viewport aspect ratio (no letterboxing)', () => {
    const region = fitFenceRegion(state, 400, 200, 1.25);
    // The returned region is 2:1 in metres, matching the 2:1 viewport.
    const heightM = region.latitudeDelta * M_PER_DEG_LAT;
    const widthM = region.longitudeDelta * metresPerDegLon(region.latitude);

    expect(widthM / heightM).toBeCloseTo(2, 6);
  });

  it('compensates the longitude shrink for latitude', () => {
    // The same physical size needs MORE longitude degrees further from the
    // equator (a degree of longitude is shorter there).
    const nearEquator = fitFenceRegion(
      { ...state, fence: { latitude: 1, longitude: LON, radius: RADIUS } },
      360,
      360,
      1.25,
    );
    const highLatitude = fitFenceRegion(
      { ...state, fence: { latitude: 60, longitude: LON, radius: RADIUS } },
      360,
      360,
      1.25,
    );

    expect(highLatitude.longitudeDelta).toBeGreaterThan(nearEquator.longitudeDelta);
  });

  it('falls back to the mock region before layout (zero or negative viewport)', () => {
    expect(fitFenceRegion(state, 0, 200, 1.25)).toBe(state.region);
    expect(fitFenceRegion(state, 200, 0, 1.25)).toBe(state.region);
    expect(fitFenceRegion(state, -10, -10, 1.25)).toBe(state.region);
  });

  it('falls back when the fence has no extent', () => {
    const empty = {
      ...state,
      fence: { ...state.fence, radius: 0 },
      teardrop: { latitude: LAT, longitude: LON },
      dots: [],
    };

    expect(fitFenceRegion(empty, 360, 200, 1.25)).toBe(state.region);
  });
});
