import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import resources from './locales/index.js';
import initSocket from './socket-client';

const defaultLocale = 'ru';

export default async () => {
  // yup.setLocale({
  //   mixed: {
  //     notOneOf: 'notOneOf',
  //     required: 'required',
  //   },
  //   string: {
  //     url: 'url',
  //   },
  // });
  // const loginSchema = yup
  //   .object()
  //   .shape({
  //     username: yup
  //       .string()
  //       .trim()
  //       .required(),
  //     password: yup
  //       .string()
  //       .trim()
  //       .required(),
  //   });

  // const signupSchema = yup
  //   .object()
  //   .shape({
  //     username: yup
  //       .string()
  //       .trim()
  //       .required()
  //       .min(3)
  //       .max(20),
  //     password: yup
  //       .string()
  //       .trim()
  //       .required()
  //       .min(6),
  //     confirmPassword: yup
  //       .string()
  //       .trim()
  //       .required()
  //       .oneOf([yup.ref('password'), null], 'Passwords must match'),
  //   });

  // const addMessageSchema = yup
  //   .object()
  //   .shape({
  //     message: yup
  //       .string()
  //       .trim()
  //       .required(),
  //   });

  // const addChannelSchema = yup
  //   .object()
  //   .shape({
  //     channelName: yup
  //       .string()
  //       .trim()
  //       .min(3)
  //       .max(20)
  //       .required('required')
  //       .notOneOf(channelsNames, 'channel name should be unique'),
  //   });

  // const renameChannelSchema = yup
  //   .object()
  //   .shape({
  //     channelName: yup
  //       .string()
  //       .trim()
  //       .min(3)
  //       .max(20)
  //       .required('required')
  //       .notOneOf(channelsNames, 'channel name should be unique'),
  //   });

  // const yupSchemas = {
  //   loginSchema,
  //   signupSchema,
  //   addMessageSchema,
  // addChannelSchema,
  // renameChannelSchema,

  // };
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
