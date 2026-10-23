// routePlayback.ts — pure maths that keeps the S6 map in step with the S7
// transport. No React, no native modules: everything here is unit-tested in
// __tests__/routePlayback.test.ts.
//
// The playhead is a single 0..1 fraction of the clip. Three consumers derive
// from it:
//   * the mini-map car marker (position + heading along the polyline),
//   * the driven/remaining legs (the polyline is split at that exact point),
//   * the S9 row highlight (which stop the playhead has reached).
import type {
  HistoryPlayback,
  HistoryPlaybackState,
  HistoryRoutePoint,
  HistoryStop,
  HistoryTimelineEntry,
} from '../types/history';

const EARTH_RADIUS_M = 6_371_000;
const DEG = Math.PI / 180;

/** Clamp to 0..1 and turn NaN/Infinity into 0. */
export const clamp01 = (value: number): number =>
  Number.isFinite(value) ? Math.min(1, Math.max(0, value)) : 0;

/** Great-circle distance between two [lat, lng] points, in metres. */
export function haversineMeters(a: HistoryRoutePoint, b: HistoryRoutePoint): number {
  const dLat = (b[0] - a[0]) * DEG;
  const dLng = (b[1] - a[1]) * DEG;
  const lat1 = a[0] * DEG;
  const lat2 = b[0] * DEG;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.asin(Math.min(1, Math.sqrt(h)));
}

/** Total polyline length in metres. */
export function routeLengthMeters(route: HistoryRoutePoint[]): number {
  let total = 0;
  for (let i = 1; i < route.length; i += 1) {
    total += haversineMeters(route[i - 1], route[i]);
  }
  return total;
}

/**
 * Compass bearing from `a` to `b`: 0 = north, 90 = east, clockwise.
 * Matches the rotation the map marker expects.
 */
export function bearingDegrees(a: HistoryRoutePoint, b: HistoryRoutePoint): number {
  const lat1 = a[0] * DEG;
  const lat2 = b[0] * DEG;
  const dLng = (b[1] - a[1]) * DEG;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return (Math.atan2(y, x) / DEG + 360) % 360;
}

/** A point on the route plus the heading the vehicle has at that point. */
export interface RoutePointAtProgress {
  coordinate: HistoryRoutePoint;
  /** 0..360, 0 = north. */
  bearingDeg: number;
  /** Index of the vertex the point sits AFTER (0-based). */
  segmentIndex: number;
}

/**
 * Interpolate the position at `progress` (0..1) along the polyline.
 * Returns null only for an empty route; a one-point route returns that point.
 */
export function pointAtProgress(
  route: HistoryRoutePoint[],
  progress: number,
): RoutePointAtProgress | null {
  if (route.length === 0) {
    return null;
  }
  if (route.length === 1) {
    return { coordinate: route[0], bearingDeg: 0, segmentIndex: 0 };
  }

  const total = routeLengthMeters(route);
  if (total <= 0) {
    return { coordinate: route[0], bearingDeg: 0, segmentIndex: 0 };
  }

  const target = clamp01(progress) * total;
  let walked = 0;
  for (let i = 1; i < route.length; i += 1) {
    const from = route[i - 1];
    const to = route[i];
    const segment = haversineMeters(from, to);
    // `>=` so progress === 1 lands on the final vertex instead of falling through.
    if (walked + segment >= target || i === route.length - 1) {
      const t = segment > 0 ? clamp01((target - walked) / segment) : 0;
      return {
        coordinate: [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t],
        bearingDeg: bearingDegrees(from, to),
        segmentIndex: i - 1,
      };
    }
    walked += segment;
  }

  const last = route[route.length - 1];
  return { coordinate: last, bearingDeg: 0, segmentIndex: route.length - 2 };
}

/** True when two coordinates are the same vertex (avoids duplicate polyline points). */
const samePoint = (a: HistoryRoutePoint, b: HistoryRoutePoint): boolean =>
  Math.abs(a[0] - b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9;

/**
 * Split the polyline at the playhead into the driven leg and the remaining
 * leg. Both legs share the interpolated cut point so the two colours meet
 * exactly with no gap.
 */
export function splitRouteAtProgress(
  route: HistoryRoutePoint[],
  progress: number,
): { traveled: HistoryRoutePoint[]; remaining: HistoryRoutePoint[] } {
  const point = pointAtProgress(route, progress);
  if (!point) {
    return { traveled: [], remaining: [] };
  }

  const traveled = route.slice(0, point.segmentIndex + 1);
  if (!samePoint(traveled[traveled.length - 1], point.coordinate)) {
    traveled.push(point.coordinate);
  }

  const remaining = route.slice(point.segmentIndex + 1);
  if (remaining.length === 0) {
    remaining.push(point.coordinate);
  } else if (!samePoint(remaining[0], point.coordinate)) {
    remaining.unshift(point.coordinate);
  }

  return { traveled, remaining };
}

/**
 * The stop the playhead has reached: the LATEST event whose `atProgress` is at
 * or before the playhead. Null before the first event.
 */
export function activeStopId(stops: HistoryStop[], progress: number): string | null {
  const at = clamp01(progress);
  let best: HistoryStop | null = null;
  for (const stop of stops) {
    if (stop.atProgress === undefined) {
      continue;
    }
    if (stop.atProgress <= at + 1e-9 && (!best || stop.atProgress >= (best.atProgress ?? 0))) {
      best = stop;
    }
  }
  return best ? best.id : null;
}

export interface PlaybackReadout {
  speed: string;
  state: HistoryPlaybackState;
  stateLabel: string;
}

/**
 * Speed/state for the current playhead. Falls back to the payload's single
 * label when the payload carries no timeline.
 */
export function playbackStateAt(
  timeline: HistoryTimelineEntry[] | undefined,
  progress: number,
  fallback: PlaybackReadout,
): PlaybackReadout {
  if (!timeline || timeline.length === 0) {
    return fallback;
  }
  const at = clamp01(progress);
  let current: HistoryTimelineEntry | undefined;
  for (const entry of timeline) {
    if (entry.at <= at + 1e-9 && (!current || entry.at >= current.at)) {
      current = entry;
    }
  }
  if (!current) {
    current = timeline[0];
  }
  return { speed: current.speed, state: current.state, stateLabel: current.stateLabel };
}

/** Convenience: the readout for a payload + playhead pair. */
export function playbackReadout(
  playback: HistoryPlayback,
  progress: number,
): PlaybackReadout {
  return playbackStateAt(playback.timeline, progress, {
    speed: playback.speed,
    state: playback.state,
    stateLabel: playback.stateLabel,
  });
}
