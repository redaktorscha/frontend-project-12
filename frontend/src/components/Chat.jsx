// ts-check
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import {
  Container, Row, Spinner,
} from 'react-bootstrap';
import { useAuth, useChatApi } from '../hooks';
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
  const { connectionError } = useChatApi();
  const { user } = useAuth();
  const { t } = useTranslation();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const rollbar = useRollbar();

  const { setChannels, setCurrentChannelId } = channelActions;
  const { setMessages } = messagesActions;

  useEffect(() => {
    const initChat = async () => {
      const apiRoute = appRoutes.apiV1DataPath();
      const loginRoute = appRoutes.loginPath();

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
        rollbar.error('getChatDataErr', e);
        navigate(loginRoute);
      }
    };

    initChat();
  }, [user, dispatch, setChannels, setCurrentChannelId, setMessages, rollbar, navigate]);

  if (isLoading) {
    return (
      <Container className="h-100 max-height-90 overflow-hidden rounded shadow d-flex justify-content-center align-items-center">
        <Spinner className="loading-spinner" role="status" animation="border" variant="primary">
          <span className="visually-hidden">{t('notification.loading')}</span>
        </Spinner>
      </Container>
    );
  }

  if (connectionError) {
    return (
      <Container className="h-100 max-height-90 overflow-hidden rounded shadow d-flex justify-content-center align-items-center">
        <div className="d-flex flex-column">
          <div className="d-flex">
            <Spinner size="sm" role="status" animation="grow" variant="secondary" />
            <Spinner size="sm" role="status" animation="grow" variant="secondary" />
            <Spinner size="sm" role="status" animation="grow" variant="secondary" />
          </div>
          <h4 className="text-muted">{t('notification.connectionAborted')}</h4>
          <span className="text-muted">{t('notification.tryRefresh')}</span>
        </div>
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
