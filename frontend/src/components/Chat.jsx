// ts-check
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import {
  Container, Row, Spinner,
} from 'react-bootstrap';
import { useAuth } from '../hooks';
import Sidebar from './Sidebar';
import Main from './Main';
import {
  actions as channelActions,
} from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';

import appRoutes from '../utils/routes.js';
import getAuthConfig from '../utils/getAuthConfig.js';

const Chat = () => {
  const [isLoading, setIsLoading] = useState(true);
  // const { hasNetworkError } = useChatApi();
  const { user, logOut } = useAuth();
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const rollbar = useRollbar();

  const { setChannels, setCurrentChannelId } = channelActions;
  const { setMessages } = messagesActions;

  useEffect(() => {
    const initChat = async () => {
      const apiRoute = appRoutes.apiV1DataPath();

      try {
        const authConfig = getAuthConfig(user.token);
        const response = await axios.get(apiRoute, authConfig);
        const { data } = response;
        if (data) {
          dispatch(setChannels({ channels: data.channels }));
          dispatch(setCurrentChannelId({ currentChannelId: data.currentChannelId }));
          dispatch(setMessages({ messages: data.messages }));
          setTimeout(() => setIsLoading(false), 2000);
        }
      } catch (e) {
        logOut();
        rollbar.error('getChatDataErr', e);
      }
    };

    initChat();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    return (
      <Container className="h-100 max-height-90 overflow-hidden rounded shadow d-flex justify-content-center align-items-center">
        <Spinner className="loading-spinner" role="status" animation="border" variant="primary">
          <span className="visually-hidden">{t('notification.loading')}</span>
        </Spinner>
      </Container>
    );
  }

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
