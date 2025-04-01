/**
 * @description 
 * Root provider component that wraps the entire application.
 * Provides global configuration and context providers.
 * 
 * Key features:
 * - Theme provider setup
 * - SafeAreaView configuration
 * - Status bar configuration
 * 
 * @dependencies
 * - react-native-safe-area-context: For safe area handling
 * - expo-status-bar: For status bar configuration
 * 
 * @notes
 * - Add additional providers here as needed (e.g., auth, notifications)
 * - Ensures consistent layout across different devices
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { theme } from './Config/theme';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      {children}
    </SafeAreaProvider>
  );
}; 