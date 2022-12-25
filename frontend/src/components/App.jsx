// ts-check
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chat from './Chat';
import Login from './Login';
import Signup from './Signup';
import NotFound from './NotFound';
import SocketProvider from './SocketProvider';
import AuthProvider from './AuthProvider';
import Layout from './Layout';

const App = () => (
  <AuthProvider>
    <SocketProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Chat />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SocketProvider>
  </AuthProvider>

);

export default App;
