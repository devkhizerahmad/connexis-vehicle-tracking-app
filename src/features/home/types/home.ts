// home.ts — HomeScreen feature types
import type { Vehicle, VehicleStatus } from '@shared/types/domain';

export interface VehicleSensorStrip {
  temp: string;
  fuel: string;
  door: string;
}

export interface VehicleSummary extends Vehicle {
  status: VehicleStatus;
  image: 'sedan' | 'van';
  speed: string;
  location: string;
  update: string;
  signal: 'Strong' | 'Medium';
  batteryVoltage: string;
  satelliteSignal: string;
  /** Honda Civic only (reference mock): premium sensor strip content. */
  sensorStrip?: VehicleSensorStrip;
  expandedByDefault?: boolean;
}

export interface HomePromo {
  title: string;
  buttonLabel: string;
}

export interface HomeSummary {
  total: number;
  running: number;
  idle: number;
  stop: number;
  noData: string;
}

export interface HomeFeedData {
  summary: HomeSummary;
  vehicles: VehicleSummary[];
  promo: HomePromo;
}

export interface HomeFeedLegacy {
  totalAssets: number;
  activeAssets: number;
  vehicles: VehicleSummary[];
}
