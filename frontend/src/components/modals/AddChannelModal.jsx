// ts-check
import React, {
  useRef, useEffect, useContext, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button, Modal as BootstrapModal, Form,
} from 'react-bootstrap';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { selectors as channelSelectors } from '../../slices/channelsSlice.js';
import { setIsOpen, setType } from '../../slices/modalSlice.js';
import SocketContext from '../../contexts/SocketContext';

const AddChannelForm = ({ t, handleClose, shouldOpen }) => {
  const [socketConnectionError, setSocketConnectionError] = useState('');
  const inputRef = useRef(null);
  const { addChannel } = useContext(SocketContext);
  useEffect(() => {
    if (shouldOpen) {
      inputRef.current.focus();
    }
  });
  const channels = useSelector(channelSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => name);

  const addChannelSchema = yup
    .object()
    .shape({
      channelName: yup
        .string()
        .trim()
        .min(3)
        .max(20)
        .required('required')
        .notOneOf(channelsNames, 'channel name should be unique'),
    });

  return (
    <Formik
      validationSchema={addChannelSchema}
      initialValues={{
        channelName: '',
      }}
      onSubmit={(values, { resetForm }) => {
        try {
          setSocketConnectionError('');
          const newChannel = {
            name: values.channelName.trim(),
          };
          addChannel(newChannel, (response) => {
            if (response.status === 'ok') {
              return;
            }
            setSocketConnectionError(t('network.fail'));
          });
        } catch (e) {
          console.log('add channel error', e);
          setSocketConnectionError(e.message);
          console.log(socketConnectionError);
        }
        resetForm({ values: { channelName: '' } });
      }}
    >
      {
      ({
        handleChange, handleSubmit, values, errors,
      }) => (
        <Form
          className="flex-fill border rounded-2 py-2 px-2"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Form.Group className="d-flex align-items-center">
            <Form.Control
              className="border-0 p-1"
              type="text"
              name="channelName"
              value={values.channelName}
              onChange={handleChange}
              autoComplete="off"
              isInvalid={!!errors.channelName}
              ref={inputRef}
            />
            <Form.Label className="visually-hidden">{t('ui.modals.addChannelHeader')}</Form.Label>
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.channelName}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="d-flex align-items-center justify-content-end pt-3">
            <Button className="me-2" variant="secondary" onClick={handleClose}>
              {t('ui.modals.cancel')}
            </Button>
            <Button type="submit" variant="primary">
              {t('ui.modals.send')}
            </Button>
          </Form.Group>

        </Form>
      )
    }
    </Formik>
  );
};

const AddChannelModal = ({ setBtnFocused }) => {
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(setIsOpen(false));
    dispatch(setType(null));
    setBtnFocused(true);
  };

  const { t } = useTranslation();

  const modalType = 'add';
  const { isOpen, type } = useSelector((state) => state.modal);
  const shouldOpen = isOpen && type === modalType;

  return (
    <BootstrapModal centered show={shouldOpen} onHide={handleClose}>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{t('ui.modals.addChannelHeader')}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <AddChannelForm t={t} shouldOpen={shouldOpen} handleClose={handleClose} />
      </BootstrapModal.Body>
    </BootstrapModal>
  );
};

export default AddChannelModal;
