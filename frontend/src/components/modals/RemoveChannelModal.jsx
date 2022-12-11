/* eslint-disable no-unused-vars */
// ts-check
import React from 'react';
import { Button, Modal as BootstrapModal } from 'react-bootstrap';

const RemoveChannelModal = ({ show, setShow }) => (

  <BootstrapModal show={show} onHide={() => setShow(false)}>
    <BootstrapModal.Header closeButton>
      <BootstrapModal.Title>heading</BootstrapModal.Title>
    </BootstrapModal.Header>
    <BootstrapModal.Body>Body text</BootstrapModal.Body>
    <BootstrapModal.Footer>
      <Button variant="secondary" onClick={() => setShow(false)}>
        Close
      </Button>
      <Button variant="primary" onClick={() => setShow(false)}>
        Save Changes
      </Button>
    </BootstrapModal.Footer>
  </BootstrapModal>
);

export default RemoveChannelModal;
