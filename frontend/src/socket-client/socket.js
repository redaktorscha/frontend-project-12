import { io } from 'socket.io-client';

export const sendMessage = (websocket, message, getResponseStatus) => {
  websocket.emit('newMessage', message, getResponseStatus);
};

export const receiveMessage = (websocket, callback) => {
  websocket.on('newMessage', callback);
};

export default () => io();
