// MapStack.tsx — Stack navigator for Map tab
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LiveMapScreen from '@features/map/screens/LiveMapScreen';
import HistoryScreen from '@features/map/screens/HistoryScreen';
import ReportsScreen from '@features/reports/screens/ReportsScreen';
import { MapStackParamList } from '@navigation/types';

const Stack = createNativeStackNavigator<MapStackParamList>();

export function MapStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LiveMap" component={LiveMapScreen} />
      <Stack.Screen name="History" component={HistoryScreen as any} />
      <Stack.Screen name="Reports" component={ReportsScreen} />
    </Stack.Navigator>
  );
}

export default MapStack;
