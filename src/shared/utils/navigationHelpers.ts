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

// Cross-tab link to Reports. Reports is the ROOT of ReportStack (navigation/types.ts),
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
