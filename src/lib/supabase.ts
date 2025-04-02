/**
 * @description 
 * Supabase client configuration and initialization.
 * 
 * @dependencies
 * - @supabase/supabase-js: Supabase client
 * 
 * @notes
 * - Uses environment variables from Constants
 * - Exports initialized client for use across app
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';
import Constants from 'expo-constants';

// Get Supabase URL and key from Constants
const supabaseUrl = Constants?.manifest?.extra?.EXPO_PUBLIC_SUPABASE_URL || 
                   Constants?.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_URL || 
                   Constants?.extra?.EXPO_PUBLIC_SUPABASE_URL || 
                   '';

const supabaseKey = Constants?.manifest?.extra?.EXPO_PUBLIC_SUPABASE_KEY || 
                   Constants?.expoConfig?.extra?.EXPO_PUBLIC_SUPABASE_KEY || 
                   Constants?.extra?.EXPO_PUBLIC_SUPABASE_KEY || 
                   '';

// Initialize the Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseKey,
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
); 