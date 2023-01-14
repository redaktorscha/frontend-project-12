const defaultLocale = 'ru';

export default (translations) => ({
  lng: defaultLocale,
  debug: true,
  resources: translations,
  interpolation: {
    escapeValue: false,
  },
});
