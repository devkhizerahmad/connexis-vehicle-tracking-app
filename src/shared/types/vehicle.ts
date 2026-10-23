// vehicle.ts — shared vehicle presentation models
//
// B9: the status union lives in `@shared/types/domain`; this file must not
// re-declare it (it used to widen the union to `| string`, which silently
// accepted any status).
import type { VehicleStatus } from '@shared/types/domain';

export interface VehiclePlateStatus {
  country?: string;
  state?: string;
  number?: string;
}

export interface VehicleStatusInfo {
  state?: VehicleStatus;
  time?: string;
}

export interface KpiItem {
  icon: string;
  label: string;
  value: string;
  val?: string;
  sub?: string;
  trend?: string;
}

export interface SensorTileItem {
  icon: string;
  label: string;
  value: string;
  val?: string;
  trend?: string;
  trendColor?: string;
  status?: string;
  statusColor?: string;
}

export interface SensorBlockData {
  title: string;
  dropdown: string;
  accent?: 'amber' | 'blue' | string;
  tiles: SensorTileItem[];
  banner: {
    kind: 'alert' | 'success';
    text: string;
  };
}

export interface RouteItem {
  n: string;
  color: string;
  address: string;
  time: string;
  status: string;
  statusColor: string;
  duration: string;
}

export interface ReportTileItem {
  icon: string;
  label: string;
  color: string;
}

export interface OverallActivityData {
  title: string;
  tabs: string[];
  advice: string;
  score: number;
}
