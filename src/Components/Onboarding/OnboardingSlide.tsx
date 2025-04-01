/**
 * @description 
 * Individual slide component for the onboarding carousel.
 * Displays an image, title, and description.
 * 
 * @dependencies
 * - react-native: Core components
 * 
 * @notes
 * - Used within OnboardingCarousel
 * - Supports custom styling
 */

import React from 'react';
import { View, Text, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { theme } from '../../Config/theme';

export interface OnboardingSlideProps {
  title: string;
  description: string;
  image: any; // Image source
}

export const OnboardingSlide: React.FC<OnboardingSlideProps> = ({
  title,
  description,
  image,
}) => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.container, { width }]}>
      <Image 
        source={image} 
        style={[styles.image, { width: width * 0.8 }]} 
        resizeMode="contain"
      />
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    height: 300,
    marginBottom: 20,
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: theme.colors.text.secondary,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
}); 