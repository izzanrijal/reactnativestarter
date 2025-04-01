/**
 * @description 
 * Onboarding screen shown to first-time users.
 * Displays a carousel of slides introducing the app's features.
 * 
 * @dependencies
 * - @react-navigation/native: Navigation
 * - AsyncStorage: Persist onboarding completion
 * 
 * @notes
 * - Only shown once to new users
 * - Uses AsyncStorage to track completion
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingCarousel } from '../../Components/Onboarding/OnboardingCarousel';
import { theme } from '../../Config/theme';
import { AuthStackParamList } from '../../Navigation/AuthNavigator';

// Onboarding slides data
const slides = [
  {
    title: 'Welcome to ParentCare',
    description: 'Your trusted partner in child development and healthcare consultation.',
    image: require('../../Assets/Images/onboarding-1.png'),
  },
  {
    title: 'Expert Consultation',
    description: 'Connect with qualified pediatricians and child development experts.',
    image: require('../../Assets/Images/onboarding-2.png'),
  },
  {
    title: 'Track Progress',
    description: 'Monitor your child\'s growth and development milestones.',
    image: require('../../Assets/Images/onboarding-3.png'),
  },
  {
    title: 'Get Started',
    description: 'Create an account to begin your journey with ParentCare.',
    image: require('../../Assets/Images/onboarding-4.png'),
  },
];

type OnboardingScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Onboarding'>;

export const OnboardingScreen = () => {
  const navigation = useNavigation<OnboardingScreenNavigationProp>();

  const handleOnboardingComplete = async () => {
    try {
      // Mark onboarding as completed
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      // Navigate to sign in screen
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Error saving onboarding state:', error);
      // Navigate anyway even if saving state fails
      navigation.navigate('SignIn');
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingCarousel 
        slides={slides} 
        onComplete={handleOnboardingComplete}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
}); 