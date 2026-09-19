// RESERVED: pending LiveMap screen (typed cross-tab navigation)

// navigationHelpers.ts — typed navigation helper utilities
import { NavigationProp } from '@react-navigation/native';
import { RootTabParamList } from '@navigation/types';

export const goToLiveMap = (
  navigation: NavigationProp<RootTabParamList>,
  vehicleId: string,
) => {
  navigation.navigate('MapTab', {
    screen: 'LiveMap',
    params: { vehicleId },
  });
};
