/**
 * @description 
 * Onboarding screen shown to first-time users.
 * Shows app introduction and leads to auth flow.
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../Types/navigation';
import { theme } from '../../Config/theme';

type OnboardingScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

const { width } = Dimensions.get('window');

const onboardingSlides = [
  {
    id: '1',
    title: 'Welcome to AhliAnak',
    description: 'Your trusted partner in child development and healthcare',
  },
  {
    id: '2',
    title: 'Expert Consultation',
    description: 'Connect with qualified pediatricians and child development experts',
  },
  {
    id: '3',
    title: 'Track Progress',
    description: 'Monitor your child\'s growth and development milestones',
  },
];

export const OnboardingScreen = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigation = useNavigation<OnboardingScreenNavigationProp>();

  const handleNext = () => {
    if (currentSlide < onboardingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      completeOnboarding();
    }
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem('onboardingCompleted', 'true');
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  return (
    <View style={styles.container}>
      <View style={styles.slideContainer}>
        <Text style={styles.title}>{onboardingSlides[currentSlide].title}</Text>
        <Text style={styles.description}>{onboardingSlides[currentSlide].description}</Text>
      </View>

      <View style={styles.paginationContainer}>
        {onboardingSlides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === currentSlide && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        {currentSlide < onboardingSlides.length - 1 ? (
          <>
            <TouchableOpacity onPress={skipOnboarding} style={styles.skipButton}>
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleNext} style={styles.nextButton}>
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity onPress={handleNext} style={styles.getStartedButton}>
            <Text style={styles.getStartedButtonText}>Get Started</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
  },
  slideContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.neutral.gray200,
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: theme.colors.primary[500],
    width: 20,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipButton: {
    padding: 10,
  },
  skipButtonText: {
    color: theme.colors.text.secondary,
    fontSize: 16,
  },
  nextButton: {
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  getStartedButton: {
    backgroundColor: theme.colors.primary[500],
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 30,
    flex: 1,
    marginHorizontal: 20,
  },
  getStartedButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
}); 