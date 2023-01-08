import React, { useContext } from 'react';
import {
  Button, Form, InputGroup,
} from 'react-bootstrap';
import { useRollbar } from '@rollbar/react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Formik } from 'formik';
import filter from 'leo-profanity';
import AuthContext from '../../../contexts/AuthContext';
import SocketContext from '../../../contexts/SocketContext';

const AddMessageForm = ({ t, currentChannelId }) => {
  const { user } = useContext(AuthContext);
  const { sendMessage } = useContext(SocketContext);
  const rollbar = useRollbar();

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
        try {
          const messageToSend = {
            body: filter.clean(values.message.trim()),
            channelId: currentChannelId,
            username: user,
          };

          sendMessage(messageToSend, (response) => {
            if (response.status === 'ok') {
              return;
            }
            toast.error(t('toasts.networkError'));
          });
          resetForm({ values: { message: '' } });
        } catch (e) {
          rollbar.error('Add msg error', e);
          toast.error(t('toasts.networkError'));
        }
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
              className="border-0 py-1 px-2 text-truncate"
              placeholder={t('ui.chat.enterMessage')}
              type="text"
              name="message"
              value={values.message}
              onChange={handleChange}
              autoComplete="off"
            />
            <Button disabled={!isValid} type="submit" variant="outline-light" className="btn btn-group-vertical">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="#000"><path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" /></svg>
              <span className="visually-hidden">{t('ui.chat.send')}</span>
            </Button>
          </InputGroup>
        </Form>
      )
    }
    </Formik>
  );
};

export default AddMessageForm;
