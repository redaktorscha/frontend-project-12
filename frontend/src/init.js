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

const DEFAULT_CHANNEL = 1;

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
    store.dispatch(addMessage({ newMessage: payload }));
  });

  confirmAddNewChannel((payload) => {
    const { id } = payload;
    store.dispatch(addChannel({ newChannel: payload }));
    store.dispatch(setCurrentChannelId({ currentChannelId: id }));
  });

  confirmRemoveChannel((payload) => {
    const { id } = payload;
    store.dispatch(deleteChannel({ channelForRemoveId: id }));
    store.dispatch(setCurrentChannelId({ currentChannelId: DEFAULT_CHANNEL }));
  });

  confirmRenameChannel((payload) => {
    const { id, name } = payload;
    store.dispatch(updateChannel({ updateChannelData: { id, changes: { name } } }));
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
