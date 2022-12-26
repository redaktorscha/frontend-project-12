// ts-check
import React from 'react';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';
import { createRoot } from 'react-dom/client';
import App from './components/App';
import store from './slices/index.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import initApp from './init';

(async () => {
  const root = createRoot(document.getElementById('root'));

  const { i18n } = await initApp();

  root.render(
    <React.StrictMode>
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <App />
        </I18nextProvider>
      </Provider>
    </React.StrictMode>,
  );
})();
