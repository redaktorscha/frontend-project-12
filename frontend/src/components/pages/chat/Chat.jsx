/* eslint-disable react-hooks/exhaustive-deps */
// ts-check
import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';
import { useRollbar } from '@rollbar/react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Container, Row } from 'react-bootstrap';

import Sidebar from './Sidebar';
import Main from './Main';

import AuthContext from '../../../contexts/AuthContext';
import SocketContext from '../../../contexts/SocketContext';
import {
  setChannels, addChannel, updateChannel, deleteChannel,
} from '../../../slices/channelsSlice.js';
import { setCurrentChannel } from '../../../slices/currentChannelSlice.js';
import { setMessages, addMessage } from '../../../slices/messagesSlice.js';

import getRoute from '../../../utils/getRoute.js';
import getAuthConfig from '../../../utils/getAuthConfig.js';

const Chat = () => {
  const { user } = useContext(AuthContext);
  const {
    receiveMessage, confirmAddChannel, confirmRemoveChannel, confirmRenameChannel,
  } = useContext(SocketContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const rollbar = useRollbar();

  useEffect(() => {
    receiveMessage((payload) => {
      dispatch(addMessage(payload));
    });
  }, []);

  useEffect(() => {
    confirmAddChannel((payload) => {
      const { id } = payload;
      dispatch(addChannel(payload));
      dispatch(setCurrentChannel(id));
    });
  }, []);

  useEffect(() => {
    confirmRemoveChannel((payload) => {
      const { id } = payload;
      dispatch(deleteChannel(id));
      dispatch(setCurrentChannel(1));
    });
  }, []);

  useEffect(() => {
    confirmRenameChannel((payload) => {
      const { id, name } = payload;
      dispatch(updateChannel({ id, changes: { name } }));
    });
  }, []);

  useEffect(() => {
    const initChat = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      const dataRoute = getRoute('data');

      try {
        const authConfig = getAuthConfig(user.token);
        const response = await axios.get(dataRoute, authConfig);
        const { data } = response;
        if (data) {
          dispatch(setChannels(data.channels));
          dispatch(setCurrentChannel(data.currentChannelId));
          dispatch(setMessages(data.messages));
        }
      } catch (e) {
        rollbar.error('getChatDataErr', e);
        navigate('/login');
      }
    };

    initChat();
  }, [user, dispatch]);

  return (
    user
      && (
        <Container className="h-100 overflow-hidden rounded shadow">
          <Row className="bg-white h-100 flex-md-row">
            <Sidebar />
            <Main />
          </Row>
        </Container>
      )
  );
};
export default Chat;
