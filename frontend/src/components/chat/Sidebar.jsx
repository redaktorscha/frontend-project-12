// ts-check
import { useTranslation } from 'react-i18next';
import React, {
  useEffect, useState, useRef,
} from 'react';
import { Button, Col } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import ChannelsList from './ChannelsList';
import { AddChannelModal, DeleteChannelModal, RenameChannelModal } from '../modals';
import { setIsOpen, setType, setTargetChannel } from '../../slices/modalSlice.js';

const Sidebar = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [btnFocused, setBtnFocused] = useState(false);
  const { isOpen } = useSelector((state) => state.modal);

  const buttonRef = useRef(null);

  const handleOpenModal = (modalType, channel = null) => () => {
    dispatch(setIsOpen(true));
    dispatch(setType(modalType));
    if (channel !== null) {
      dispatch(setTargetChannel(channel));
    }
  };

  useEffect(() => {
    if (btnFocused && !isOpen) {
      buttonRef.current.focus();
    } else {
      setBtnFocused(false);
    }
  }, [isOpen, btnFocused]);

  const buttonNormalStyle = {
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  };

  const buttonFocusedStyle = {
    boxShadow: '0 0 0 0.25rem rgb(13 110 253 / 25%)',
    borderColor: 'transparent',
    backgroundColor: 'transparent',
  };

  return (
    <Col className="col-4 col-md-2 border-end pt-5 px-0 bg-light h-100">
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>{t('ui.chat.channels')}</span>
        <Button
          tabIndex={0}
          variant="outline-primary"
          style={btnFocused ? buttonFocusedStyle : buttonNormalStyle}
          ref={buttonRef}
          className="p-0 text-primary btn-group-vertical"
          onClick={handleOpenModal('add')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">+</span>
        </Button>
      </div>
      <ChannelsList t={t} handleOpenModal={handleOpenModal} />
      <AddChannelModal setBtnFocused={setBtnFocused} />
      <DeleteChannelModal />
      <RenameChannelModal />
    </Col>
  );
};

export default Sidebar;
