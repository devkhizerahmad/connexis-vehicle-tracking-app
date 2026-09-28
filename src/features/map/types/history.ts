// history.ts — History (route playback) screen types (S1–S9).
// Wire-compatible with history.mock.json; the shapes mirror the map feature so
// the mini-map can reuse RoutePoint/MapSegment from types/map.ts.

/** One route vertex as [lat, lng] (same wire format as the live map). */
export type HistoryRoutePoint = [number, number];

/** Inclusive index slice into a route polyline. */
export interface HistorySegment {
  startIndex: number;
  endIndex: number;
}

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

/** S9 playback header strip. */
export interface HistoryPlayback {
  speed: string;
  state: 'Moving' | 'Idle' | 'Stop';
  stateLabel: string;
  stamp: string;
  durationMinutes: number;
  initialProgress: number;
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
