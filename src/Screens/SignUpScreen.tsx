import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, SafeAreaView, Alert } from 'react-native';
import { set, useForm } from 'react-hook-form';
import CustomForm from '../Components/Forms/FormInput';
import { FormData, FormField } from '../Types/types';
import supabase from '@config/supabase';
import { callEmailVerifyFunction } from '@hooks/callEmailVerifyFunction';

const SignUpScreen = ({ navigation }) => {
  const { control, handleSubmit, watch } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
      repeatPassword: ''
    }
  });
  
  const [loading, setLoading] = useState(false);
  const [isPasswordMatch, setIsPasswordMatch] = useState(true);
  const [verificationInProgress, setVerificationInProgress] = useState(false);
  
  const password = watch('password');
  const repeatPassword = watch('repeatPassword');
  
  useEffect(() => {
    if (password && repeatPassword) {
      setIsPasswordMatch(password === repeatPassword);
      setLoading(false);
    }
  }, [password, repeatPassword]);

  // Safe navigation function that works in all navigation scenarios
  const safeNavigateToVerification = (email, password, verificationCode) => {
    try {
      // First try to navigate directly to verification screen
      navigation.navigate('VerificationScreen', {
        email: email,
        password: password,
        verificationCode: verificationCode
      });
    } catch (navError) {
      console.error('Navigation error:', navError);
      
      // Fall back to using global variables if direct navigation fails
      // This approach is needed when navigating between different stacks
      global.userEmail = email;
      global.verificationCode = verificationCode;
      
      // Store the password temporarily for verification process
      global.tempPassword = password;
      
      // Try navigating to SplashScreen first (which is always available)
      // and then the app will redirect to VerificationScreen on mount
      try {
        navigation.navigate('SplashScreen');
        
        // Show a message to inform the user what's happening
        setTimeout(() => {
          Alert.alert(
            'Verification Required',
            'Please complete email verification to continue.',
            [{ text: 'OK' }]
          );
        }, 500);
      } catch (fallbackError) {
        console.error('Fallback navigation error:', fallbackError);
        
        // Last resort: reload the app by signing out and in again
        Alert.alert(
          'Navigation Error',
          'Please sign in again to complete verification.',
          [{ 
            text: 'OK', 
            onPress: async () => {
              await supabase.auth.signOut();
              navigation.navigate('SignInScreen');
            }
          }]
        );
      }
    }
  };

  // Function to send verification email and navigate to verification screen
  const sendVerificationEmail = async (email, password) => {
    // Prevent multiple verification requests
    if (verificationInProgress) {
      console.log('Verification already in progress, ignoring duplicate request');
      return;
    }
    
    setVerificationInProgress(true);
    try {
      // Use callEmailVerifyFunction to send verification email
      callEmailVerifyFunction(email, (randomCode) => {
        console.log('Verification code sent to email:', randomCode);
        
        // Safe navigation to verification with the generated code
        safeNavigateToVerification(email, password, randomCode.toString());
        
        // Reset verification flag after successful navigation
        setVerificationInProgress(false);
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      
      // Reset verification flag on error
      setVerificationInProgress(false);
      
      // Fallback to generating code locally if email sending fails
      const fallbackCode = Math.floor(1000 + Math.random() * 9000).toString();
      console.log('Email sending failed. Using fallback code:', fallbackCode);
      
      Alert.alert(
        'Email Sending Issue',
        'We encountered an issue sending the verification email. Please use the code shown on the next screen.',
        [{ text: 'OK' }]
      );
      
      // Navigate with fallback code
      safeNavigateToVerification(email, password, fallbackCode);
    }
  };

  const handleFormSubmit = async (data: FormData) => {
    if (data.password !== data.repeatPassword) {
      setIsPasswordMatch(false);
      return;
    }
    
    setLoading(true);
    setIsPasswordMatch(true);
    
    try {
      // Check for table existence first
      try {
        // First check if the email is already registered
        const { data: existingUser, error: checkError } = await supabase
          .from('user_profile')
          .select('*')
          .eq('user_email', data.email)
          .single();
        
        // If table doesn't exist, we'll skip this check
        if (checkError && checkError.code === '42P01') {
          console.log('user_profile table does not exist, skipping existing user check');
        }
        // If we found an existing user
        else if (existingUser) {
          // Email already exists in user_profile
          try {
            const { data: verificationData } = await supabase
              .from('user_profile')
              .select('is_verified')
              .eq('user_email', data.email)
              .single();
              
            if (verificationData && verificationData.is_verified === true) {
              // User is already verified
              Alert.alert(
                'Account Exists',
                'This email is already registered and verified. Please sign in instead.',
                [{ text: 'OK', onPress: () => navigation.navigate('SignInScreen') }]
              );
              setLoading(false);
              return;
            } else {
              // User exists but is not verified - send to verification
              Alert.alert(
                'Account Exists',
                'This email is registered but not verified. We\'ll send a new verification code.',
                [{ text: 'OK' }]
              );
              
              // Send verification email and navigate
              sendVerificationEmail(data.email, data.password);
              setLoading(false);
              return;
            }
          } catch (profileError) {
            console.error('Error checking verification status:', profileError);
            // Continue with sign up
          }
        }
      } catch (dbError) {
        console.error('Database error during user check:', dbError);
        // Continue with signup process
      }
      
      // If we get here, user doesn't exist or we couldn't check - create a new account
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });
      
      if (error) {
        // Handle specific error for existing account
        if (error.message.includes('already registered')) {
          Alert.alert(
            'Account Exists',
            'This email is already registered. Please sign in or reset your password.',
            [{ text: 'OK', onPress: () => navigation.navigate('SignInScreen') }]
          );
          setLoading(false);
          return;
        }
        throw error;
      }
      
      // User created successfully, now create a profile with unverified status
      try {
        // Get the user ID from the signup response
        const userId = signUpData?.user?.id;
        
        if (userId) {
          // Create user profile with unverified status
          await supabase
            .from('user_profile')
            .insert({
              user_uuid: userId,
              user_email: data.email,
              created_at: new Date().toISOString(),
              is_verified: false
            });
          
          console.log('Created user profile with unverified status');
        } else {
          console.error('No user ID available after signup');
        }
      } catch (profileError) {
        console.error('Error creating user profile:', profileError);
        // Continue to verification anyway
      }
      
      // Send verification email and navigate
      sendVerificationEmail(data.email, data.password);
      
      setLoading(false);
    } catch (error) {
      console.error('SignUp error:', error);
      Alert.alert('Error during sign up', error.message || 'An unexpected error occurred');
      setLoading(false);
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
    {
      name: 'repeatPassword',
      label: 'Repeat Password',
      placeholder: 'Repeat your password',
      rules: { 
        required: 'Repeat password is required',
        validate: (value) => value === password || 'Passwords do not match'
      },
      secureTextEntry: true,
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Sign Up</Text>
      <CustomForm
        fields={formFields}
        control={control}
        onSubmit={handleSubmit(handleFormSubmit)}
        submitButtonText={loading ? "Signing up..." : "Sign Up"}
        disabled={loading || !isPasswordMatch}
      />
      {!isPasswordMatch && (
        <Text style={styles.errorText}>Passwords do not match!</Text>
      )}
      <Text style={styles.smallText}>
        Already have an account?{' '}
        <Text 
          onPress={() => navigation.navigate('SignInScreen')} 
          style={styles.smallTextBlue}
        >
          Sign In
        </Text>
      </Text>
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
    marginTop: 8,
    textAlign: 'center',
  },
});

export default SignUpScreen;