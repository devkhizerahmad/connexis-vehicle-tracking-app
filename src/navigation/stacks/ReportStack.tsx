// ReportStack.tsx — Stack navigator for Reports tab
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReportsScreen from '@features/reports/screens/ReportsScreen';
import { ReportStackParamList } from '@navigation/types';

const Stack = createNativeStackNavigator<ReportStackParamList>();

export function ReportStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ReportsMain" component={ReportsScreen} />
    </Stack.Navigator>
  );
}

export default ReportStack;
