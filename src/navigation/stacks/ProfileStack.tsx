// ProfileStack.tsx — Stack navigator for Profile tab
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProfileScreen from '@features/profile/screens/ProfileScreen';
import { ProfileStackParamList } from '@navigation/types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
    </Stack.Navigator>
  );
}

export default ProfileStack;
