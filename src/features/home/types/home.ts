// home.ts — HomeScreen feature types
export interface VehicleSensorStrip {
  temp: string;
  fuel: string;
  door: string;
}

export interface VehicleSummary {
  id: string;
  /** Kia Sportage shares its plate with Suzuki Mehran in the mock data; id is unique. */
  plate?: string;
  name: string;
  status: 'running' | 'idle' | 'stop' | 'noData';
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

// RESERVED: pending History/Reports screens (feed payload shape kept for API swap)
export interface HomeFeedLegacy {
  totalAssets: number;
  activeAssets: number;
  vehicles: VehicleSummary[];
}
