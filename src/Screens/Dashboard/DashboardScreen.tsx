/**
 * @description 
 * Main dashboard screen showing overview of children, consultations, and blog content.
 * Currently a placeholder version for development.
 * 
 * @dependencies
 * - react-native: Core components
 * 
 * @notes
 * - Temporary placeholder implementation
 */

import React from 'react';
import { 
  View, 
  Text,
  StyleSheet,
} from 'react-native';
import { theme } from '../../Config/theme';

export const DashboardScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>Welcome to AhliAnak</Text>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Children</Text>
        <Text style={styles.placeholder}>No children added yet</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Consultations</Text>
        <Text style={styles.placeholder}>No recent consultations</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Articles</Text>
        <Text style={styles.placeholder}>Loading articles...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  placeholder: {
    fontSize: 14,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
}); 