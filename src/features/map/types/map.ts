// map.ts — Map feature types
// RESERVED MapLocation kept (pending History/Reports swap); LiveMap types added
// for the LiveMap screen (S1–S6 build).
//
// B9: the route geometry and the vehicle identity now come from
// `@shared/types/domain` instead of being re-declared per feature.
import type {
  RoutePoint,
  Segment,
  VehicleStatus,
  VehicleStatusReadout,
} from '@shared/types/domain';

export type { RoutePoint, VehicleOption } from '@shared/types/domain';

export interface MapLocation {
  lat: number;
  lng: number;
  address: string;
}

/** A vehicle plotted on the live map: card content + route + car marker. */
export interface LiveMapVehicle extends VehicleStatusReadout {
  status: VehicleStatus;
  statusLabel: string;
  speed: string;
  update: string;
  locationText: string;
  /** Full route polyline (main green). */
  route: RoutePoint[];
  /** Car marker: position + compass heading in degrees (0 = north). */
  car: { coordinate: RoutePoint; heading: number };
}

/** Green route pin marker. */
export interface MapPin {
  kind: 'pin';
  id: string;
  coordinate: RoutePoint;
}

/** Small green dot marker. */
export interface MapDot {
  kind: 'dot';
  id: string;
  coordinate: RoutePoint;
}

export type MapMarker = MapPin | MapDot;

/** Inclusive index range into the vehicle route polyline. */
export type MapSegment = Segment;

/** Everything the LiveMap screen needs for one vehicle selection. */
export interface LiveMapData {
  vehicle: LiveMapVehicle;
  /** Red traffic overlay slice (inclusive indices). */
  trafficSegment: MapSegment;
  /** White dashed overlay slice (inclusive indices). */
  dashedSegment: MapSegment;
  pins: MapPin[];
  dots: MapDot[];
}

/** Raw livemap.mock.json payload shape. */
export interface LivemapMockPayload {
  defaultVehicleId: string;
  trafficSegment: MapSegment;
  dashedSegment: MapSegment;
  pins: MapPin[];
  dots: MapDot[];
  vehicles: LiveMapVehicle[];
}
