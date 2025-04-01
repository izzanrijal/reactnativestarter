/**
 * @description 
 * Sign up screen for new user registration.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { theme } from '../../Config/theme';

export const SignUpScreen = () => {
  const navigation = useNavigation();

  const handleSignUp = () => {
    // TODO: Implement actual sign up logic
    console.log('Sign up pressed');
  };

  const navigateToSignIn = () => {
    navigation.navigate('SignIn');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
      </View>

      <View style={styles.form}>
        {/* Placeholder for input fields */}
        <View style={styles.inputPlaceholder}>
          <Text style={styles.placeholderText}>Full Name Input</Text>
        </View>
        <View style={styles.inputPlaceholder}>
          <Text style={styles.placeholderText}>Email Input</Text>
        </View>
        <View style={styles.inputPlaceholder}>
          <Text style={styles.placeholderText}>Password Input</Text>
        </View>
        <View style={styles.inputPlaceholder}>
          <Text style={styles.placeholderText}>Confirm Password Input</Text>
        </View>

        <TouchableOpacity onPress={handleSignUp} style={styles.signUpButton}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={navigateToSignIn}>
          <Text style={styles.signInText}>Sign In</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background.primary,
    padding: 20,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.text.secondary,
  },
  form: {
    flex: 1,
  },
  inputPlaceholder: {
    backgroundColor: theme.colors.neutral.gray200,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  placeholderText: {
    color: theme.colors.text.secondary,
  },
  signUpButton: {
    backgroundColor: theme.colors.primary[500],
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 24,
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    color: theme.colors.text.secondary,
    fontSize: 14,
  },
  signInText: {
    color: theme.colors.primary[500],
    fontSize: 14,
    fontWeight: '600',
  },
}); 