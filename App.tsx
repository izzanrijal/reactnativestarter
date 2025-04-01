/**
 * @description 
 * Root application component that sets up global providers and configuration.
 * 
 * Key features:
 * - Global providers setup
 * - Safe area handling
 * - Status bar configuration
 * - Authentication flow
 * 
 * @dependencies
 * - Providers: Global provider wrapper
 * - AppNavigator: Root navigation with auth flow
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Providers } from './src/providers';
import { AppNavigator } from './src/Navigation/AppNavigator';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <Providers>
      <StatusBar style="dark" />
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Providers>
  );
}