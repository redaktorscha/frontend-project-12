import { Modal as BootstrapModal } from 'react-bootstrap';

const Modal = ({
  shouldOpen, handleClose, modalTitle, modalBody, modalFooter,
}) => (
  <BootstrapModal centered show={shouldOpen} onHide={handleClose}>
    <BootstrapModal.Header closeButton>
      <BootstrapModal.Title>{modalTitle}</BootstrapModal.Title>
    </BootstrapModal.Header>
    <BootstrapModal.Body>
      {modalBody}
    </BootstrapModal.Body>
    {modalFooter && (<BootstrapModal.Footer>{modalFooter}</BootstrapModal.Footer>)}
  </BootstrapModal>
);

export default Modal;
