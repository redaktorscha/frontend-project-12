import { io } from 'socket.io-client';

const send = (websocket, eventType) => (payload, getResponseStatus) => {
  websocket.emit(eventType, payload, getResponseStatus);
};

const receive = (websocket, eventType) => (callback) => {
  websocket.on(eventType, callback);
};

// export const addChannel = (websocket, channel, getResponseStatus) => {
//   websocket.emit('newChannel', channel, getResponseStatus);
// };

// export const confirmAddChannel = (websocket, callback) => {
//   websocket.on('newChannel', callback);
// };

// export const renameChannel = (websocket, message, getResponseStatus) => {
//   websocket.emit('renameChannel', message, getResponseStatus);
// };

// export const confirmRenameChannel = (websocket, callback) => {
//   websocket.on('renameChannel', callback);
// };

// export const deleteChannel = (websocket, message, getResponseStatus) => {
//   websocket.emit('removeChannel', message, getResponseStatus);
// };

// export const confirmDeleteChannel = (websocket, callback) => {
//   websocket.on('removeChannel', callback);
// };
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
