/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// ts-check
import { useNavigate } from 'react-router-dom';
import React, {
  useContext, useEffect, useState, useRef,
} from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import {
  Container, Button, ButtonGroup, Col, Row, Nav, Form, InputGroup, Dropdown,
} from 'react-bootstrap';
import uniqueId from 'lodash/uniqueId';
import { Formik } from 'formik';
import * as yup from 'yup';
import isNull from 'lodash/isNull';
import Wrapper from './Wrapper';
import AddChannelModal from './modals/AddChannelModal';
import DeleteChannelModal from './modals/DeleteChannelModal';
import RenameChannelModal from './modals/RenameChannelModal';
import AuthContext from '../contexts/AuthContext';
import SocketContext from '../contexts/SocketContext';
import {
  setChannels, addChannel, updateChannel, deleteChannel, selectors as channelSelectors,
} from '../slices/channelsSlice.js';
import { setCurrentChannel } from '../slices/currentChannelSlice.js';
import { setMessages, addMessage, selectors as messagesSelectors } from '../slices/messagesSlice.js';
import { setIsOpen, setType, setTargetChannel } from '../slices/modalSlice.js';
import getRoute from '../utils/getRoute.js';
import getAuthConfig from '../utils/getAuthConfig.js';

const ChannelButton = ({ color, onClick, channelName }) => (
  <Button
    variant={color}
    type="button"
    className="w-100 rounded-0 text-start text-truncate"
    onClick={onClick}
  >
    {`# ${channelName}`}

  </Button>
);

const Channel = (props) => {
  const {
    onClick, color, channelName, hasDropDown, handleOpenModal,
  } = props;

  return (
    <Nav.Item as="li" className="w-100">
      {hasDropDown ? (
        <Dropdown as={ButtonGroup} className="w-100">
          <ChannelButton color={color} onClick={onClick} channelName={channelName} />
          <Dropdown.Toggle split variant={color} id="dropdown-split-basic" />
          <Dropdown.Menu>
            <Dropdown.Item role="button" href="#/action-1" onClick={handleOpenModal('delete', channelName)}>Delete</Dropdown.Item>
            <Dropdown.Item role="button" href="#/action-2" onClick={handleOpenModal('rename', channelName)}>Rename</Dropdown.Item>
          </Dropdown.Menu>

        </Dropdown>
      ) : (
        <ChannelButton color={color} onClick={onClick} channelName={channelName} />
      )}
    </Nav.Item>
  );
};

const ChannelsList = ({ handleOpenModal }) => {
  const channels = useSelector(channelSelectors.selectAll) || null;
  const currentChannelId = useSelector((state) => state.currentChannel);
  const dispatch = useDispatch();
  const setChannel = (channelId) => () => dispatch(setCurrentChannel(channelId));

  return (
    <Nav
      as="ul"
      variant="pills"
      fill
      className="px-2 overflow-auto nav-stacked py-4 "
    >
      {channels && channels.map(({ id, name, removable }) => {
        const color = id === currentChannelId ? 'secondary' : '';

        return (
          <Channel
            handleOpenModal={handleOpenModal}
            onClick={setChannel(id)}
            key={uniqueId()} // id
            color={color}
            channelName={name}
            hasDropDown={removable}
          />
        );
      })}
    </Nav>
  );
};

const AddMessageForm = ({ currentChannelId, socket }) => {
  const [userMessage, setUserMessage] = useState('');
  const [socketConnectionError, setSocketConnectionError] = useState('');
  const { user } = useContext(AuthContext);
  const { sendMessage } = useContext(SocketContext);
  const dispatch = useDispatch();

  // waitForMessage(socket, (messageFromServer) => dispatch(addMessage(messageFromServer)));

  // useEffect(() => {
  //   if (!userMessage.length) {
  //     return;
  //   }
  //   try {
  //     setSocketConnectionError('');
  //     const messageToSend = {
  //       body: userMessage,
  //       channelId: currentChannelId,
  //       username: user,
  //     };
  //     console.log('messageToSend', messageToSend);

  //     sendMessage(socket, messageToSend);
  //   } catch (e) {
  //     console.log('socketError', e);
  //     setSocketConnectionError(e.message);
  //   }
  // }, [currentChannelId, dispatch, user, userMessage, socket]);

  const addMessageSchema = yup
    .object()
    .shape({
      message: yup
        .string()
        .trim()
        .required(),
    });

  return (
    <Formik
      validationSchema={addMessageSchema}
      initialValues={{
        message: '',
      }}
      onSubmit={(values, { resetForm }) => {
        // console.log('values', values);
        // setUserMessage(values.message.trim());
        try {
          setSocketConnectionError('');
          const messageToSend = {
            body: values.message.trim(),
            channelId: currentChannelId,
            username: user,
          };
          // console.log('messageToSend', messageToSend);

          sendMessage(messageToSend, (response) => {
            if (response.status === 'ok') {
              return;
            }
            setSocketConnectionError('network error, try again later');
          });
        } catch (e) {
          console.log('socketError', e);
          setSocketConnectionError(e.message);
        }
        resetForm({ values: { message: '' } });
      }}
    >
      {
      ({
        handleChange, handleSubmit, values, isValid,
      }) => (
        <Form
          className="flex-fill border rounded-2 py-2 px-2"
          noValidate
          onSubmit={handleSubmit}
        >
          <InputGroup className="d-flex align-items-center">
            <Form.Control
              className="border-0 p-1"
              placeholder="Enter your message..."
              type="text"
              name="message"
              value={values.message}
              onChange={handleChange}
              autoComplete="off"
            />
            <Button disabled={!isValid} type="submit" variant="outline-light" className="btn btn-group-vertical">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="#000"><path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" /></svg>
              <span className="visually-hidden">Отправить</span>
            </Button>
          </InputGroup>
        </Form>
      )
    }
    </Formik>
  );
};

const Sidebar = () => {
  const dispatch = useDispatch();
  const [btnFocused, setBtnFocused] = useState(false);
  const { isOpen } = useSelector((state) => state.modal);

  const buttonRef = useRef(null);

  const handleOpenModal = (modalType, channel = null) => () => {
    dispatch(setIsOpen(true));
    dispatch(setType(modalType));
    if (channel !== null) {
      dispatch(setTargetChannel(channel));
    }
  };

  useEffect(() => {
    if (btnFocused && !isOpen) {
      buttonRef.current.focus();
    } else {
      setBtnFocused(false);
    }
  }, [isOpen, btnFocused]);

  const buttonNormalStyle = {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  };

  const buttonFocusedStyle = {
    boxShadow: '0 0 0 0.25rem rgb(13 110 253 / 25%)',
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  };

  return (
    <Col className="col-4 col-md-2 border-end pt-5 px-0 bg-light h-100">
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>Channels</span>
        <Button
          variant="outline-primary"
          style={btnFocused ? buttonFocusedStyle : buttonNormalStyle}
          ref={buttonRef}
          className="p-0 text-primary btn-group-vertical"
          onClick={handleOpenModal('add')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <ChannelsList handleOpenModal={handleOpenModal} />
      <AddChannelModal setBtnFocused={setBtnFocused} />
      <DeleteChannelModal />
      <RenameChannelModal />
    </Col>
  );
};

const Message = (props) => {
  const { username, text } = props;
  // console.log('from message', username);
  return (
    <div className="text-break mb-2">
      <b>{username}</b>
      {': '}
      {text}
    </div>
  );
};

const Messages = ({ currentChannelMessages }) => (
  <Col className="w-100 overflow-auto h-20  border border-primary">
    <div>
      {
        currentChannelMessages.length > 0
          ? currentChannelMessages
            .map(({ username, body, id }) => (<Message key={id} text={body} username={username} />))
          : null
}
    </div>

  </Col>
);

const Main = (props) => {
  const { socket } = props;
  const currentChannelId = useSelector((state) => state.currentChannel) || null;
  const currentChannel = useSelector((state) => channelSelectors
    .selectById(state, currentChannelId)) || null;
  // const messagesCount = useSelector(messagesSelectors.selectTotal) || null;
  const messages = useSelector(messagesSelectors.selectAll) || null;
  const currentChannelMessages = messages
    ? messages.filter(({ channelId }) => channelId === currentChannelId)
    : null;
  const messagesCount = currentChannelMessages?.length ?? 0;

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
            messages
          </span>
        </div>
        <Container fluid className="h-100">
          <Row className="d-flex h-100 flex-column align-items-center justify-content-end px-5">
            <Messages currentChannelMessages={currentChannelMessages} />
            <div className="py-2">
              <AddMessageForm currentChannelId={currentChannelId} socket={socket} />
            </div>
          </Row>
        </Container>
      </div>
    </Col>
  );
};

const Chat = () => {
  const { user } = useContext(AuthContext);
  console.log('user from chat', user);
  const {
    receiveMessage, confirmAddChannel, confirmRemoveChannel, confirmRenameChannel,
  } = useContext(SocketContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      dispatch(setCurrentChannel(1)); // ?
    });
  }, []);

  useEffect(() => {
    confirmRenameChannel((payload) => {
      const { id, name } = payload;
      dispatch(updateChannel({ id, changes: { name } }));
    });
  }, []);

  useEffect(() => {
    if (isNull(user)) {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    const initChat = async () => {
      if (!user) {
        console.error('user undefined');
        return;
      }

      const dataRoute = getRoute('data');

      try {
        const authConfig = getAuthConfig();
        const response = await axios.get(dataRoute, authConfig);
        const { data } = response;
        if (data) {
          // console.log('data', data);
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
