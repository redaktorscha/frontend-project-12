// ts-check
import { useNavigate } from 'react-router-dom';
import React, { useContext, useEffect } from 'react';
import {
  Container, Button, Col, Row, Nav, Form, InputGroup,
} from 'react-bootstrap';
import uniqueId from 'lodash/uniqueId';
import { Formik } from 'formik';
import { isNull } from 'lodash';
import Wrapper from './Wrapper';
import AuthContext from './AuthContext';

const channels = ['general', 'random', 'new channel'];

const ChannelsList = () => (
  <Nav as="ul" variant="pills" fill className="flex-column px-2">
    {channels.map((channelName, i) => {
      const btnClass = i === 0 ? 'btn btn-secondary' : 'btn';
      return (
        <Nav.Item as="li" key={uniqueId()}>
          <button
            type="button"
            className={`w-100 rounded-0 text-start ${btnClass}`}
          >
            {`# ${channelName}`}
          </button>
        </Nav.Item>
      );
    })}
  </Nav>
);

const AddMessageForm = () => (
  <Formik
    onSubmit={console.log}
  >
    {
      ({ handleSubmit }) => (
        <Form className="border rounded-2" noValidate onSubmit={handleSubmit}>
          <InputGroup className="has-validation d-flex align-items-center">
            <Form.Control
              className="border-0 p-0 ps-2"
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

const Chat = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (isNull(user)) {
      navigate('/login');
    }
  }, [navigate, user]);

  return (
    user
    && (
    <Wrapper showCopyrightCredit={false}>
      <Container className="my-4 h-100 overflow-hidden rounded shadow">
        <Row className="bg-white h-100 flex-md-row">
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
          <Col className="col p-0 h-100">
            <div className="d-flex flex-column h-100">
              <div className="bg-light mb-4 p-3 shadow-sm small">
                <p className="m-0">
                  <b># general</b>
                </p>
                <span className="text-muted">0 сообщений</span>
              </div>
              <div className="px-5">
                <div className="text-break">
                  message
                </div>
              </div>
              <div className="mt-auto px-5 py-3">
                <AddMessageForm />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </Wrapper>
    )
  );
};
export default Chat;
