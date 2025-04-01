/**
 * @description 
 * Loading screen shown during app initialization and auth checks.
 * 
 * @dependencies
 * - react-native: Core components
 * 
 * @notes
 * - Displays a loading indicator
 * - Used during authentication checks and data loading
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { theme } from '../Config/theme';

export const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={theme.colors.primary.main} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background.primary,
  },
}); 