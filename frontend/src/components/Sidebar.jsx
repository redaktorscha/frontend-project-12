// ts-check
import { useTranslation } from 'react-i18next';
import React, {
  useEffect, useState, useRef,
} from 'react';
import { Button, Col } from 'react-bootstrap';
import { PlusSquare } from 'react-bootstrap-icons';
import { useSelector, useDispatch } from 'react-redux';
import ChannelsList from './ChannelsList';
import { AddChannelModal, DeleteChannelModal, RenameChannelModal } from './modals';
import { actions as modalActions } from '../slices/modalSlice.js';

const Sidebar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [btnFocused, setBtnFocused] = useState(false);
  const { type } = useSelector((state) => state.modal);

  const { handleOpen } = modalActions;
  const buttonRef = useRef(null);

  const handleOpenModal = (modalType, channelId = null) => () => {
    dispatch(handleOpen({ type: modalType, targetChannelId: channelId }));
  };

  useEffect(() => {
    if (btnFocused && type === null) {
      buttonRef.current.focus();
    } else {
      setBtnFocused(false);
    }
  }, [type, btnFocused]);

  return (
    <Col className="col-4 col-md-2 border-end py-5 px-0 bg-light h-100">
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>{t('ui.chat.channels')}</span>
        <Button
          tabIndex={0}
          variant="outline-primary"
          ref={buttonRef}
          className="p-0 text-primary btn-group-vertical btn-svg"
          onClick={handleOpenModal('add')}
        >
          <PlusSquare size={20} title="add channel" color="#0d6efd" />
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <ChannelsList handleOpenModal={handleOpenModal} />
      <AddChannelModal setBtnFocused={setBtnFocused} />
      <DeleteChannelModal />
      <RenameChannelModal />
    </Col>
  );
};

export default Sidebar;
