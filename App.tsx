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
 * 
 * @notes
 * - Add additional global setup here as needed
 */

import React from 'react';
import { View } from 'react-native';
import { Providers } from './src/providers';
import { theme } from './src/Config/theme';

export default function App() {
  return (
    <Providers>
      <View style={{ flex: 1, backgroundColor: theme.colors.background.primary }}>
        {/* App content will go here */}
      </View>
    </Providers>
  );
}