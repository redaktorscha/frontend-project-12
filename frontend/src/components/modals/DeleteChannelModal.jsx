// ts-check
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useRollbar } from '@rollbar/react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { selectors as channelSelectors } from '../../slices/channelsSlice.js';
import { actions as modalActions } from '../../slices/modalSlice.js';
import { useChatApi } from '../../hooks';
import Modal from './Modal';

const DeleteChannelModal = () => {
  const { removeChannel } = useChatApi();
  const [isSending, setIsSending] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { setModalType, setTargetChannel } = modalActions;

  const rollbar = useRollbar();

  const { targetChannel } = useSelector((state) => state.modal);
  const channels = useSelector(channelSelectors.selectAll);

  const handleClose = () => {
    dispatch(setModalType({ type: null }));
    dispatch(setTargetChannel({ targetChannel: null }));
  };

  const handleDelete = async () => {
    if (!channels) {
      return;
    }
    handleClose();
    const [{ id }] = channels
      .filter(({ name, removable }) => removable && (name === targetChannel));
    if (targetChannel) {
      setIsSending(true);

      const channelForDeletion = { id };
      await removeChannel(channelForDeletion)
        .then(() => {
          toast.success(t('toasts.channelDeleted'));
        })
        .catch((e) => {
          rollbar.error('Delete channel error', e);
          toast.error(t('toasts.networkError'));
        });
    }
  };

  const modalType = 'delete';
  const { type } = useSelector((state) => state.modal);
  const shouldOpen = type === modalType;

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
