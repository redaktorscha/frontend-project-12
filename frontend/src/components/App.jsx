// ts-check
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Chat from './pages/chat/Chat';
import Login from './pages/login/Login';
import Signup from './pages/signup/Signup';
import NotFound from './pages/notfound/NotFound';
import Layout from './Layout';

const App = () => (
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
);

export default App;
