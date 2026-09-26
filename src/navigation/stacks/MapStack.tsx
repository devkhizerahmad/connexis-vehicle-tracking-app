// MapStack.tsx — Stack navigator for Map tab
// LiveMap is now the initial route (built screen); History pushes above it.
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LiveMapScreen from '@features/map/screens/LiveMapScreen';
import HistoryScreen from '@features/map/screens/HistoryScreen';
import ReportsScreen from '@features/reports/screens/ReportsScreen';
import { MapStackParamList } from '@navigation/types';

const Stack = createNativeStackNavigator<MapStackParamList>();

// LiveMap built — it is the entry-point screen of MapTab.
const INITIAL_ROUTE: keyof MapStackParamList = 'LiveMap';

export function MapStack() {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LiveMap" component={LiveMapScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
    </Stack.Navigator>
  );
}

export default MapStack;
