// HomeStack.tsx — Stack navigator for Home tab
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '@features/home/screens/HomeScreen';
import DetailsScreen from '@features/home/screens/DetailsScreen';
import { HomeStackParamList } from '@navigation/types';

const Stack = createNativeStackNavigator<HomeStackParamList>();

// TODO: Flip INITIAL_ROUTE to 'Home' once HomeScreen is fully built
const INITIAL_ROUTE: keyof HomeStackParamList = 'Details';

export function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName={INITIAL_ROUTE}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
  );
}

export default HomeStack;
