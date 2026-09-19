// home.ts — HomeScreen feature types
export interface VehicleSummary {
  id: string;
  plateNumber: string;
  status: 'running' | 'idle' | 'stop' | 'noData';
  model: string;
}

// RESERVED: pending Home screen (feed payload)
export interface HomeFeedData {
  totalAssets: number;
  activeAssets: number;
  vehicles: VehicleSummary[];
}
