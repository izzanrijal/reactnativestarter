/**
 * @description 
 * Authentication flow navigator for unauthenticated users.
 * 
 * Key features:
 * - Sign in screen
 * - Sign up screen
 * - Password reset flow
 * - Onboarding screens
 * 
 * @dependencies
 * - @react-navigation/native-stack: Stack navigator
 * 
 * @notes
 * - Handles all authentication-related navigation
 * - Includes onboarding for first-time users
 */

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { OnboardingScreen } from '../Screens/Auth/OnboardingScreen';
import { SignInScreen } from '../Screens/Auth/SignInScreen';
import { SignUpScreen } from '../Screens/Auth/SignUpScreen';
import { ForgotPasswordScreen } from '../Screens/Auth/ForgotPasswordScreen';
import { ResetPasswordScreen } from '../Screens/Auth/ResetPasswordScreen';
import { theme } from '../Config/theme';

export type AuthStackParamList = {
  Onboarding: undefined;
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
  ResetPassword: { token: string };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.background.primary,
        },
        headerTintColor: theme.colors.text.primary,
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Onboarding"
        component={OnboardingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignIn"
        component={SignInScreen}
        options={{ title: 'Masuk' }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUpScreen}
        options={{ title: 'Daftar' }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{ title: 'Lupa Password' }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{ title: 'Reset Password' }}
      />
    </Stack.Navigator>
  );
}; 