/**
 * @description 
 * Root application component that sets up global providers and configuration.
 * 
 * Key features:
 * - Global providers setup
 * - Safe area handling
 * - Status bar configuration
 * 
 * @dependencies
 * - Providers: Global provider wrapper
 * - MainNavigator: Main navigation component
 * 
 * @notes
 * - Currently bypassing auth for development
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Providers } from './src/providers';
import { MainNavigator } from './src/Navigation/MainNavigator';

export default function App() {
  return (
    <Providers>
      <NavigationContainer>
        <MainNavigator />
      </NavigationContainer>
    </Providers>
  );
}