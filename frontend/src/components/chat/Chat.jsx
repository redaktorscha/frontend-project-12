/* eslint-disable react-hooks/exhaustive-deps */
// ts-check
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useRollbar } from '@rollbar/react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Container, Row } from 'react-bootstrap';
import { useAuth, useSocketFunctions } from '../../../hooks';
import Sidebar from './Sidebar';
import Main from './Main';
import {
  setChannels, addChannel, updateChannel, deleteChannel, setCurrentChannelId,
} from '../../../slices/channelsSlice.js';
import { setMessages, addMessage } from '../../../slices/messagesSlice.js';

import { appRoutes, DATA_ENDPOINT } from '../../../utils/routes.js';
import getAuthConfig from '../../../utils/getAuthConfig.js';

const Chat = () => {
  const { user } = useAuth();
  const {
    receiveMessage, confirmAddChannel, confirmRemoveChannel, confirmRenameChannel,
  } = useSocketFunctions();
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
      dispatch(setCurrentChannelId(id));
    });
  }, []);

  useEffect(() => {
    confirmRemoveChannel((payload) => {
      const { id } = payload;
      dispatch(deleteChannel(id));
      dispatch(setCurrentChannelId(1));
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
      const dataRoute = appRoutes[DATA_ENDPOINT]();

      try {
        const authConfig = getAuthConfig(user.token);
        const response = await axios.get(dataRoute, authConfig);
        const { data } = response;
        if (data) {
          dispatch(setChannels(data.channels));
          dispatch(setCurrentChannelId(data.currentChannelId));
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
