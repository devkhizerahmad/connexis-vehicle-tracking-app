// routePlayback.test.ts — the maths that keeps the S6 car marker and the S7
// clock in step.
//
// The playhead is one 0..1 fraction shared by three consumers (map marker,
// driven/remaining legs, row highlight). A sign slip, a degree/radian mix-up or
// an off-by-one in the polyline walk would only show up as a car floating off
// the route on a device, so the contract is pinned here.
import {
  activeStopId,
  bearingDegrees,
  clamp01,
  haversineMeters,
  playbackReadout,
  playbackStateAt,
  pointAtProgress,
  routeLengthMeters,
  splitRouteAtProgress,
} from '../src/features/map/utils/routePlayback';
import type {
  HistoryPlayback,
  HistoryRoutePoint,
  HistoryStop,
  HistoryTimelineEntry,
} from '../src/features/map/types/history';

/** A straight north-south leg of ~1.11 km per 0.01 degree of latitude. */
const ROUTE: HistoryRoutePoint[] = [
  [31.45, 74.35],
  [31.46, 74.35],
  [31.47, 74.35],
  [31.48, 74.35],
];

const TIMELINE: HistoryTimelineEntry[] = [
  { at: 0, speed: '0 km/h', state: 'Stop', stateLabel: 'Parked' },
  { at: 0.34, speed: '35 km/h', state: 'Moving', stateLabel: 'Moving' },
  { at: 0.61, speed: '0 km/h', state: 'Idle', stateLabel: 'Idle' },
  { at: 1, speed: '0 km/h', state: 'Stop', stateLabel: 'Trip end' },
];

const STOPS: HistoryStop[] = [
  { id: 'end', time: '3:03 AM', kind: 'stop', address: 'Ring Road', duration: '1 min', distance: '', speed: '', atProgress: 1 },
  { id: 'idle', time: '3:01 AM', kind: 'idle', address: 'Johar Town', duration: '1 min', distance: '', speed: '', atProgress: 0.61 },
  { id: 'moving', time: '2:52 AM', kind: 'moving', address: 'Lda Avenue', duration: '6 min.', distance: '5.12 km', speed: '47 km/h', atProgress: 0.2 },
];

describe('clamp01', () => {
  it('clamps the ends and treats non-finite input as zero', () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(2)).toBe(1);
    expect(clamp01(0.42)).toBeCloseTo(0.42);
    expect(clamp01(Number.NaN)).toBe(0);
    expect(clamp01(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe('haversineMeters', () => {
  it('measures one degree of latitude as ~111 km', () => {
    const metres = haversineMeters([31.45, 74.35], [32.45, 74.35]);
    expect(metres / 1000).toBeCloseTo(111.19, 0);
  });

  it('is zero for the same point and symmetric both ways', () => {
    expect(haversineMeters(ROUTE[0], ROUTE[0])).toBe(0);
    const forward = haversineMeters(ROUTE[0], ROUTE[3]);
    const backward = haversineMeters(ROUTE[3], ROUTE[0]);
    expect(forward).toBeCloseTo(backward, 6);
  });
});

describe('routeLengthMeters', () => {
  it('sums every leg', () => {
    const legs =
      haversineMeters(ROUTE[0], ROUTE[1]) +
      haversineMeters(ROUTE[1], ROUTE[2]) +
      haversineMeters(ROUTE[2], ROUTE[3]);
    expect(routeLengthMeters(ROUTE)).toBeCloseTo(legs, 6);
  });

  it('is zero for a one-point route', () => {
    expect(routeLengthMeters([ROUTE[0]])).toBe(0);
  });
});

describe('bearingDegrees', () => {
  it('reads the four cardinal directions', () => {
    expect(bearingDegrees([31.45, 74.35], [31.46, 74.35])).toBeCloseTo(0, 3); // north
    expect(bearingDegrees([31.45, 74.35], [31.45, 74.36])).toBeCloseTo(90, 0); // east
    expect(bearingDegrees([31.46, 74.35], [31.45, 74.35])).toBeCloseTo(180, 3); // south
    expect(bearingDegrees([31.45, 74.36], [31.45, 74.35])).toBeCloseTo(270, 0); // west
  });
});

describe('pointAtProgress', () => {
  it('returns null only for an empty route', () => {
    expect(pointAtProgress([], 0.5)).toBeNull();
  });

  it('parks on the single vertex of a one-point route', () => {
    const point = pointAtProgress([ROUTE[0]], 0.9);
    expect(point).not.toBeNull();
    expect(point?.coordinate).toEqual(ROUTE[0]);
  });

  it('starts at the first vertex and ends at the last', () => {
    expect(pointAtProgress(ROUTE, 0)?.coordinate).toEqual(ROUTE[0]);
    expect(pointAtProgress(ROUTE, 1)?.coordinate).toEqual(ROUTE[3]);
  });

  it('interpolates halfway along a straight leg', () => {
    const point = pointAtProgress([ROUTE[0], ROUTE[1]], 0.5);
    expect(point?.coordinate[0]).toBeCloseTo(31.455, 6);
    expect(point?.coordinate[1]).toBeCloseTo(74.35, 6);
    expect(point?.segmentIndex).toBe(0);
  });

  it('walks into the correct segment of a multi-leg route', () => {
    // Three equal legs: 0.5 of the length lands in the second leg.
    const point = pointAtProgress(ROUTE, 0.5);
    expect(point?.segmentIndex).toBe(1);
    expect(point?.coordinate[0]).toBeCloseTo(31.465, 6);
  });

  it('clamps out-of-range progress instead of extrapolating', () => {
    expect(pointAtProgress(ROUTE, -3)?.coordinate).toEqual(ROUTE[0]);
    expect(pointAtProgress(ROUTE, 9)?.coordinate).toEqual(ROUTE[3]);
  });

  it('falls back to the first vertex when every leg has zero length', () => {
    const point = pointAtProgress([ROUTE[0], ROUTE[0]], 0.7);
    expect(point?.coordinate).toEqual(ROUTE[0]);
  });
});

describe('splitRouteAtProgress', () => {
  it('keeps the whole route on the remaining leg at progress 0', () => {
    const { traveled, remaining } = splitRouteAtProgress(ROUTE, 0);
    expect(traveled).toEqual([ROUTE[0]]);
    expect(remaining).toEqual(ROUTE);
  });

  it('moves the whole route to the driven leg at progress 1', () => {
    const { traveled, remaining } = splitRouteAtProgress(ROUTE, 1);
    expect(traveled).toEqual(ROUTE);
    expect(remaining).toEqual([ROUTE[3]]);
  });

  it('meets exactly at the cut point (no gap, no duplicate vertex)', () => {
    const { traveled, remaining } = splitRouteAtProgress(ROUTE, 0.42);
    const cut = traveled[traveled.length - 1];
    expect(remaining[0]).toEqual(cut);
    expect(traveled[traveled.length - 2]).toEqual(ROUTE[1]);
    // The cut point is shared by BOTH legs (4 vertices + 2 copies of the cut)
    expect(traveled.length + remaining.length).toBe(ROUTE.length + 2);
  });

  it('returns two empty legs for an empty route', () => {
    expect(splitRouteAtProgress([], 0.5)).toEqual({ traveled: [], remaining: [] });
  });
});

describe('activeStopId', () => {
  it('is null before the first event', () => {
    expect(activeStopId(STOPS, 0)).toBeNull();
  });

  it('advances with the playhead and ignores stops without a position', () => {
    const withNoPosition: HistoryStop[] = [
      ...STOPS,
      { id: 'legacy', time: '1:00 AM', kind: 'stop', address: 'x', duration: '', distance: '', speed: '' },
    ];
    expect(activeStopId(withNoPosition, 0.2)).toBe('moving');
    expect(activeStopId(withNoPosition, 0.61)).toBe('idle');
    expect(activeStopId(withNoPosition, 1)).toBe('end');
  });

  it('is null for an empty list', () => {
    expect(activeStopId([], 0.5)).toBeNull();
  });
});

describe('playbackStateAt / playbackReadout', () => {
  const fallback = { speed: '35 km/h', state: 'Moving' as const, stateLabel: 'Moving' };

  it('uses the payload label when there is no timeline', () => {
    expect(playbackStateAt(undefined, 0.5, fallback)).toEqual(fallback);
    expect(playbackStateAt([], 0.5, fallback)).toEqual(fallback);
  });

  it('holds the current leg until the next entry', () => {
    expect(playbackStateAt(TIMELINE, 0.2, fallback).speed).toBe('0 km/h');
    expect(playbackStateAt(TIMELINE, 0.34, fallback).speed).toBe('35 km/h');
    expect(playbackStateAt(TIMELINE, 0.6, fallback).speed).toBe('35 km/h');
    expect(playbackStateAt(TIMELINE, 0.61, fallback).state).toBe('Idle');
    expect(playbackStateAt(TIMELINE, 1, fallback).stateLabel).toBe('Trip end');
  });

  it('playbackReadout keeps the rest state identical to the mock at 0.34', () => {
    const playback: HistoryPlayback = {
      speed: '35 km/h',
      state: 'Moving',
      stateLabel: 'Moving',
      stamp: '28-April-2024 (2:45 AM)',
      durationMinutes: 18,
      initialProgress: 0.34,
      timeline: TIMELINE,
    };
    expect(playbackReadout(playback, 0.34)).toEqual({
      speed: '35 km/h',
      state: 'Moving',
      stateLabel: 'Moving',
    });
  });
});
