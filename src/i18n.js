import i18n from 'i18next';
import { useTranslation, initReactI18next } from 'react-i18next';
import enJSON from './locale/en.json';
import deJSON from './locale/de.json';

// Function to retrieve the stored language or fallback to 'de'
const getDefaultLanguage = () => {
  return localStorage.getItem('appLanguage') || 'de';
};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enJSON },
    de: { translation: deJSON },
  },
  lng: getDefaultLanguage(), // Set the initial language based on localStorage or default
  fallbackLng: 'de', // Fallback language if the current language translations are missing
  interpolation: {
    escapeValue: false, // React already safes from XSS
  },
});
