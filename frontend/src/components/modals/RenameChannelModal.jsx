/* eslint-disable no-unused-vars */
// ts-check
import React, {
  useState, useContext, useRef, useEffect,
} from 'react';
import { Form, Button, Modal as BootstrapModal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { Formik } from 'formik';
import * as yup from 'yup';
import { selectors as channelSelectors } from '../../slices/channelsSlice.js';
import { setIsOpen, setType, setTargetChannel } from '../../slices/modalSlice.js';
import SocketContext from '../../contexts/SocketContext';

const RenameChannelForm = ({ shouldOpen, handleClose, handleRename }) => {
  const [socketConnectionError, setSocketConnectionError] = useState('');
  const inputRef = useRef(null);
  const channels = useSelector(channelSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => name);
  const { targetChannel } = useSelector((state) => state.modal);

  useEffect(() => {
    if (shouldOpen) {
      inputRef.current.focus();
    }
  }, [shouldOpen]);

  const renameChannelSchema = yup
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
      validationSchema={renameChannelSchema}
      initialValues={{
        channelName: `${targetChannel}`,
      }}
      onSubmit={(values) => handleRename(values)}
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
            <Form.Label className="visually-hidden">Add channel</Form.Label>
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.channelName}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="d-flex align-items-center justify-content-end pt-3">
            <Button className="me-2" variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Send
            </Button>
          </Form.Group>

        </Form>
      )
    }
    </Formik>
  );
};

const RenameChannelModal = () => {
  const { renameChannel } = useContext(SocketContext);
  const [socketConnectionError, setSocketConnectionError] = useState('');
  const dispatch = useDispatch();

  const { targetChannel } = useSelector((state) => state.modal);
  const channels = useSelector(channelSelectors.selectAll) || null;

  const handleClose = () => {
    dispatch(setIsOpen(false));
    dispatch(setType(null));
    dispatch(setTargetChannel(null));
  };

  const handleRename = (data) => {
    if (!channels) {
      return;
    }
    const [{ id }] = channels
      .filter(({ name, removable }) => removable && (name === targetChannel));
    if (targetChannel) {
      try {
        setSocketConnectionError('');
        const renamedChannel = {
          id,
          name: data.channelName.trim(),
        };
        console.log('renamedChannel', renamedChannel);
        renameChannel(renamedChannel, (response) => {
          console.log('response', response);
          if (response.status === 'ok') {
            return;
          }
          setSocketConnectionError('network error, try again later');
        });
      } catch (e) {
        console.log('rename channel error', e);
        setSocketConnectionError(e.message);
      }
    }
    handleClose();
  };
  const modalType = 'rename';
  const { isOpen, type } = useSelector((state) => state.modal);
  const shouldOpen = isOpen && type === modalType;

  return (
    <BootstrapModal centered show={shouldOpen} onHide={handleClose}>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>Rename channel</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <RenameChannelForm
          shouldOpen={shouldOpen}
          handleClose={handleClose}
          handleRename={handleRename}
        />
      </BootstrapModal.Body>
    </BootstrapModal>
  );
};

export default RenameChannelModal;
