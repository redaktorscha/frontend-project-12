import { io } from 'socket.io-client';

export const send = (websocket, event, message, getResponseStatus) => {
  websocket.emit(event, message, getResponseStatus);
};

export const receive = (websocket, event, callback) => {
  websocket.on(event, callback);
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

export default () => io(); // rename -> index.js
