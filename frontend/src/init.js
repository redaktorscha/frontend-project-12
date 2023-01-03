import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './locales/index.js';
import initSocket from './socket-client';

const defaultLocale = 'ru';

export default async () => {
  const socketFunctions = initSocket();

  i18n
    .use(initReactI18next)
    .init({
      lng: defaultLocale,
      debug: true,
      resources,
      interpolation: {
        escapeValue: false,
      },
    });

  return { i18n, socketFunctions };
};
