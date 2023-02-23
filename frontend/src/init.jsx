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
  const send = (websocket, eventType) => (payload, getResponseStatus) => {
    websocket.emit(eventType, payload, getResponseStatus);
  };

  const receive = (websocket, eventType) => (callback) => {
    websocket.on(eventType, callback);
  };

  const sendMessage = send(socketClient, 'newMessage');
  const receiveMessage = receive(socketClient, 'newMessage');
  const addNewChannel = send(socketClient, 'newChannel');
  const confirmAddNewChannel = receive(socketClient, 'newChannel');
  const renameChannel = send(socketClient, 'renameChannel');
  const confirmRenameChannel = receive(socketClient, 'renameChannel');
  const removeChannel = send(socketClient, 'removeChannel');
  const confirmRemoveChannel = receive(socketClient, 'removeChannel');

  const socketFunctions = {
    sendMessage, addNewChannel, renameChannel, removeChannel,
  };

  const {
    addChannel, setCurrentChannelId, deleteChannel, updateChannel,
  } = channelActions;
  const { addMessage } = messagesActions;

  receiveMessage((payload) => {
    store.dispatch(addMessage({ newMessage: payload }));
  });

  confirmAddNewChannel((payload) => {
    const { id } = payload;
    store.dispatch(addChannel({ channel: payload }));
    store.dispatch(setCurrentChannelId({ currentChannelId: id }));
  });

  confirmRemoveChannel((payload) => {
    const { id } = payload;
    store.dispatch(deleteChannel({ id }));
    store.dispatch(setCurrentChannelId({ currentChannelId: DEFAULT_CHANNEL }));
  });

  confirmRenameChannel((payload) => {
    const { id, name } = payload;
    store.dispatch(updateChannel({ channel: { id, changes: { name } } }));
  });

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
