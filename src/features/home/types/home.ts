// home.ts — HomeScreen feature types
export interface VehicleSummary {
  id: string;
  plateNumber: string;
  status: 'running' | 'idle' | 'stop' | 'noData';
  model: string;
}

export interface HomeFeedData {
  totalAssets: number;
  activeAssets: number;
  vehicles: VehicleSummary[];
}
