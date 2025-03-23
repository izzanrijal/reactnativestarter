import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, SafeAreaView, Alert, TouchableOpacity, View, TextInput } from 'react-native';
import { set, useForm } from 'react-hook-form';
import CustomForm from '../Components/Forms/FormInput';
import { FormData, FormField } from '../Types/types';
import supabase from '@config/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { callEmailVerifyFunction } from '@hooks/callEmailVerifyFunction';
import { isValidEmail } from '../utils/emailUtils';

// Track password reset attempts for rate limiting
const resetAttempts = new Map<string, {count: number, lastAttempt: number}>();

const SignInScreen = ({ navigation }) => {
  const { control, handleSubmit, watch } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [showForgotPasswordForm, setShowForgotPasswordForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');
  const [resetInProgress, setResetInProgress] = useState(false);

  const sendVerificationEmail = async (email, password) => {
    try {
      // Use callEmailVerifyFunction to send verification email
      callEmailVerifyFunction(email, (randomCode) => {
        console.log('Verification code sent to email:', randomCode);
        
        // Navigate to verification screen with generated code
        navigation.replace('VerificationScreen', {
          email,
          password,
          verificationCode: randomCode.toString()
        });
        
        Alert.alert(
          'Verification Required',
          `You need to verify your email before accessing the app. Please check your email for the code.`
        );
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      
      // Fallback to generating code locally if email sending fails
      const fallbackCode = Math.floor(1000 + Math.random() * 9000).toString();
      console.log('Email sending failed. Using fallback code:', fallbackCode);
      
      // Navigate to verification with fallback code
      navigation.replace('VerificationScreen', {
        email,
        password,
        verificationCode: fallbackCode
      });
      
      Alert.alert(
        'Verification Required',
        `Your verification code is: ${fallbackCode}`
      );
    }
  };

  const sendDataToSupabase = async (data: FormData) => {
    setLoading(true);
    const { email, password } = data;
    try {
      // Check if this email exists in user_profile and if it's verified
      try {
        const { data: userProfile, error: profileQueryError } = await supabase
          .from('user_profile')
          .select('is_verified, user_uuid, user_email')
          .eq('user_email', email)
          .single();
        
        // If table doesn't exist error
        if (profileQueryError && profileQueryError.code === '42P01') {
          console.log('user_profile table does not exist, skipping verification check');
          // Proceed with normal sign in without verification
        }
        // If we found a profile for this email
        else if (userProfile) {
          // Check verification status first
          if (userProfile.is_verified === false) {
            // Profile exists but is NOT verified - send verification email
            
            // Try to sign in anyway to get authentication
            const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
              email,
              password,
            });
            
            if (signInError) {
              Alert.alert('Sign-in Error', signInError.message);
              setLoading(false);
              return;
            }
            
            // Send verification email and navigate to verification screen
            sendVerificationEmail(email, password);
            setLoading(false);
            return;
          }
        }
      } catch (profileCheckError) {
        console.error('Error checking user profile:', profileCheckError);
        // Continue with sign-in process even if profile check fails
      }
      
      // Attempt to sign in 
      const { data: signInData, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        Alert.alert('Sign-in Error', error.message);
        setLoading(false);
        return;
      }
      
      const userId = signInData.user.id;
      
      // If we made it here, try again to check or update the user profile
      try {
        // Check again for user profile after successful sign-in
        const { data: profileData, error: profileError } = await supabase
          .from('user_profile')
          .select('is_verified')
          .eq('user_uuid', userId)
          .single();
        
        // If table doesn't exist, we'll proceed anyway
        if (profileError && profileError.code === '42P01') {
          console.log('user_profile table does not exist, treating user as verified');
          // Store user ID in AsyncStorage
          await AsyncStorage.setItem('userUuid', userId || '');
          // Proceed to home screen
          navigation.replace('HomeScreen');
          setLoading(false);
          return;
        }
        
        // If no profile found or error retrieving it, create one and require verification
        if (profileError && profileError.code === 'PGRST116') {
          try {
            // Create a new profile with unverified status
            await supabase
              .from('user_profile')
              .insert({
                user_uuid: userId,
                user_email: email,
                created_at: new Date().toISOString(),
                is_verified: false
              });
          } catch (insertError) {
            console.error('Error creating user profile:', insertError);
            // Continue even if insert fails
          }
          
          // Store user ID
          await AsyncStorage.setItem('userUuid', userId || '');
          
          // Send verification email and navigate
          sendVerificationEmail(email, password);
          setLoading(false);
          return;
        }
        
        // Check if existing profile is unverified
        if (profileData && profileData.is_verified === false) {
          await AsyncStorage.setItem('userUuid', userId || '');
          
          // Send verification email and navigate
          sendVerificationEmail(email, password);
          setLoading(false);
          return;
        }
      } catch (profileCheckError) {
        console.error('Error checking/updating profile after sign-in:', profileCheckError);
        // If we can't reliably check or update the profile, just go to Home
      }
      
      // If we get here, the user is verified - proceed to HomeScreen
      await AsyncStorage.setItem('userUuid', userId || '');
      navigation.replace('HomeScreen');
      
    } catch (err) {
      console.error('Sign in process error:', err);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async () => {
    // Validate the email
    if (!resetEmail || !isValidEmail(resetEmail)) {
      setResetEmailError('Please enter a valid email address');
      return;
    }

    setResetInProgress(true);
    
    try {
      // Try a sign-in with a dummy password to check if the email exists
      // This will always fail but we can check the error type
      const { error } = await supabase.auth.signInWithPassword({
        email: resetEmail,
        password: 'dummy_password_for_check_only',
      });
      
      // If we get an error saying the user doesn't exist
      if (error && error.message.includes("Email not confirmed") || 
          error && error.message.includes("Invalid login credentials")) {
        // Email exists, we can proceed
        console.log('Email exists, proceeding with password reset');
      } else if (error && error.message.includes("user not found")) {
        // Email doesn't exist in the system
        setResetEmailError('No account found with this email address');
        setResetInProgress(false);
        return;
      }
      
      // Implement rate limiting
      const now = Date.now();
      const userAttempts = resetAttempts.get(resetEmail) || { count: 0, lastAttempt: 0 };
      
      // Check if user is exceeding rate limit (max 3 attempts in 30 minutes)
      if (userAttempts.count >= 3 && (now - userAttempts.lastAttempt) < 30 * 60 * 1000) {
        const minutesRemaining = Math.ceil((30 * 60 * 1000 - (now - userAttempts.lastAttempt)) / (60 * 1000));
        setResetEmailError(`Too many reset attempts. Please try again in ${minutesRemaining} minutes.`);
        setResetInProgress(false);
        return;
      }
      
      // Reset counter if it's been more than 30 minutes
      if ((now - userAttempts.lastAttempt) > 30 * 60 * 1000) {
        userAttempts.count = 0;
      }
      
      // Send verification code via email using the same function used for account verification
      callEmailVerifyFunction(resetEmail, (verificationCode) => {
        console.log('Password reset code sent to email:', verificationCode);
        
        // Navigate to reset password screen with the verification code
        navigation.navigate('ResetPasswordScreen', {
          email: resetEmail,
          verificationCode: verificationCode.toString(),
          mode: 'reset'
        });
        
        // Update rate limiting counter
        resetAttempts.set(resetEmail, { 
          count: userAttempts.count + 1, 
          lastAttempt: now 
        });
        
        // Reset the form
        setShowForgotPasswordForm(false);
        setResetEmail('');
        setResetEmailError('');
      });
      
    } catch (err) {
      console.error('Password reset error:', err);
      setResetEmailError('An unexpected error occurred. Please try again.');
    } finally {
      setResetInProgress(false);
    }
  };

  const formFields: FormField[] = [
    {
      name: 'email',
      label: 'Email',
      placeholder: 'Enter your email',
      rules: { 
        required: 'Email is required',
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: 'Invalid email address'
        }
      },
      keyboardType: 'email-address',
    },
    {
      name: 'password',
      label: 'Password',
      placeholder: 'Enter your password',
      rules: { 
        required: 'Password is required',
        minLength: {
          value: 6,
          message: 'Password must be at least 6 characters'
        }
      },
      secureTextEntry: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Sign In</Text>
      
      {showForgotPasswordForm ? (
        <View style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordTitle}>Forgot Password</Text>
          <Text style={styles.forgotPasswordDescription}>
            Enter your email address and we'll send you instructions to reset your password.
          </Text>
          
          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={[styles.input, resetEmailError ? styles.inputError : null]}
              value={resetEmail}
              onChangeText={(text) => {
                setResetEmail(text);
                if (resetEmailError) setResetEmailError('');
              }}
              placeholder="Enter your email address"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            {resetEmailError ? <Text style={styles.errorText}>{resetEmailError}</Text> : null}
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.cancelButton]} 
              onPress={() => {
                setShowForgotPasswordForm(false);
                setResetEmail('');
                setResetEmailError('');
              }}
              disabled={resetInProgress}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.resetButton, resetInProgress && styles.disabledButton]} 
              onPress={forgotPassword}
              disabled={resetInProgress}
            >
              <Text style={styles.buttonText}>
                {resetInProgress ? "Sending..." : "Reset Password"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <>
          <CustomForm
            fields={formFields}
            control={control}
            onSubmit={handleSubmit(sendDataToSupabase)}
            submitButtonText={loading ? "Signing in..." : "Sign In"}
            disabled={loading}
          />
          
          <TouchableOpacity 
            onPress={() => setShowForgotPasswordForm(true)}
            style={styles.forgotPasswordLink}
          >
            <Text style={styles.forgotPasswordText}>Forgot password?</Text>
          </TouchableOpacity>
          
          <Text style={styles.smallText}>
            Don't have an account?{' '}
            <Text 
              onPress={() => navigation.navigate('SignUpScreen')} 
              style={styles.smallTextBlue}
            >
              Sign Up
            </Text>
          </Text>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  smallText: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  smallTextBlue: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
  header: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
    textAlign: 'left',
  },
  forgotPasswordLink: {
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: 'blue',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  forgotPasswordContainer: {
    marginTop: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  forgotPasswordTitle: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  forgotPasswordDescription: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    color: '#666',
  },
  fieldContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  resetButton: {
    backgroundColor: '#007AFF',
  },
  disabledButton: {
    backgroundColor: '#99CCFF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SignInScreen;