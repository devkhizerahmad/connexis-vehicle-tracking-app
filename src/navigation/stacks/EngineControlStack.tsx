// EngineControlStack.tsx — Stack navigator for Engine Control tab
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import EngineControlScreen from '@features/engineControl/screens/EngineControlScreen';
import { EngineControlStackParamList } from '@navigation/types';

const Stack = createNativeStackNavigator<EngineControlStackParamList>();

export function EngineControlStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EngineControlMain" component={EngineControlScreen} />
    </Stack.Navigator>
  );
}

export default EngineControlStack;
