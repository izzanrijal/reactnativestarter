/**
 * @description 
 * Supabase client configuration and initialization.
 * 
 * @dependencies
 * - @supabase/supabase-js: Supabase client
 * 
 * @notes
 * - Uses environment variables for configuration
 * - Exports initialized client for use across app
 */

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import 'react-native-url-polyfill/auto';

// Initialize the Supabase client
export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL || '',
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
); 