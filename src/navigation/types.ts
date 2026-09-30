// navigation/types.ts — Navigation param list types
import { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  Home: undefined;
  Details: { vehicleId?: string } | undefined;
};

// PATCH T-REPORTS: the `Reports` route was MIGRATED out of MapStack and into
// ReportStack (where it is the root). LiveMap + History stay here untouched.
export type MapStackParamList = {
  LiveMap: { vehicleId?: string } | undefined;
  History: { vehicleId: string };
};

// Reports is the ROOT of the REPORT stack (not a MapStack route) so that the
// bottom "Report" tab opens it and the REPORT tab stays highlighted. The
// reference artboard shows the MAP tab highlighted here; that is a design
// inconsistency, intentionally corrected per user decision.
export type ReportStackParamList = {
  Reports: { vehicleId?: string } | undefined;
};

export type EngineControlStackParamList = {
  EngineControlMain: undefined;
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
};

export type RootTabParamList = {
  HomeTab: NavigatorScreenParams<HomeStackParamList>;
  ReportTab: NavigatorScreenParams<ReportStackParamList>;
  EngineControlTab: NavigatorScreenParams<EngineControlStackParamList>;
  MapTab: NavigatorScreenParams<MapStackParamList>;
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
};
