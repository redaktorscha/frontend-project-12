import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import filter from 'leo-profanity';
import store from './slices/index.js';
import resources from './locales';
import initSocket from './socket-client';
import getI18nConfig from './utils/getI18nConfig';
import { addMessage } from './slices/messagesSlice.js';
import {
  addChannel, updateChannel, deleteChannel, setCurrentChannelId,
} from './slices/channelsSlice.js';

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

  receiveMessage((payload) => {
    store.dispatch(addMessage(payload));
  });

  confirmAddNewChannel((payload) => {
    const { id } = payload;
    store.dispatch(addChannel(payload));
    store.dispatch(setCurrentChannelId(id));
  });

  confirmRemoveChannel((payload) => {
    const { id } = payload;
    store.dispatch(deleteChannel(id));
    store.dispatch(setCurrentChannelId(1));
  });

  confirmRenameChannel((payload) => {
    const { id, name } = payload;
    store.dispatch(updateChannel({ id, changes: { name } }));
  });

  const i18nConfig = getI18nConfig(resources);
  i18n
    .use(initReactI18next)
    .init(i18nConfig);

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
