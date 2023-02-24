import React, {
  useRef, useState, useEffect,
} from 'react';
import {
  Button, Form, InputGroup,
} from 'react-bootstrap';
import { ArrowRightSquare } from 'react-bootstrap-icons';
import { useRollbar } from '@rollbar/react';
import { toast } from 'react-toastify';
import * as yup from 'yup';
import { Formik } from 'formik';
import filter from 'leo-profanity';
import { useAuth, useChatAPI } from '../hooks';

const AddMessageForm = ({ t, currentChannelId }) => {
  const { user: { username } } = useAuth();
  const { sendMessage } = useChatAPI();
  const [inputValue, setInputValue] = useState('');

  const rollbar = useRollbar();
  const inputRef = useRef(null);

  const addMessageSchema = yup
    .object()
    .shape({
      message: yup
        .string()
        .trim()
        .required(),
    });

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <Formik
      validationSchema={addMessageSchema}
      initialValues={{
        message: '',
      }}
      onSubmit={(values, { resetForm }) => {
        setInputValue('');
        try {
          const messageToSend = {
            body: filter.clean(values.message.trim()),
            channelId: currentChannelId,
            username,
          };
          sendMessage(messageToSend);
          resetForm({ values: { message: '' } });
        } catch (e) {
          rollbar.error(e.message);
          toast.error(t('toasts.networkError'));
        }
      }}
    >
      {
      ({
        handleChange, handleSubmit, values,
      }) => (
        <Form
          className="flex-fill border rounded-2 py-2 px-2"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <InputGroup className="d-flex align-items-center">
            <Form.Control
              className="border-0 py-1 px-2 text-truncate"
              placeholder={t('ui.chat.enterMessage')}
              aria-label={t('ui.chat.ariaLabelMessage')}
              type="text"
              name="message"
              value={values.message}
              onChange={(e) => {
                setInputValue(e.target.value);
                handleChange(e);
              }}
              autoComplete="off"
              ref={inputRef}
            />
            <Button type="submit" variant="outline-light" className="btn btn-group-vertical" disabled={!inputValue}>
              <ArrowRightSquare size={20} title="add message" color="#212529" />
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
