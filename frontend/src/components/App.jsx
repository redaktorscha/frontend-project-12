// ts-check
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chat from './chat/Chat';
import Login from './login/Login';
import Signup from './signup/Signup';
import NotFound from './notfound/NotFound';
import Layout from './Layout';
import PrivateRoute from './PrivateRoute';

const App = () => (
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
