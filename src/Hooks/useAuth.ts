/**
 * @description 
 * Custom hook for managing authentication state.
 * 
 * @dependencies
 * - @supabase/supabase-js: Supabase client
 * 
 * @notes
 * - Handles auth state changes
 * - Provides loading and error states
 * - Manages user session
 */

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User } from '@supabase/supabase-js';

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  error: Error | null;
}

export const useAuth = () => {
  const [state, setState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    session: null,
    error: null,
  });

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setState(prev => ({
        ...prev,
        isLoading: false,
        isAuthenticated: !!session,
        user: session?.user ?? null,
        session,
        error: error ?? null,
      }));
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setState(prev => ({
          ...prev,
          isAuthenticated: !!session,
          user: session?.user ?? null,
          session,
        }));
      }
    );

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return state;
}; 