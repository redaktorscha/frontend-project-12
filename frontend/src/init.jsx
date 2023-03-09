import i18n from 'i18next';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import filter from 'leo-profanity';
import store from './slices/index.js';
import App from './components/App';
import ChatApiProvider from './components/providers/ChatApiProvider';
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

  const sendMessage = async (payload) => new Promise((resolve, reject) => {
    socketClient.timeout(3000).emit('newMessage', payload, (error) => {
      if (error) {
        reject(new Error('network error'));
        return;
      }
      resolve();
    });
  });

  socketClient.on('newMessage', (payload) => {
    store.dispatch(addMessage({ newMessage: payload }));
  });

  const addNewChannel = async (payload) => new Promise((resolve, reject) => {
    socketClient.timeout(3000).emit('newChannel', payload, (error, response) => {
      if (error) {
        reject(new Error('network error'));
        return;
      }

      const { data } = response;
      store.dispatch(setCurrentChannelId({ currentChannelId: data.id }));
      resolve();
    });
  });

  socketClient.on('newChannel', (payload) => {
    store.dispatch(addChannel({ channel: payload }));
  });

  const renameChannel = async (payload) => new Promise((resolve, reject) => {
    socketClient.timeout(3000).emit('renameChannel', payload, (error) => {
      if (error) {
        reject(new Error('network error'));
        return;
      }
      resolve();
    });
  });

  socketClient.on('renameChannel', (payload) => {
    const { id, name } = payload;
    store.dispatch(updateChannel({ channel: { id, changes: { name } } }));
  });

  const removeChannel = async (payload) => new Promise((resolve, reject) => {
    socketClient.timeout(3000).emit('removeChannel', payload, (error) => {
      if (error) {
        reject(new Error('network error'));
        return;
      }
      resolve();
    });
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
              <ChatApiProvider functions={socketFunctions}>
                <App />
              </ChatApiProvider>
            </AuthProvider>
          </I18nextProvider>
        </ReduxProvider>
      </ErrorBoundary>
    </RollbarProvider>
  );
};
