import Button from '@components/Buttons/Button';
import supabase from '@config/supabase';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, Text, StyleSheet, TextInput, View, BackHandler } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { callEmailVerifyFunction } from '@hooks/callEmailVerifyFunction';

const VerificationScreen = ({ route, navigation }) => {
  const [enteredCode, setEnteredCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [resendAttempts, setResendAttempts] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);
  
  // Load resend attempts from storage
  useEffect(() => {
    const loadResendAttempts = async () => {
      try {
        const storedAttempts = await AsyncStorage.getItem('resendAttempts');
        const attemptsCount = storedAttempts ? parseInt(storedAttempts) : 0;
        setResendAttempts(attemptsCount);
        
        const lastResendTime = await AsyncStorage.getItem('lastResendTime');
        if (lastResendTime) {
          const timeElapsed = Date.now() - parseInt(lastResendTime);
          const cooldownPeriod = 15 * 60 * 1000; // 15 minutes in milliseconds
          
          if (attemptsCount >= 5 && timeElapsed < cooldownPeriod) {
            setResendDisabled(true);
            // Set countdown timer
            const remainingTime = Math.ceil((cooldownPeriod - timeElapsed) / 1000);
            setResendCountdown(remainingTime);
            startCountdownTimer(remainingTime);
          } else if (timeElapsed >= cooldownPeriod) {
            // Reset attempts after cooldown period
            await AsyncStorage.setItem('resendAttempts', '0');
            setResendAttempts(0);
            setResendDisabled(false);
          }
        }
      } catch (error) {
        console.error('Error loading resend attempts:', error);
      }
    };
    
    loadResendAttempts();
  }, []);
  
  // Countdown timer for resend cooldown
  const startCountdownTimer = (seconds) => {
    if (seconds <= 0) {
      setResendDisabled(false);
      setResendCountdown(0);
      return;
    }
    
    const interval = setInterval(() => {
      setResendCountdown((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          clearInterval(interval);
          setResendDisabled(false);
          return 0;
        }
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  };
  
  // Format countdown time as mm:ss
  const formatCountdown = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Check for and load route params
  useEffect(() => {
    if (route.params) {
      if (route.params.email) setEmail(route.params.email);
      if (route.params.password) setPassword(route.params.password);
      if (route.params.verificationCode) setVerificationCode(route.params.verificationCode);
    } 
    // If no route params but global variables exist (from MainNavigator)
    else if (global.userEmail && global.verificationCode) {
      setEmail(global.userEmail);
      setVerificationCode(global.verificationCode);
      
      // Get password from global variable if available
      if (global.tempPassword) {
        setPassword(global.tempPassword);
      }
      
      // Get current session for password-less verification if needed
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          Alert.alert(
            'Error',
            'Session information is missing. Please try signing in again.',
            [{ text: 'OK', onPress: () => navigation.replace('SignInScreen') }]
          );
        }
      });
    } 
    // No params at all
    else {
      Alert.alert(
        'Error',
        'Verification information is missing.',
        [{ text: 'OK', onPress: () => navigation.replace('SignInScreen') }]
      );
    }
    
    // Prevent going back without completing verification
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        handleBackWithoutVerification();
        return true; // Prevent default back action
      }
    );
    
    return () => backHandler.remove(); // Clean up the event listener
  }, [route, navigation]);
  
  // Handle navigation back safely - without completing verification
  const handleBackWithoutVerification = () => {
    // Alert user about the consequences of not verifying
    Alert.alert(
      'Verification Required',
      'You need to verify your email before you can use the app. If you go back, you\'ll need to verify next time you sign in.',
      [
        {
          text: 'Continue Verification',
          style: 'cancel'
        },
        {
          text: 'Go Back',
          onPress: () => {
            // User chose to go back without verifying
            // Sign out the user and navigate back to SignUpScreen
            supabase.auth.signOut().then(() => {
              navigation.replace('SignUpScreen');
            });
          }
        }
      ]
    );
  };
  
  // Show loading screen until we have the required information
  if (!email || !verificationCode) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Loading verification details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Function to resend verification code
  const handleResendCode = async () => {
    // Check if resend is on cooldown
    if (resendDisabled) {
      Alert.alert(
        'Too Many Attempts',
        `Please wait ${formatCountdown(resendCountdown)} before requesting another code.`
      );
      return;
    }
    
    // Prevent duplicate resend requests
    if (resendLoading) {
      console.log('Resend already in progress, ignoring duplicate request');
      return;
    }
    
    setResendLoading(true);
    try {
      // Track resend attempts
      const newAttemptCount = resendAttempts + 1;
      await AsyncStorage.setItem('resendAttempts', newAttemptCount.toString());
      await AsyncStorage.setItem('lastResendTime', Date.now().toString());
      setResendAttempts(newAttemptCount);
      
      // Check if we've hit the limit
      if (newAttemptCount >= 5) {
        setResendDisabled(true);
        const cooldownSeconds = 15 * 60; // 15 minutes
        setResendCountdown(cooldownSeconds);
        startCountdownTimer(cooldownSeconds);
      }
      
      // Use the email service to send a new verification code
      callEmailVerifyFunction(email, (newVerificationCode) => {
        console.log('Verification code resent:', newVerificationCode);
        
        // Update the verification code state
        setVerificationCode(newVerificationCode.toString());
        
        // Update the global variable if it exists
        if (global.verificationCode) {
          global.verificationCode = newVerificationCode.toString();
        }
        
        Alert.alert(
          'Verification Code Sent',
          `A new verification code has been sent to ${email}. Please check your email.`,
          [{ text: 'OK' }]
        );
        
        setResendLoading(false);
      });
    } catch (error) {
      console.error('Error resending code:', error);
      
      // Fallback to locally generated code if email sending fails
      const fallbackCode = Math.floor(1000 + Math.random() * 9000).toString();
      
      // Update the verification code state
      setVerificationCode(fallbackCode);
      
      // Update the global variable if it exists
      if (global.verificationCode) {
        global.verificationCode = fallbackCode;
      }
      
      console.log('Email sending failed. Using fallback code:', fallbackCode);
      
      Alert.alert(
        'Verification Code Generated',
        `We encountered an issue sending the email. Your verification code is: ${fallbackCode}`,
        [{ text: 'OK' }]
      );
      
      setResendLoading(false);
    }
  };

  const handleVerification = async () => {
    if (!enteredCode) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }
    
    // Convert both to strings for type safety in comparison
    const enteredCodeStr = String(enteredCode);
    const verificationCodeStr = String(verificationCode);
    
    if (enteredCodeStr !== verificationCodeStr) {
      console.log('Code mismatch:', enteredCodeStr, '!==', verificationCodeStr);
      Alert.alert('Invalid Code', 'Please enter the correct verification code.');
      return;
    }
    
    setLoading(true);
    try {
      console.log('Starting verification process with code:', enteredCode);
      
      // Get current session or sign in with password if available
      let userId;
      let currentSession = await supabase.auth.getSession();
      
      // If no active session but we have password, try to sign in
      if (!currentSession.data.session && password) {
        console.log('No active session, signing in with credentials');
        const signInResult = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        if (signInResult.error) {
          console.error('Sign in error details:', signInResult.error);
          throw signInResult.error;
        }
        
        userId = signInResult.data.user.id;
      } 
      // Use existing session
      else if (currentSession.data.session) {
        userId = currentSession.data.session.user.id;
      }
      // No session and no password
      else {
        throw new Error('No active session or login credentials available');
      }
      
      console.log("User ID for verification:", userId);

      // Check if user profile exists
      const { data: existingProfile, error: fetchError } = await supabase
        .from('user_profile')
        .select('is_verified')
        .eq('user_uuid', userId)
        .single();
      
      // If user profile doesn't exist, create one with verified status
      if ((fetchError && fetchError.code === 'PGRST116') || !existingProfile) {
        // Create user profile with verified status
        const { error: insertError } = await supabase
          .from('user_profile')
          .insert({
            user_uuid: userId,
            user_email: email,
            created_at: new Date().toISOString(),
            is_verified: true
          });
          
        if (insertError) {
          console.error('Error creating verified user profile:', insertError);
          Alert.alert(
            'Error',
            'There was a problem verifying your account. Please try again.'
          );
          setLoading(false);
          return;
        }
      } 
      // If profile exists but isn't verified, update it
      else if (existingProfile && existingProfile.is_verified === false) {
        // Update existing profile to verified
        const { error: updateError } = await supabase
          .from('user_profile')
          .update({ is_verified: true })
          .eq('user_uuid', userId);
          
        if (updateError) {
          console.error('Error updating verification status:', updateError);
          Alert.alert(
            'Error',
            'There was a problem updating your verification status. Please try again.'
          );
          setLoading(false);
          return;
        }
      }
      // If already verified, nothing to do
      
      // Clear global verification variables
      if (global.verificationCode) delete global.verificationCode;
      if (global.userEmail) delete global.userEmail;
      if (global.tempPassword) delete global.tempPassword;
      
      // Reset resend attempts
      await AsyncStorage.setItem('resendAttempts', '0');
      
      console.log('Verification successful, navigating to HomeScreen');
      
      // Use a more reliable navigation method that works across navigator boundaries
      // Instead of directly resetting to HomeScreen, navigate to SplashScreen
      // which will check verification status and direct to the appropriate screen
      
      // Show success message before navigating
      Alert.alert(
        'Verification Successful',
        'Your email has been verified successfully!',
        [
          { 
            text: 'Continue', 
            onPress: () => {
              // Navigate to SplashScreen which will redirect to HomeScreen
              // based on verification status
              navigation.replace('SplashScreen');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Verification error:', error);
      
      if (error && Object.keys(error).length > 0 && error.message) {
        Alert.alert('Verification Error', error.message);
      } else {
        Alert.alert('Verification Failed', 'Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Email Verification</Text>
        <Text style={styles.subtitle}>
          Enter the 4-digit code sent to {email}
        </Text>
        
        <TextInput
          value={enteredCode}
          onChangeText={setEnteredCode}
          keyboardType="numeric"
          style={styles.input}
          maxLength={4}
          placeholder="Enter verification code"
          editable={!loading}
        />

        <Button
          title={loading ? "Verifying..." : "Verify Code"}
          onPress={handleVerification}
          disabled={loading || !enteredCode}
          containerStyle={styles.button}
        />
        
        <Text 
          style={[
            styles.resendLink, 
            resendDisabled && styles.disabledText
          ]}
          onPress={handleResendCode}
        >
          {resendLoading ? "Sending..." : 
           resendDisabled ? `Try again in ${formatCountdown(resendCountdown)}` : 
           "Didn't receive a code? Resend"}
        </Text>
        
        {resendAttempts > 0 && (
          <Text style={styles.attemptsText}>
            Resend attempts: {resendAttempts}/5
          </Text>
        )}
        
        <Text 
          style={styles.backLink}
          onPress={handleBackWithoutVerification}
        >
          Back to Sign Up
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    marginTop: 16,
  },
  resendLink: {
    textAlign: 'center',
    color: 'blue',
    marginTop: 24,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  disabledText: {
    color: '#999',
    textDecorationLine: 'none',
  },
  attemptsText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    fontSize: 12,
  },
  backLink: {
    textAlign: 'center',
    color: 'blue',
    marginTop: 16,
    textDecorationLine: 'underline',
    fontSize: 14,
  }
});

export default VerificationScreen;