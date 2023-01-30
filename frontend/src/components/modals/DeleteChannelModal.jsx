// ts-check
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { selectors as channelSelectors } from '../../slices/channelsSlice.js';
import { setIsOpen, setType, setTargetChannel } from '../../slices/modalSlice.js';
import { useSocketFunctions } from '../../hooks';
import Modal from './Modal';

const DeleteChannelModal = () => {
  const { removeChannel } = useSocketFunctions();
  const [isSending, setIsSending] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const rollbar = useRollbar();

  const { targetChannel } = useSelector((state) => state.modal);
  const channels = useSelector(channelSelectors.selectAll) || null;

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
    if (targetChannel) {
      setIsSending(true);
      try {
        const channelForDeletion = { id };
        removeChannel(channelForDeletion, (response) => {
          if (response.status === 'ok') {
            toast.success(t('toasts.channelDeleted'));
            return;
          }
          toast.error(t('toasts.networkError'));
        });
      } catch (e) {
        rollbar.error('Delete channel error', e);
        toast.error(t('toasts.networkError'));
      }
    }

    handleClose();
  };

  const modalType = 'delete';
  const { isOpen, type } = useSelector((state) => state.modal);
  const shouldOpen = isOpen && type === modalType;

  useEffect(() => {
    if (shouldOpen) {
      setIsSending(false);
    }
  }, [shouldOpen]);

  return (
    <Modal
      shouldOpen={shouldOpen}
      handleClose={handleClose}
      modalTitle={t('ui.modals.deleteChannelHeader')}
      modalBody={t('ui.modals.deleteChannelBody')}
      modalFooter={(
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isSending}>
            {t('ui.modals.cancel')}
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isSending}>
            {t('ui.modals.delete')}
          </Button>
        </>
      )}
    />
  );
};

export default DeleteChannelModal;
