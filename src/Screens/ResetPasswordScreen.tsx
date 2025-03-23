import React, { useState, useEffect } from "react";
import { Alert, SafeAreaView, Text, StyleSheet, View, TextInput, TouchableOpacity } from "react-native";
import CustomForm from '../Components/Forms/FormInput';
import { FormField, ResetPasswordScreenRouteProp } from '../Types/types';
import { useForm } from 'react-hook-form';
import supabase from "@config/supabase";
import { useNavigation, useRoute } from '@react-navigation/native';

interface ResetPasswordForm {
  newPassword: string;
  confirmPassword: string;
}

const ResetPasswordScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<ResetPasswordScreenRouteProp>();
  const [loading, setLoading] = useState(false);
  const [codeVerified, setCodeVerified] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const [userInputCode, setUserInputCode] = useState('');
  const [submittedCode, setSubmittedCode] = useState(false);

  // Get email and verification code from route params
  const { email, verificationCode } = route.params || {};

  const { control, handleSubmit, watch, formState: { isValid, isDirty } } = useForm<ResetPasswordForm>({
    mode: 'onChange',
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    }
  });

  // Verify the code entered by the user
  const verifyCode = () => {
    if (!userInputCode || !verificationCode) {
      setResetError('Please enter the verification code sent to your email');
      return;
    }

    if (userInputCode === verificationCode) {
      // Code is correct
      setCodeVerified(true);
      setResetError('');
    } else {
      // Code is incorrect
      setResetError('Invalid verification code. Please check and try again.');
    }
    setSubmittedCode(true);
  };

  // Handle password reset
  const handleResetPassword = async (data: ResetPasswordForm) => {
    setLoading(true);
    setResetError('');
    
    try {
      if (!email) {
        setResetError('Email address is missing. Please try again from the login screen.');
        setLoading(false);
        return;
      }
      
      // We've already verified the code, so we don't need to check it again
      // The user can only reach this form if the code was correctly verified
      
      // Try to get current user using the email
      const { data: userData, error: userError } = await supabase.auth.signInWithPassword({
        email: email,
        // We'll use a dummy password here just to check the response
        password: data.newPassword
      });
      
      // If sign-in succeeds with the new password, it means the new password is the same as the old one
      if (userData && userData.user) {
        setResetError('Your new password cannot be the same as your current password');
        setLoading(false);
        return;
      }
      
      // Use resetPasswordForEmail to initiate password reset
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email);
      
      if (resetError) {
        console.error('Password reset initiation error:', resetError);
        setResetError('Failed to reset password. Please try again.');
        setLoading(false);
        return;
      }
      
      // Now use the session to update the user's password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.newPassword
      });
      
      if (updateError) {
        console.error('Password update error:', updateError);
        setResetError(updateError.message || 'Failed to update password. Please try again.');
        setLoading(false);
        return;
      }
      
      // Password reset successful
      setResetSuccess(true);
      Alert.alert(
        'Password Reset Successful',
        'Your password has been reset successfully. You can now sign in with your new password.',
        [
          { 
            text: 'Sign In',
            onPress: () => navigation.navigate('SignInScreen' as never)
          }
        ]
      );
      
    } catch (err) {
      console.error('Password reset unexpected error:', err);
      setResetError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // First verification step - enter the code
  if (!codeVerified && !submittedCode) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Verify Your Email</Text>
        <Text style={styles.subheader}>
          We've sent a verification code to {email}. Please enter the code below.
        </Text>
        
        {resetError ? (
          <Text style={styles.errorText}>{resetError}</Text>
        ) : null}
        
        <View style={styles.codeContainer}>
          <Text style={styles.label}>Verification Code</Text>
          <TextInput
            style={[styles.input, resetError ? styles.inputError : null]}
            value={userInputCode}
            onChangeText={(text) => {
              setUserInputCode(text);
              if (resetError) setResetError('');
            }}
            placeholder="Enter your verification code"
            keyboardType="numeric"
            maxLength={6}
          />
          
          <TouchableOpacity
            style={[styles.button, styles.verifyButton, loading && styles.disabledButton]}
            onPress={verifyCode}
            disabled={loading || !userInputCode}
          >
            <Text style={styles.buttonText}>
              {loading ? "Verifying..." : "Verify Code"}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }
  
  // If code was submitted but incorrect
  if (submittedCode && !codeVerified) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.header}>Verification Failed</Text>
        
        <Text style={styles.errorText}>{resetError || 'The verification code is incorrect.'}</Text>
        
        <View style={styles.codeContainer}>
          <Text style={styles.label}>Verification Code</Text>
          <TextInput
            style={[styles.input, styles.inputError]}
            value={userInputCode}
            onChangeText={(text) => {
              setUserInputCode(text);
              if (resetError) setResetError('');
            }}
            placeholder="Enter your verification code"
            keyboardType="numeric"
            maxLength={6}
          />
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.verifyButton, loading && styles.disabledButton]}
              onPress={verifyCode}
              disabled={loading || !userInputCode}
            >
              <Text style={styles.buttonText}>
                {loading ? "Verifying..." : "Try Again"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }
  
  // Password reset form after successful code verification
  const formFields: FormField[] = [
    { 
      name: 'newPassword',
      label: 'New Password',
      placeholder: 'Enter your new password',
      rules: { 
        required: 'New Password is required',
        minLength: {
          value: 6,
          message: 'Password must be at least 6 characters'
        }
      },
      secureTextEntry: true,
    },
    { 
      name: 'confirmPassword',
      label: 'Confirm Password',
      placeholder: 'Confirm your new password',
      rules: { 
        required: 'Please confirm your password',
        validate: (value) => value === watch('newPassword') || 'Passwords do not match'
      },
      secureTextEntry: true,
    }
  ];
  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Reset Password</Text>
      <Text style={styles.subheader}>Please enter your new password below</Text>
      
      {resetError ? (
        <Text style={styles.errorText}>{resetError}</Text>
      ) : null}
      
      {resetSuccess ? (
        <View style={styles.successContainer}>
          <Text style={styles.successText}>
            Your password has been reset successfully!
          </Text>
          <Text style={styles.instructionText}>
            You can now sign in with your new password.
          </Text>
        </View>
      ) : (
        <CustomForm 
          fields={formFields}
          control={control}
          onSubmit={handleSubmit(handleResetPassword)}
          submitButtonText={loading ? "Resetting..." : "Reset Password"}
          disabled={!isValid || !isDirty || loading}
        />
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
  header: {
    fontSize: 24,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
  },
  subheader: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
    padding: 8,
    backgroundColor: '#FFEEEE',
    borderRadius: 4,
  },
  successContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    alignItems: 'center',
  },
  successText: {
    color: '#2E7D32',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  instructionText: {
    color: '#555',
    fontSize: 14,
    textAlign: 'center',
  },
  codeContainer: {
    marginTop: 16,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    fontSize: 18,
    letterSpacing: 2,
    backgroundColor: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputError: {
    borderColor: 'red',
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  verifyButton: {
    backgroundColor: '#007AFF',
  },
  cancelButton: {
    backgroundColor: '#ccc',
  },
  disabledButton: {
    backgroundColor: '#99CCFF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ResetPasswordScreen; 