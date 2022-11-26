import { io } from 'socket.io-client';

export const sendMessage = (websocket, message) => {
  websocket.emit('newMessage', message);
};

export const receiveMessage = (websocket, callback) => {
  websocket.on('newMessage', callback);
};

export default () => {
  const socketClient = io();
  console.log('id:', socketClient.id);
};
