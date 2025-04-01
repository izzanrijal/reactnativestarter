import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../../Config/theme';

export const DoctorsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Doctors</Text>
      <Text style={styles.placeholder}>Loading doctors...</Text>
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
    marginBottom: 16,
  },
  placeholder: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    fontStyle: 'italic',
  },
}); 