/**
 * @description
 * Custom hook for managing app language settings.
 * 
 * Key features:
 * - Get/Set current language
 * - Load saved language preference
 * - Persist language changes
 * 
 * @dependencies
 * - react-i18next: For language management
 * - @react-native-async-storage/async-storage: For persistence
 * 
 * @notes
 * - Automatically handles persistence
 * - Provides loading state for initial load
 */

import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LANGUAGE_KEY = '@language';

export const useLanguage = () => {
  const { i18n } = useTranslation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSavedLanguage();
  }, []);

  const loadSavedLanguage = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem(LANGUAGE_KEY);
      if (savedLanguage) {
        await i18n.changeLanguage(savedLanguage);
      }
    } catch (error) {
      console.error('Error loading language:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setLanguage = async (language: 'en' | 'id') => {
    try {
      await AsyncStorage.setItem(LANGUAGE_KEY, language);
      await i18n.changeLanguage(language);
      return true;
    } catch (error) {
      console.error('Error setting language:', error);
      return false;
    }
  };

  return {
    currentLanguage: i18n.language as 'en' | 'id',
    isLoading,
    setLanguage,
  };
}; 