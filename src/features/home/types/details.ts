// details.ts — Details screen feature models
import {
  KpiItem,
  SensorBlockData,
  RouteItem,
  ReportTileItem,
  OverallActivityData,
} from '@shared/types/vehicle';
import { NavTabItem } from '@shared/types/common';

export interface VehicleDetailsData {
  plate: string;
  status: string;
  speedLabel: string;
  speed: string;
  updateLabel: string;
  update: string;
  lastLocationLabel: string;
  location: string;
  liveLocation: string;
  kpis: KpiItem[];
  fuelSensor: SensorBlockData;
  tempSensor: SensorBlockData;
  routes: RouteItem[];
  viewMore: string;
  reports: ReportTileItem[];
  activity: OverallActivityData;
  nav: (NavTabItem | string)[];
}
