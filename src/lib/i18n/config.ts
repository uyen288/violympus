import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonVi from './resources/vi/common.json';
import commonEn from './resources/en/common.json';
import authVi from './resources/vi/auth.json';
import authEn from './resources/en/auth.json';
import navigationVi from './resources/vi/navigation.json';
import navigationEn from './resources/en/navigation.json';
import errorsVi from './resources/vi/errors.json';
import errorsEn from './resources/en/errors.json';

const savedLocale = localStorage.getItem('violympus_locale');
const browserLocale = navigator.language?.startsWith('vi') ? 'vi' : 'en';
const defaultLocale = savedLocale ?? browserLocale ?? 'vi';

i18n.use(initReactI18next).init({
  resources: {
    vi: {
      common: commonVi,
      auth: authVi,
      navigation: navigationVi,
      errors: errorsVi,
    },
    en: {
      common: commonEn,
      auth: authEn,
      navigation: navigationEn,
      errors: errorsEn,
    },
  },
  lng: defaultLocale,
  fallbackLng: 'vi',
  defaultNS: 'common',
  ns: ['common', 'auth', 'navigation', 'errors'],
  interpolation: {
    escapeValue: false,
  },
  react: {
    useSuspense: false,
  },
});

export default i18n;
