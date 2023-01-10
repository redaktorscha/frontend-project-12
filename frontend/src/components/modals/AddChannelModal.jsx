// ts-check
import React, {
  useRef, useEffect, useContext, useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button, Modal as BootstrapModal, Form,
} from 'react-bootstrap';
import filter from 'leo-profanity';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { useRollbar } from '@rollbar/react';
import { selectors as channelSelectors } from '../../slices/channelsSlice.js';
import { setIsOpen, setType } from '../../slices/modalSlice.js';
import { SocketContext } from '../../contexts';

const AddChannelForm = ({
  handleClose, shouldOpen, handleAdd,
}) => {
  const [isFormSending, setIsFormSending] = useState(false);
  const inputRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (shouldOpen) {
      setIsFormSending(false);
      inputRef.current.focus();
    }
  }, [shouldOpen]);

  const channels = useSelector(channelSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => name);

  const addChannelSchema = yup
    .object()
    .shape({
      channelName: yup
        .string()
        .trim()
        .min(3, t('errors.modals.channelNameSize'))
        .max(20, t('errors.modals.channelNameSize'))
        .required(t('errors.modals.required'))
        .notOneOf(channelsNames, t('errors.modals.notOneOf')),
    });

  return (
    <Formik
      validationSchema={addChannelSchema}
      initialValues={{
        channelName: '',
      }}
      onSubmit={(values) => {
        setIsFormSending(true);
        handleAdd(values);
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
            <Button className="me-2" variant="secondary" onClick={handleClose} disabled={isFormSending}>
              {t('ui.modals.cancel')}
            </Button>
            <Button type="submit" variant="primary" disabled={isFormSending}>
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
  const rollbar = useRollbar();
  const { addChannel } = useContext(SocketContext);

  const modalType = 'add';
  const { isOpen, type } = useSelector((state) => state.modal);
  const shouldOpen = isOpen && type === modalType;

  const handleAdd = (data) => {
    try {
      const newChannel = {
        name: filter.clean(data.channelName.trim()),
      };
      addChannel(newChannel, (response) => {
        if (response.status === 'ok') {
          toast.success(t('toasts.channelCreated'));
          return;
        }
        toast.error(t('toasts.networkError'));
      });
    } catch (e) {
      rollbar.error('Add channel error', e);
      toast.error(t('toasts.networkError'));
    }
    handleClose();
  };

  return (
    <BootstrapModal centered show={shouldOpen} onHide={handleClose}>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{t('ui.modals.addChannelHeader')}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <AddChannelForm
          shouldOpen={shouldOpen}
          handleClose={handleClose}
          handleAdd={handleAdd}
        />
      </BootstrapModal.Body>
    </BootstrapModal>
  );
};

export default AddChannelModal;
