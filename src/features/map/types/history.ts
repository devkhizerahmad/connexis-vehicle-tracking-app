// history.ts — History (route playback) screen types (S1–S9).
// Wire-compatible with history.mock.json; the shapes mirror the map feature so
// the mini-map can reuse RoutePoint/MapSegment from types/map.ts.
//
// B9: the geometry itself is the shared domain now, so history and map cannot
// drift apart again.
import type { RoutePoint, Segment } from '@shared/types/domain';

/** One route vertex as [lat, lng] (same wire format as the live map). */
export type HistoryRoutePoint = RoutePoint;

/** Inclusive index slice into a route polyline. */
export type HistorySegment = Segment;

/** A selected calendar day, formatted `YYYY-MM-DD` (local, no timezone drift). */
export type IsoDate = string;

/** S4 selected range (the calendar's FROM / UNTIL pair). */
export interface HistoryDateRange {
  from: IsoDate;
  until: IsoDate;
}

/** The month the S4 calendar is currently displaying. */
export interface HistoryMonth {
  /** Full year, e.g. 2018. */
  year: number;
  /** Zero-based month index, e.g. 11 === December. */
  month: number;
}

/** One rendered cell of the S4 month grid (may be an out-of-month day). */
export interface HistoryCalendarDay {
  /** `YYYY-MM-DD`. */
  date: IsoDate;
  /** Day-of-month, 1..31. */
  day: number;
  /** True when the day belongs to a different month than the displayed one. */
  outside: boolean;
}

/** S3 vehicle identity for the chip row. */
export interface HistoryVehicle {
  id: string;
  name: string;
  plate: string;
}

/** S7 summary panel values. */
export interface HistorySummary {
  totalKm: string;
  totalKmUnit: string;
  runningLabel: string;
  runningValue: string;
  idleLabel: string;
  idleValue: string;
  runningRatio: number;
  idleRatio: number;
}

/** The three states the S7 pill can show (also the S9 row badge kinds). */
export type HistoryPlaybackState = 'Moving' | 'Idle' | 'Stop';

/**
 * One leg of the trip's speed/state profile. The entry holds until the next
 * entry's `at`, so a sparse list (8-10 entries) describes the whole clip.
 */
export interface HistoryTimelineEntry {
  /** 0..1 position on the clip. */
  at: number;
  /** Vehicle speed label for this leg, e.g. "47 km/h". */
  speed: string;
  state: HistoryPlaybackState;
  stateLabel: string;
}

/** S9 playback header strip. */
export interface HistoryPlayback {
  speed: string;
  state: HistoryPlaybackState;
  stateLabel: string;
  stamp: string;
  durationMinutes: number;
  initialProgress: number;
  /**
   * Optional speed/state profile. When present the S7 pill is DERIVED from the
   * playhead instead of showing one frozen label for the whole clip.
   */
  timeline?: HistoryTimelineEntry[];
}

/** S8 mini-map geometry: dashed red leg, solid green leg, junction pin. */
export interface HistoryMapGeometry {
  dashedSegment: HistorySegment;
  solidSegment: HistorySegment;
  junctionPinCoordinate: HistoryRoutePoint;
  carCoordinate: HistoryRoutePoint;
  route: HistoryRoutePoint[];
}

/** One S9 list row: timestamp + state glyph + address + metric chips. */
export interface HistoryStop {
  id: string;
  time: string;
  kind: 'moving' | 'idle' | 'stop';
  address: string;
  duration: string;
  distance: string;
  speed: string;
  /**
   * 0..1 position on the clip where this event happened. Drives the row
   * highlight while the playback runs; absent rows simply never highlight.
   */
  atProgress?: number;
  /** Where the event happened on the route (optional map anchor). */
  coordinate?: HistoryRoutePoint;
}

/** S5/S6 filter option lists plus the defaults that start selected. */
export interface HistoryFilters {
  hourOptions: string[];
  minuteOptions: string[];
  defaultHour: string;
  defaultMinute: string;
}

/** Full payload returned by historyService.getHistoryData(). */
export interface HistoryData {
  vehicle: HistoryVehicle;
  range: HistoryDateRange;
  month: HistoryMonth;
  filters: HistoryFilters;
  summary: HistorySummary;
  playback: HistoryPlayback;
  map: HistoryMapGeometry;
  alertText: string;
  stops: HistoryStop[];
}

/** Raw mock shape (mocks/history.mock.json) as stored on disk. */
export interface HistoryMockPayload {
  defaultVehicleId: string;
  defaultRange: HistoryDateRange;
  defaultMonth: HistoryMonth;
  defaultHour: string;
  defaultMinute: string;
  playback: HistoryPlayback;
  summary: HistorySummary;
  alert: { text: string };
  map: HistoryMapGeometry;
  hourOptions: string[];
  minuteOptions: string[];
  stops: HistoryStop[];
  vehicles: HistoryVehicle[];
}
