// ts-check
import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chat from './Chat';
import Login from './Login';
import Signup from './Signup';
import NotFound from './NotFound';
import AuthProvider from './AuthProvider';

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Chat />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;
