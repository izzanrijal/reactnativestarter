/**
 * @description 
 * Form component for completing user profile after signup.
 * 
 * @dependencies
 * - react-native: Core components
 * - @supabase/supabase-js: Database operations
 * - expo-image-picker: Profile photo upload
 * 
 * @notes
 * - Handles profile photo upload
 * - Validates required fields
 * - Updates user profile in Supabase
 */

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../lib/supabase';
import { theme } from '../../Config/theme';
import { ProfilePhotoUpload } from './ProfilePhotoUpload';

interface ProfileCompletionFormProps {
  onComplete: () => void;
}

interface ProfileData {
  full_name: string;
  phone_number: string;
  address: string;
  photo_url?: string;
}

export const ProfileCompletionForm: React.FC<ProfileCompletionFormProps> = ({ onComplete }) => {
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    phone_number: '',
    address: '',
  });

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const validateForm = () => {
    if (!profileData.full_name.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }
    if (!profileData.phone_number.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return false;
    }
    if (!profileData.address.trim()) {
      Alert.alert('Error', 'Please enter your address');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;

      onComplete();
    } catch (error) {
      Alert.alert('Error', 'Failed to update profile. Please try again.');
      console.error('Profile update error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Profile</Text>
      
      <ProfilePhotoUpload
        onPhotoSelected={(url) => handleInputChange('photo_url', url)}
      />

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={profileData.full_name}
        onChangeText={(value) => handleInputChange('full_name', value)}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Phone Number"
        value={profileData.phone_number}
        onChangeText={(value) => handleInputChange('phone_number', value)}
        keyboardType="phone-pad"
      />

      <TextInput
        style={[styles.input, styles.addressInput]}
        placeholder="Address"
        value={profileData.address}
        onChangeText={(value) => handleInputChange('address', value)}
        multiline
        numberOfLines={3}
      />

      <TouchableOpacity 
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color={theme.colors.neutral.white} />
        ) : (
          <Text style={styles.buttonText}>Complete Profile</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: theme.colors.neutral.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.neutral.gray200,
  },
  addressInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: theme.colors.primary.main,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: theme.colors.neutral.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 