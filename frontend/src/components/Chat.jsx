// ts-check
import { useNavigate } from 'react-router-dom';
import React, { useEffect } from 'react';
import { useRollbar } from '@rollbar/react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { Container, Row } from 'react-bootstrap';
import { useAuth } from '../hooks';
import Sidebar from './Sidebar';
import Main from './Main';
import {
  actions as channelActions,
} from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';

import { appRoutes, DATA_ENDPOINT } from '../utils/routes.js';
import getAuthConfig from '../utils/getAuthConfig.js';

const Chat = () => {
  const { user } = useAuth();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const rollbar = useRollbar();

  const { setChannels, setCurrentChannelId } = channelActions;
  const { setMessages } = messagesActions;

  useEffect(() => {
    const initChat = async () => {
      const dataRoute = appRoutes[DATA_ENDPOINT]();

      try {
        const authConfig = getAuthConfig(user.token);
        const response = await axios.get(dataRoute, authConfig);
        const { data } = response;
        if (data) {
          dispatch(setChannels({ channels: data.channels }));
          dispatch(setCurrentChannelId({ currentChannelId: data.currentChannelId }));
          dispatch(setMessages({ messages: data.messages }));
        }
      } catch (e) {
        rollbar.error('getChatDataErr', e);
        navigate('/login');
      }
    };

    initChat();
  }, [user, dispatch, setChannels, setCurrentChannelId, setMessages, rollbar, navigate]);

  return (
    user
      && (
        <Container className="h-100 max-height-90 overflow-hidden rounded shadow">
          <Row className="bg-white h-100 flex-md-row">
            <Sidebar />
            <Main />
          </Row>
        </Container>
      )
  );
};
export default Chat;
