import { io } from 'socket.io-client';

export default () => {
  const send = (websocket, eventType) => (payload, getResponseStatus) => {
    websocket.emit(eventType, payload, getResponseStatus);
  };

  const receive = (websocket, eventType) => (callback) => {
    websocket.on(eventType, callback);
  };

  const socket = io();

  const sendMessage = send(socket, 'newMessage');
  const receiveMessage = receive(socket, 'newMessage');
  const addNewChannel = send(socket, 'newChannel');
  const confirmAddNewChannel = receive(socket, 'newChannel');
  const renameChannel = send(socket, 'renameChannel');
  const confirmRenameChannel = receive(socket, 'renameChannel');
  const removeChannel = send(socket, 'removeChannel');
  const confirmRemoveChannel = receive(socket, 'removeChannel');

  return {
    sendMessage,
    receiveMessage,
    addNewChannel,
    confirmAddNewChannel,
    renameChannel,
    confirmRenameChannel,
    removeChannel,
    confirmRemoveChannel,
  };
};
