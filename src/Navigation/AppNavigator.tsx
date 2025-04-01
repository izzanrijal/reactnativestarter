/**
 * @description 
 * Root navigation container that handles authentication flow.
 * 
 * Key features:
 * - Authentication flow handling
 * - Stack navigation setup
 * - Loading and error states
 * - Protected route handling
 * 
 * @dependencies
 * - @react-navigation/native: Core navigation
 * - @react-navigation/native-stack: Stack navigator
 * 
 * @notes
 * - Handles authentication state changes
 * - Provides loading screen while checking auth
 * - Manages protected route access
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
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

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
            // Pass user data to MainNavigator
            initialParams={{ user }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}; 