import i18n from 'i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import filter from 'leo-profanity';
import store from './slices/index.js';
import App from './components/App';
import ApiProvider from './components/providers/ApiProvider';
import AuthProvider from './components/providers/AuthProvider';
import resources from './locales';

import {
  actions as channelActions,
} from './slices/channelsSlice.js';
import { actions as messagesActions } from './slices/messagesSlice.js';

const DEFAULT_CHANNEL = 1;
const DEFAULT_LOCALE = 'ru';

export default async (socketClient) => {
  const {
    addChannel, setCurrentChannelId, deleteChannel, updateChannel,
  } = channelActions;
  const { addMessage } = messagesActions;

  const acknowledgementCallback = (responseStatus, errorMessage) => {
    if (responseStatus === 'ok') {
      return;
    }
    throw new Error(errorMessage);
  };

  const sendMessage = (payload) => socketClient.emit('newMessage', payload, (response) => {
    const { status } = response;
    acknowledgementCallback(status);
  });

  socketClient.on('newMessage', (payload) => {
    store.dispatch(addMessage({ newMessage: payload }));
  });

  const addNewChannel = (payload) => socketClient.emit('newChannel', payload, (response) => {
    const { status, data } = response;
    acknowledgementCallback(status);
    store.dispatch(setCurrentChannelId({ currentChannelId: data.id }));
  });

  socketClient.on('newChannel', (payload) => {
    store.dispatch(addChannel({ channel: payload }));
  });

  const renameChannel = (payload) => socketClient.emit('renameChannel', payload, (response) => {
    const { status } = response;
    acknowledgementCallback(status);
  });

  socketClient.on('renameChannel', (payload) => {
    const { id, name } = payload;
    store.dispatch(updateChannel({ channel: { id, changes: { name } } }));
  });

  const removeChannel = (payload) => socketClient.emit('removeChannel', payload, (response) => {
    const { status } = response;
    acknowledgementCallback(status);
  });

  socketClient.on('removeChannel', (payload) => {
    const { currentChannelId } = store.getState().channels;
    const { id } = payload;
    store.dispatch(deleteChannel({ id }));
    if (id === currentChannelId) {
      store.dispatch(setCurrentChannelId({ currentChannelId: DEFAULT_CHANNEL }));
    }
  });

  const socketFunctions = {
    sendMessage, addNewChannel, renameChannel, removeChannel,
  };

  await i18n
    .use(initReactI18next)
    .init({
      lng: DEFAULT_LOCALE,
      debug: true,
      resources,
      interpolation: {
        escapeValue: false,
      },
    });

  const availableLocales = ['en', 'ru'];
  availableLocales.forEach((locale) => filter.add(filter.getDictionary(locale)));

  const NODE_ENV = process.env.NODE_ENV || 'production';
  const IS_DEV_ENV = NODE_ENV === 'development';
  const IS_PROD_ENV = NODE_ENV === 'production';

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
    environment: NODE_ENV,
    enabled: IS_DEV_ENV || IS_PROD_ENV,
  };

  return (
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        <ReduxProvider store={store}>
          <I18nextProvider i18n={i18n}>
            <AuthProvider>
              <ApiProvider functions={socketFunctions}>
                <App />
              </ApiProvider>
            </AuthProvider>
          </I18nextProvider>
        </ReduxProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};
