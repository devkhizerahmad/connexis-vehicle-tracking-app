// ReportStack.tsx — Stack navigator for the Report tab.
// PATCH T-REPORTS: Reports is registered here as the ROOT route (was a
// MapStack route). Living in this stack is what makes the bottom bar highlight
// the REPORT tab when the screen opens.
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ReportsScreen from '@features/reports/screens/ReportsScreen';
import { ReportStackParamList } from '@navigation/types';

const Stack = createNativeStackNavigator<ReportStackParamList>();

const INITIAL_ROUTE: keyof ReportStackParamList = 'Reports';

export function ReportStack() {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Reports" component={ReportsScreen} />
    </Stack.Navigator>
  );
}

export default ReportStack;
