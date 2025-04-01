/**
 * @description 
 * Root navigation container that handles authentication flow.
 * 
 * Key features:
 * - Authentication flow handling
 * - Stack navigation setup
 * - Loading and error states
 * 
 * @dependencies
 * - @react-navigation/native: Core navigation
 * - @react-navigation/native-stack: Stack navigator
 * 
 * @notes
 * - Handles authentication state changes
 * - Provides loading screen while checking auth
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../Hooks/useAuth';
import { LoadingScreen } from '../Screens/LoadingScreen';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          <Stack.Screen name="Main" component={MainNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 