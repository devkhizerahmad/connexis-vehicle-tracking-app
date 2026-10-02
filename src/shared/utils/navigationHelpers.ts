// RESERVED: pending LiveMap screen (typed cross-tab navigation)

// navigationHelpers.ts — typed navigation helper utilities
import { NavigationProp } from '@react-navigation/native';
import { RootTabParamList } from '@navigation/types';

export const goToLiveMap = (
  navigation: NavigationProp<RootTabParamList>,
  vehicleId?: string,
) => {
  navigation.navigate('MapTab', {
    screen: 'LiveMap',
    params: { vehicleId },
  });
};

// W1: cross-tab link to Reports. Reports is the ROOT of ReportStack (navigation/types.ts),
// so navigating the ReportTab stack to it also highlights the REPORT tab.
export const goToReports = (
  navigation: NavigationProp<RootTabParamList>,
  vehicleId?: string,
) => {
  navigation.navigate('ReportTab', {
    screen: 'Reports',
    params: { vehicleId },
  });
};
