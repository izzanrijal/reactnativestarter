/**
 * @description 
 * Sign in screen for user authentication.
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../Types/navigation';
import { theme } from '../../Config/theme';

type SignInScreenNavigationProp = NativeStackNavigationProp<AuthStackParamList>;

export const SignInScreen = () => {
  const navigation = useNavigation<SignInScreenNavigationProp>();

  const handleSignIn = () => {
    // TODO: Implement actual sign in logic
    console.log('Sign in pressed');
  };

  const navigateToSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
      </View>

      <View style={styles.form}>
        {/* Placeholder for email and password inputs */}
        <View style={styles.inputPlaceholder}>
          <Text style={styles.placeholderText}>Email Input</Text>
        </View>
        <View style={styles.inputPlaceholder}>
          <Text style={styles.placeholderText}>Password Input</Text>
        </View>

        <TouchableOpacity onPress={handleSignIn} style={styles.signInButton}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => {}} style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={navigateToSignUp}>
          <Text style={styles.signUpText}>Sign Up</Text>
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
  signInButton: {
    backgroundColor: theme.colors.primary[500],
    padding: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 24,
  },
  signInButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPassword: {
    alignItems: 'center',
    marginTop: 16,
  },
  forgotPasswordText: {
    color: theme.colors.primary[500],
    fontSize: 14,
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
  signUpText: {
    color: theme.colors.primary[500],
    fontSize: 14,
    fontWeight: '600',
  },
}); 