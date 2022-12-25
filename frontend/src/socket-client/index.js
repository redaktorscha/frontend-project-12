import { io } from 'socket.io-client';

const send = (websocket, eventType) => (payload, getResponseStatus) => {
  websocket.emit(eventType, payload, getResponseStatus);
};

const receive = (websocket, eventType) => (callback) => {
  websocket.on(eventType, callback);
};

const socket = io();

const sendMessage = send(socket, 'newMessage');
const receiveMessage = receive(socket, 'newMessage');
const addChannel = send(socket, 'newChannel');
const confirmAddChannel = receive(socket, 'newChannel');
const renameChannel = send(socket, 'renameChannel');
const confirmRenameChannel = receive(socket, 'renameChannel');
const removeChannel = send(socket, 'removeChannel');
const confirmRemoveChannel = receive(socket, 'removeChannel');

export default {
  sendMessage,
  receiveMessage,
  addChannel,
  confirmAddChannel,
  renameChannel,
  confirmRenameChannel,
  removeChannel,
  confirmRemoveChannel,
};
