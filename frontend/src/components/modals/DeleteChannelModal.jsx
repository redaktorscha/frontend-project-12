// ts-check
import React, { useState } from 'react';
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
  const { removeChannel, setHasNetworkError } = useChatApi();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { setModalType, setIsClosed, setTargetChannelId } = modalActions;

  const rollbar = useRollbar();

  const { targetChannelId } = useSelector((state) => state.modal);
  const channels = useSelector(channelSelectors.selectAll);

  const handleClose = () => {
    dispatch(setModalType({ type: null }));
    dispatch(setIsClosed({ isOpen: false }));
    dispatch(setTargetChannelId({ targetChannelId: null }));
  };

  const handleDelete = async () => {
    if (!channels) {
      return;
    }
    const { removable } = channels
      .find(({ id }) => id === targetChannelId);

    if (removable) {
      setIsSubmitting(true);

      const channelForDeletion = { id: targetChannelId };
      await removeChannel(channelForDeletion)
        .then(() => {
          handleClose();
          setIsSubmitting(false);
          toast.success(t('toasts.channelDeleted'));
        })
        .catch((e) => {
          setHasNetworkError(true);
          setTimeout(() => setIsSubmitting(false), 2000);
          rollbar.error('Delete channel error', e);
          toast.error(t('toasts.networkError'));
        });
    }
  };

  const modalType = 'delete';
  const { type } = useSelector((state) => state.modal);
  const { isOpen } = useSelector(((state) => state.modal));
  const shouldOpen = isOpen && type === modalType;

  return (
    <Modal
      shouldOpen={shouldOpen}
      handleClose={handleClose}
      modalTitle={t('ui.modals.deleteChannelHeader')}
      modalBody={t('ui.modals.deleteChannelBody')}
      modalFooter={(
        <>
          <Button variant="secondary" onClick={handleClose} disabled={isSubmitting}>
            {t('ui.modals.cancel')}
          </Button>
          <Button variant="danger" onClick={handleDelete} disabled={isSubmitting}>
            {t('ui.modals.delete')}
          </Button>
        </>
      )}
    />
  );
};

export default DeleteChannelModal;
