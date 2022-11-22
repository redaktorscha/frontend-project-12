/* eslint-disable no-unused-vars */
// ts-check
import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container, Button, ButtonGroup, Col, Row, Nav, Form, InputGroup, Dropdown,
} from 'react-bootstrap';
import uniqueId from 'lodash/uniqueId';
import { Formik } from 'formik';
import { isNull } from 'lodash';
import Wrapper from './Wrapper';
import AuthContext from './AuthContext';
import { setChannels, selectors as channelSelectors } from '../slices/channelsSlice.js';
import { setCurrentChannel } from '../slices/currentChannelSlice.js';
import { setMessages, selectors as messagesSelectors } from '../slices/messagesSlice.js';
import getRoute from '../utils/getRoute.js';
import getAuthConfig from '../utils/getAuthConfig.js';

const Channel = (props) => {
  const { color, channelName, hasDropDown } = props;

  return (
    <Nav.Item as="li" className="w-100">
      {hasDropDown ? (
        <Dropdown as={ButtonGroup}>
          <Button
            variant={color}
            type="button"
            className="w-100 rounded-0 text-start text-truncate"
          >
            {`# ${channelName}`}
          </Button>
          <Dropdown.Toggle split variant={color} id="dropdown-split-basic" />
          <Dropdown.Menu>
            <Dropdown.Item href="#/action-1">Delete Channel</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Rename Channel</Dropdown.Item>
          </Dropdown.Menu>

        </Dropdown>
      ) : (
        <Button
          variant={color}
          type="button"
          className="w-100 rounded-0 text-start"
        >
          {`# ${channelName}`}
        </Button>
      )}
    </Nav.Item>
  );
};

const ChannelsList = () => {
  const channels = useSelector(channelSelectors.selectAll) || null;
  const currentChannelId = useSelector((state) => state.currentChannel);

  console.log('channels', channels);
  console.log('currentChannelId', currentChannelId);
  return (
    <Nav
      as="ul"
      variant="pills"
      fill
      className="flex-column px-2"
    >
      {channels && channels.map(({ id, name, removable }) => {
        const color = id === currentChannelId ? 'secondary' : '';

        return (
          <Channel
            key={uniqueId()}
            color={color}
            channelName={name}
            hasDropDown={removable}
          />
        );
      })}
    </Nav>
  );
};

const AddMessageForm = () => (
  <Formik
    onSubmit={console.log}
  >
    {
      ({ handleSubmit }) => (
        <Form className="flex-fill border rounded-2 py-2 px-2" noValidate onSubmit={handleSubmit}>
          <InputGroup className="has-validation d-flex align-items-center">
            <Form.Control
              className="border-0 p-1"
              placeholder="Enter your message..."
              autoComplete="off"
            />
            <Button disabled type="submit" variant="outline-light" className="btn btn-group-vertical">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="#000"><path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" /></svg>
              <span className="visually-hidden">Отправить</span>
            </Button>
          </InputGroup>
        </Form>
      )
    }
  </Formik>
);

const Sidebar = () => (
  <Col className="col-4 col-md-2 border-end pt-5 px-0 bg-light">
    <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
      <span>Channels</span>
      <Button variant="outline-light" className="p-0 text-primary btn btn-group-vertical">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          width="20"
          height="20"
          fill="currentColor"
        >
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
        <span className="visually-hidden">+</span>
      </Button>
    </div>
    <ChannelsList />
  </Col>
);

const Message = (props) => {
  const { text } = props;
  return (
    <div className="text-break">
      {text}
    </div>
  );
};

const Messages = ({ currentChannelId }) => {
  const messages = useSelector(messagesSelectors.selectAll) || 0;
  if (!messages) {
    return null;
  }
  const currentChannelMessages = messages.filter(({ channelId }) => channelId === currentChannelId);

  return (
    <Col className="w-100 h-100 d-flex flex-column">
      {
        currentChannelMessages.length > 0
          ? currentChannelMessages.map(({ body, id }) => (<Message key={id} text={body} />))
          : null
}
    </Col>
  );
};

const Main = () => {
  const currentChannelId = useSelector((state) => state.currentChannel) || null;
  const currentChannel = useSelector((state) => channelSelectors
    .selectById(state, currentChannelId)) || null;
  const messagesCount = useSelector(messagesSelectors.selectTotal) || null;

  return (
    <Col className="col p-0 h-100">
      <div className="d-flex flex-column h-100">
        <div className="bg-light mb-4 p-3 shadow-sm small">
          <p className="m-0">
            <b>
              #
              {' '}
              {currentChannel?.name}
            </b>
          </p>
          <span className="text-muted">
            {messagesCount}
            {' '}
            сообщений
          </span>
        </div>
        <Container fluid className="h-100">
          <Row className="d-flex h-100 flex-column align-items-center justify-content-end">
            <Messages currentChannelId={currentChannelId} />
            <div className="mt-auto py-2">
              <AddMessageForm />
            </div>
          </Row>
        </Container>
      </div>
    </Col>
  );
};

const Chat = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isNull(user)) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const initChat = async () => {
      if (!user) {
        return;
      }
      const dataRoute = getRoute('data');

      try {
        const authConfig = getAuthConfig();
        const response = await axios.get(dataRoute, authConfig);
        const { data } = response;
        if (data) {
          console.log('data', data);
          dispatch(setChannels(data.channels));
          dispatch(setCurrentChannel(data.currentChannelId));
          dispatch(setMessages(data.messages));
        }
      } catch (e) {
        console.log('getChatDataErr', e);
      }
    };

    initChat();
  }, [user, dispatch]);

  return (
    user
    && (
    <Wrapper showCopyrightCredit={false}>
      <Container className="my-4 h-100 overflow-hidden rounded shadow">
        <Row className="bg-white h-100 flex-md-row">
          <Sidebar />
          <Main />
        </Row>
      </Container>
    </Wrapper>
    )
  );
};
export default Chat;
