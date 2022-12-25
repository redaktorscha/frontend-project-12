/* eslint-disable no-unused-vars */
// ts-check
import React, { useState, useContext } from 'react';
import { Button, Modal as BootstrapModal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { selectors as channelSelectors } from '../../slices/channelsSlice.js';
import { setMessages, selectors as messagesSelectors } from '../../slices/messagesSlice.js';
import { setIsOpen, setType, setTargetChannel } from '../../slices/modalSlice.js';
import SocketContext from '../../contexts/SocketContext';

const DeleteChannelModal = () => {
  const { removeChannel } = useContext(SocketContext);
  const [socketConnectionError, setSocketConnectionError] = useState('');
  const dispatch = useDispatch();

  const { targetChannel } = useSelector((state) => state.modal);
  const channels = useSelector(channelSelectors.selectAll) || null;
  const messages = useSelector(messagesSelectors.selectAll) || null; // add extra reducer

  const handleClose = () => {
    dispatch(setIsOpen(false));
    dispatch(setType(null));
    dispatch(setTargetChannel(null));
  };

  const handleDelete = () => {
    if (!channels) {
      return;
    }
    const [{ id }] = channels
      .filter(({ name, removable }) => removable && (name === targetChannel));
    console.log('targetChannel', targetChannel);
    console.log('id', id);
    if (targetChannel) {
      try {
        setSocketConnectionError('');
        const channelForDeletion = {
          id,
        };
        console.log('channelForDeletion', channelForDeletion);
        removeChannel(channelForDeletion, (response) => {
          console.log('response', response);
          if (response.status === 'ok') {
            return;
          }
          setSocketConnectionError('network error, try again later');
        });
      } catch (e) {
        console.log('delete channel error', e);
        setSocketConnectionError(e.message);
      }
    }

    if (messages) {
      const filteredMessages = messages.filter(({ channelId }) => channelId !== id);
      dispatch(setMessages(filteredMessages));
    }

    handleClose();
  };

  const modalType = 'delete';
  const { isOpen, type } = useSelector((state) => state.modal);
  const shouldOpen = isOpen && type === modalType;

  return (
    <BootstrapModal centered show={shouldOpen} onHide={handleClose}>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>Delete channel</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>Are you sure?</BootstrapModal.Body>
      <BootstrapModal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Delete
        </Button>
      </BootstrapModal.Footer>
    </BootstrapModal>
  );
};

export default DeleteChannelModal;
