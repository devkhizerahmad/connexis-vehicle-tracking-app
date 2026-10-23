// domain.ts — the ONE vehicle domain model (B9).
//
// Every feature used to describe the same vehicle with a disjoint interface
// (`VehicleSummary`, `LiveMapVehicle`, `HistoryVehicle`, `EngineVehicle`,
// `ReportVehicleOption`, `VehicleOption`, `SelectFieldOption`,
// `VehicleStatusInfo`), the status union was declared three times, and the route
// geometry (`[lat, lng]` + an inclusive index segment) was duplicated between
// the map and history features. The mismatches were bridged with `as any` at the
// one place domain data meets presentational props.
//
// This module is that shared vocabulary. Feature types now extend it with
// `Pick<>` / `&` instead of restating it.

/** The four states a vehicle can be in, across live map, history and reports. */
export type VehicleStatus = 'running' | 'idle' | 'stop' | 'noData';

/** One route vertex as `[lat, lng]` (the mock wire format). */
export type RoutePoint = [number, number];

/** Inclusive index slice into a route polyline. */
export interface Segment {
  startIndex: number;
  endIndex: number;
}

/** Identity fields every vehicle-bearing payload carries. */
export interface Vehicle {
  id: string;
  name: string;
  /** Kia Sportage shares its plate with Suzuki Mehran in the mock data; id is unique. */
  plate?: string;
}

/** A vehicle plus its current status — live map, history and engine control. */
export interface VehicleStatusReadout extends Vehicle {
  status: VehicleStatus;
  /** Human label when the payload carries one distinct from `status`. */
  statusLabel?: string;
  /** Pre-formatted "last update" stamp, when the payload has one. */
  time?: string;
}

/** Compact `{ id, name }` row used by every Select Vehicle dropdown. */
export interface VehicleOption {
  id: string;
  name: string;
}

/** The three route-row tones: 1 green / 2 amber / 3 red. */
export type RouteRowTone = 'green' | 'amber' | 'red';

/** A stop on a vehicle's route, as both route lists render it. */
export interface RouteStop {
  /** Number-badge text: "1", "2", … */
  n: string;
  /** Title (Engine Control) or address (Details). */
  address: string;
  /** Pin-prefixed sub-line: location or time. */
  time: string;
  /** Status pill label. */
  status: string;
  /** Which tone paints the badge and the pill. */
  tone: RouteRowTone;
  duration: string;
}
