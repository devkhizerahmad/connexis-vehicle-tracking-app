// map.ts — Map feature types
// RESERVED MapLocation kept (pending History/Reports swap); LiveMap types added
// for the LiveMap screen (S1–S6 build).
export interface MapLocation {
  lat: number;
  lng: number;
  address: string;
}

/** One route vertex as [lat, lng] (mock wire format). */
export type RoutePoint = [number, number];

/** A vehicle plotted on the live map: card content + route + car marker. */
export interface LiveMapVehicle {
  id: string;
  name: string;
  status: 'running' | 'idle' | 'stop' | 'noData';
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
export interface MapSegment {
  startIndex: number;
  endIndex: number;
}

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

/** Compact option row for the Select Vehicle dropdown. */
export interface VehicleOption {
  id: string;
  name: string;
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
