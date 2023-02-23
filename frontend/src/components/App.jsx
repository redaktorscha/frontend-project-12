// ts-check
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chat from './Chat';
import Login from './Login';
import Signup from './Signup';
import NotFound from './NotFound';
import Layout from './Layout';
import PrivateRoute from './PrivateRoute';
import appRoutes from '../utils/routes.js';

const App = () => {
  const loginRoute = appRoutes.loginPath();
  const signupRoute = appRoutes.signupPath();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route
            path="/"
            element={(
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
          )}
          />
          <Route path={loginRoute} element={<Login />} />
          <Route path={signupRoute} element={<Signup />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
