import { createI18n } from 'vue-i18n';
import en from './locales/en';
import fr from './locales/fr';

const messages = {
  en,
  fr,
};

const i18n = createI18n({
  legacy: false, 
  locale: 'en', 
  fallbackLocale: 'fr', 
  messages, 
});

export default i18n;

