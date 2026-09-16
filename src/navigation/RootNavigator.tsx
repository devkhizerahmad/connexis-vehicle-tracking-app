// RootNavigator.tsx — Root bottom tab navigator with custom BottomNav tab bar
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import BottomNav from '@shared/components/layout/BottomNav';
import HomeStack from './stacks/HomeStack';
import ReportStack from './stacks/ReportStack';
import EngineControlStack from './stacks/EngineControlStack';
import MapStack from './stacks/MapStack';
import ProfileStack from './stacks/ProfileStack';
import { RootTabParamList } from './types';

const Tab = createBottomTabNavigator<RootTabParamList>();

const tabNameToLabel: Record<string, string> = {
  HomeTab: 'Home',
  ReportTab: 'Report',
  EngineControlTab: 'Engine Control',
  MapTab: 'Map',
  ProfileTab: 'Profile',
};

function CustomTabBar({ state, navigation }: any) {
  const currentTabKey = state.routes[state.index].name;
  const activeLabel = tabNameToLabel[currentTabKey] ?? 'Home';

  // The Profile screen renders its own header and hides the tab bar entirely
  // (reference artboard). The back chevron pops back to the previous tab.
  if (currentTabKey === 'ProfileTab') {
    return null;
  }

  const handleTabPress = (label: string) => {
    switch (label) {
      case 'Home':
        navigation.navigate('HomeTab');
        break;
      case 'Report':
        navigation.navigate('ReportTab');
        break;
      case 'Engine Control':
        navigation.navigate('EngineControlTab');
        break;
      case 'Map':
        navigation.navigate('MapTab');
        break;
      case 'Profile':
        navigation.navigate('ProfileTab');
        break;
      default:
        break;
    }
  };

  return (
    <BottomNav
      tabs={['Home', 'Report', 'Engine Control', 'Map', 'Profile']}
      active={activeLabel}
      onTabPress={handleTabPress}
    />
  );
}

export function RootNavigator({onReady}: {onReady?: () => void}) {
  return (
    <NavigationContainer onReady={onReady}>
      <Tab.Navigator
        tabBar={props => <CustomTabBar {...props} />}
        screenOptions={{ headerShown: false }}>
        <Tab.Screen name="HomeTab" component={HomeStack} />
        <Tab.Screen name="ReportTab" component={ReportStack} />
        <Tab.Screen name="EngineControlTab" component={EngineControlStack} />
        <Tab.Screen name="MapTab" component={MapStack} />
        <Tab.Screen name="ProfileTab" component={ProfileStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigator;

