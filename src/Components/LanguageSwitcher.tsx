/**
 * @description
 * Language switcher component that allows users to change the app's language.
 * 
 * Key features:
 * - Switches between Indonesian and English
 * - Persists language selection
 * - Updates app UI immediately
 * 
 * @dependencies
 * - react-i18next: For language switching
 * - @react-native-async-storage/async-storage: For persisting language selection
 * 
 * @notes
 * - Uses AsyncStorage to persist language preference
 * - Automatically updates all translated components
 */

import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from './Text';

const LANGUAGE_KEY = '@language';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = async () => {
    const newLang = i18n.language === 'id' ? 'en' : 'id';
    await AsyncStorage.setItem(LANGUAGE_KEY, newLang);
    await i18n.changeLanguage(newLang);
  };

  return (
    <TouchableOpacity onPress={toggleLanguage} style={styles.container}>
      <Text style={styles.text}>
        {i18n.language === 'id' ? 'EN' : 'ID'}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 