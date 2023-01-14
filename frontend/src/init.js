import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import filter from 'leo-profanity';
import resources from './locales';
import initSocket from './socket-client';
import getI18nConfig from './utils/getI18nConfig';

export default async () => {
  const socketFunctions = initSocket();
  const i18nConfig = getI18nConfig(resources);

  i18n
    .use(initReactI18next)
    .init(i18nConfig);

  const availableLocales = ['en', 'ru'];
  availableLocales.forEach((locale) => filter.add(filter.getDictionary(locale)));

  return { i18n, socketFunctions };
};
