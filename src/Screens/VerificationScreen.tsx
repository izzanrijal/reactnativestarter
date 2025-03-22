import Button from '@components/Buttons/Button';
import supabase from '@config/supabase';
import React, { useEffect, useState } from 'react';
import { Alert, SafeAreaView, Text, StyleSheet, TextInput, View, BackHandler } from 'react-native';

const VerificationScreen = ({ route, navigation }) => {
  const [enteredCode, setEnteredCode] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Check if route params exist
  useEffect(() => {
    if (!route.params) {
      Alert.alert(
        'Error',
        'Verification information is missing.',
        [{ text: 'OK', onPress: () => navigation.replace('SignInScreen') }]
      );
      return;
    }
    
    // Prevent going back without completing verification
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        navigation.replace('SignUpScreen');
        return true; // Prevent default back action
      }
    );
    
    return () => backHandler.remove(); // Clean up the event listener
  }, [route, navigation]);
  
  // Only proceed if route.params exists
  if (!route.params) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }
  
  const { email, password, verificationCode } = route.params;

  const handleVerification = async () => {
    if (!enteredCode) {
      Alert.alert('Error', 'Please enter the verification code');
      return;
    }
    
    // Log code types for debugging
    console.log('Code types check:', {
      enteredCode: enteredCode,
      enteredCodeType: typeof enteredCode,
      parsedEnteredCode: parseInt(enteredCode),
      parsedEnteredCodeType: typeof parseInt(enteredCode),
      verificationCode: verificationCode,
      verificationCodeType: typeof verificationCode
    });
    
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
      console.log('Starting verification process with code:', enteredCode, 'expected:', verificationCode);
      
      // Sign in with Supabase
      let signInData, signInError;
      try {
        const signInResult = await supabase.auth.signInWithPassword({
          email,
          password
        });
        signInData = signInResult.data;
        signInError = signInResult.error;
      } catch (signInException) {
        console.error('Exception during sign in:', signInException);
        throw signInException;
      }
       
      console.log('Sign in response:', JSON.stringify({ data: signInData || 'null', error: signInError || 'null' }));
       
      if (signInError) {
        console.error('Sign in error details:', JSON.stringify(signInError));
        throw signInError;
      }
       
      const userId = signInData.user.id;
      console.log("User ID:", userId);

      // If we got here, authentication was successful, so try to create the profile
      // but don't prevent navigation to HomeScreen if profile creation fails
      let profileCreationFailed = false;
      let profileErrorMsg = '';

      // First check if user profile already exists
      console.log('Checking if user profile exists for:', userId);
      
      let existingProfile, fetchError;
      try {
        const profileResult = await supabase
          .from('user_profile')
          .select('*')
          .eq('user_uuid', userId)
          .single();
        existingProfile = profileResult.data;
        fetchError = profileResult.error;
      } catch (fetchException) {
        console.error('Exception during profile check:', fetchException);
        // Continue even if fetch fails - we'll just try to create the profile
        fetchError = { message: 'Exception during fetch: ' + String(fetchException) };
      }
         
      console.log('Existing profile check:', JSON.stringify({
        exists: !!existingProfile,
        data: existingProfile || null,
        error: fetchError || null
      }));
        
      // Only create profile if it doesn't exist
      if (!existingProfile) {
        console.log('No existing profile found, creating new profile for:', email);
        
        let profileData, profileError;
        try {
          const profileResult = await supabase
            .from('user_profile')
            .insert({
              user_uuid: userId,
              user_email: email,
              created_at: new Date().toISOString()
            })
            .select();
          profileData = profileResult.data;
          profileError = profileResult.error;
        } catch (profileException) {
          console.error('Exception during profile creation:', profileException);
          profileError = { message: 'Exception during profile creation: ' + String(profileException) };
        }
          
        console.log('Profile creation response:', JSON.stringify({ data: profileData || 'null', error: profileError || 'null' }));
        
        // Handle empty error objects as well as real errors
        if (profileError) {
          // Check if the error object is empty
          const isEmptyError = !profileError.message && 
                               !profileError.code && 
                               Object.keys(profileError).length === 0;
          
          if (isEmptyError) {
            console.log('Empty error object received, assuming profile creation was successful');
            // Don't count this as an error, just proceed
          } else {
            console.error('Profile creation error details:', JSON.stringify(profileError));
            
            // Check if it's a unique constraint error (user already exists)
            if (profileError.code === '23505' || (profileError.message && profileError.message.includes('unique constraint'))) {
              console.log('User profile already exists, proceeding to home screen');
              // Don't throw error, just continue to home screen
            } else if (profileError.message && profileError.message.includes('Exception during profile creation')) {
              console.log('Profile creation exception, but proceeding to home screen');
              // We logged the error above, but we'll proceed anyway since the user auth is valid
            } else {
              profileCreationFailed = true;
              // Make sure we have a valid error message
              profileErrorMsg = profileError.message || 'Unknown profile creation error';
              console.log('Profile creation failed but proceeding to home screen. Error:', profileErrorMsg);
            }
          }
        }
      } else {
        console.log('User profile already exists, proceeding to home screen');
      }
      
      // Even if profile creation failed but authentication succeeded, navigate to HomeScreen
      if (profileCreationFailed) {
        console.warn('Proceeding to HomeScreen despite profile creation issue:', profileErrorMsg || 'Unknown error');
      }
      
      console.log('Verification successful, navigating to HomeScreen');
      navigation.replace('HomeScreen');
    } catch (error) {
      console.error('Verification error:', error);
      console.error('Error type:', typeof error);
      console.error('Error stringified:', JSON.stringify(error));
      
      // This catch block should now only handle critical auth errors
      // since we're handling profile creation errors separately
      
      // Only show alert if there's an actual error message
      if (error && Object.keys(error).length > 0 && error.message) {
        Alert.alert(
          'Authentication Error',
          error.message || 'An error occurred during sign in'
        );
      } else {
        // If error object is empty but an exception was caught, show generic message
        Alert.alert(
          'Authentication Failed',
          'There was a problem signing in. Please try again.'
        );
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
          style={styles.backLink}
          onPress={() => navigation.replace('SignUpScreen')}
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
  backLink: {
    textAlign: 'center',
    color: 'blue',
    marginTop: 16,
    textDecorationLine: 'underline',
    fontSize: 14,
  }
});

export default VerificationScreen;