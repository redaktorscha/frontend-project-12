// ts-check
import React from 'react';
import { createRoot } from 'react-dom/client';
import { io } from 'socket.io-client';
import './styles/index.scss';
import initApp from './init';

(async () => {
  const root = createRoot(document.getElementById('root'));
  const socket = io();

  const AppComponent = await initApp(socket);

  root.render(
    <React.StrictMode>
      {AppComponent}
    </React.StrictMode>,
  );
})();
