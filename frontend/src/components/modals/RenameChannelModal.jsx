/* eslint-disable no-unused-vars */
// ts-check
import React from 'react';
import { Button, Modal as BootstrapModal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { selectors as channelSelectors } from '../../slices/channelsSlice.js';
import { setIsOpen, setType } from '../../slices/modalSlice.js';
import SocketContext from '../../contexts/SocketContext';

const RenameChannelModal = () => {
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(setIsOpen(false));
    dispatch(setType(null));
  };
  const modalType = 'rename';
  const { isOpen, type } = useSelector((state) => state.modal);
  const shouldOpen = isOpen && type === modalType;

  return (
    <BootstrapModal centered show={shouldOpen} onHide={handleClose}>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>Rename channel</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>Are you sure?</BootstrapModal.Body>
      <BootstrapModal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => {}}>
          Send
        </Button>
      </BootstrapModal.Footer>
    </BootstrapModal>
  );
};

export default RenameChannelModal;
