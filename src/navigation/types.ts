// navigation/types.ts — Navigation param list types
import { NavigatorScreenParams } from '@react-navigation/native';

export type HomeStackParamList = {
  Home: undefined;
  Details: { vehicleId?: string } | undefined;
};

export type MapStackParamList = {
  LiveMap: { vehicleId?: string } | undefined;
  History: { vehicleId: string };
  Reports: { vehicleId?: string } | undefined;
};

export type ReportStackParamList = {
  ReportsMain: undefined;
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
