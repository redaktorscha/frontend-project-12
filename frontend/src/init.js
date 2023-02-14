import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import filter from 'leo-profanity';
import store from './slices/index.js';
import resources from './locales';
import initSocket from './socket-client';
import {
  actions as channelActions,
} from './slices/channelsSlice.js';
import { actions as messagesActions } from './slices/messagesSlice.js';

const DEFAULT_CHANNEL = 1;
const DEFAULT_LOCALE = 'ru';

export default async () => {
  const socketFunctions = initSocket();
  const {
    sendMessage,
    receiveMessage,
    addNewChannel,
    confirmAddNewChannel,
    renameChannel,
    confirmRenameChannel,
    removeChannel,
    confirmRemoveChannel,
  } = socketFunctions;

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

  i18n
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

  return {
    i18n,
    socketFunctions: {
      sendMessage, addNewChannel, renameChannel, removeChannel,
    },
    store,
  };
};
