/**
 * @description 
 * Root navigation component that handles authentication flow.
 * 
 * Key features:
 * - Authentication flow handling
 * - Stack navigation setup
 * - Loading and error states
 * - Protected route handling
 * 
 * @dependencies
 * - @react-navigation/native-stack: Stack navigator
 * 
 * @notes
 * - Handles authentication state changes
 * - Provides loading screen while checking auth
 * - Manages protected route access
 */

import React, { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../Hooks/useAuth';
import { LoadingScreen } from '../Screens/LoadingScreen';
import { AuthNavigator } from './AuthNavigator';
import { MainNavigator } from './MainNavigator';

// Define types for the navigation stack
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const { isLoading, isAuthenticated, user } = useAuth();

  // Check if onboarding has been completed
  const checkOnboarding = async () => {
    try {
      const onboardingCompleted = await AsyncStorage.getItem('onboardingCompleted');
      if (!onboardingCompleted && !isAuthenticated) {
        // If onboarding hasn't been completed and user is not authenticated,
        // they will be directed to onboarding via AuthNavigator
        return false;
      }
      return true;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      return false;
    }
  };

  useEffect(() => {
    checkOnboarding();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Using type assertion to work around TypeScript error with Stack.Navigator
  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      // @ts-ignore - Ignoring id property requirement
    >
      {!isAuthenticated ? (
        // Unauthenticated stack
        <Stack.Screen 
          name="Auth" 
          component={AuthNavigator}
        />
      ) : (
        // Authenticated stack
        <Stack.Screen 
          name="Main" 
          component={MainNavigator}
        />
      )}
    </Stack.Navigator>
  );
};