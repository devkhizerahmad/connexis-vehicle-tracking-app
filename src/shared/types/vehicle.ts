// vehicle.ts — shared vehicle domain models
export interface VehiclePlateStatus {
  country?: string;
  state?: string;
  number?: string;
}

export interface VehicleStatusInfo {
  state?: 'running' | 'idle' | 'stop' | 'noData' | string;
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
