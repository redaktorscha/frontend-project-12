// ts-check
import React from 'react';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import store from './slices/index.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import initApp from './init';
import SocketProvider from './components/SocketProvider';
import AuthProvider from './components/AuthProvider';

(async () => {
  const root = createRoot(document.getElementById('root'));

  const { i18n, socketFunctions } = await initApp();

  const rollbarConfig = {
    accessToken: process.env.ROLLBAR_APP_ACCESS_TOKEN,
    environment: 'production',
  };

  root.render(
    <React.StrictMode>
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary>
          <ReduxProvider store={store}>
            <I18nextProvider i18n={i18n}>
              <AuthProvider>
                <SocketProvider functions={socketFunctions}>
                  <App />
                </SocketProvider>
              </AuthProvider>
            </I18nextProvider>
          </ReduxProvider>
        </ErrorBoundary>
      </RollbarProvider>
    </React.StrictMode>,
  );
})();
