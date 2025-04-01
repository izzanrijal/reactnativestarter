/**
 * @description 
 * Screen for completing user profile after signup.
 * 
 * @dependencies
 * - @react-navigation/native: Navigation
 * - react-native: Core components
 * 
 * @notes
 * - Shown after successful signup
 * - Redirects to main app after completion
 */

import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ProfileCompletionForm } from '../../Components/Profile/ProfileCompletionForm';
import { theme } from '../../Config/theme';
import { RootStackParamList } from '../../Navigation/AppNavigator';

type CompleteProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Main'>;

export const CompleteProfileScreen = () => {
  const navigation = useNavigation<CompleteProfileScreenNavigationProp>();

  const handleProfileComplete = () => {
    // Navigate to main app
    navigation.replace('Main');
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.formContainer}>
        <ProfileCompletionForm onComplete={handleProfileComplete} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  formContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 500,
    alignSelf: 'center',
  },
}); 