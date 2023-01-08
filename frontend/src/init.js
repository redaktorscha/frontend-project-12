import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import filter from 'leo-profanity';
import resources from './locales';
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

  filter.loadDictionary(defaultLocale);

  return { i18n, socketFunctions };
};
