// ts-check
import React from 'react';
import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react';
import { Provider as ReduxProvider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import store from './slices/index.js';
import './styles/index.scss';
import initApp from './init';
import SocketProvider from './components/providers/SocketProvider';
import AuthProvider from './components/providers/AuthProvider';

(async () => {
  const root = createRoot(document.getElementById('root'));

  const { i18n, socketFunctions } = await initApp();

  const NODE_ENV = process.env.NODE_ENV || 'production';
  const IS_DEV_ENV = NODE_ENV === 'development';
  const IS_PROD_ENV = NODE_ENV === 'production';

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
    environment: NODE_ENV,
    enabled: IS_DEV_ENV || IS_PROD_ENV,
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
