import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import transEn from './locales/en.json';
import transRu from './locales/ru.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: transEn,
      ru: transRu,
    },
    debug: import.meta.env.MODE === '',
    fallbackLng: 'en',
  });
