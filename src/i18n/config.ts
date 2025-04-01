/**
 * @description 
 * Internationalization configuration using i18next.
 * 
 * Key features:
 * - Multiple language support (ID, EN)
 * - Namespace support
 * - Fallback handling
 * 
 * @dependencies
 * - i18next: Core internationalization framework
 * - react-i18next: React bindings for i18next
 * - expo-localization: Device locale detection
 * 
 * @notes
 * - Uses device locale as initial language
 * - Fallbacks to Indonesian if translation missing
 */

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import en from './locales/en.json';
import id from './locales/id.json';

const resources = {
  en: {
    translation: en,
  },
  id: {
    translation: id,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: Localization.locale.startsWith('id') ? 'id' : 'en',
    fallbackLng: 'id',
    interpolation: {
      escapeValue: false,
    },
    compatibilityJSON: 'v3',
  });

export default i18n; 