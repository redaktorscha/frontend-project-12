// ts-check
import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import filter from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { selectors as channelSelectors } from '../../slices/channelsSlice.js';
import { setIsOpen, setType, setTargetChannel } from '../../slices/modalSlice.js';
import { SocketContext } from '../../contexts';
import Modal from './Modal';
import ModalForm from './ModalForm';

const RenameChannelModal = () => {
  const { renameChannel } = useContext(SocketContext);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const rollbar = useRollbar();

  const { targetChannel } = useSelector((state) => state.modal);
  const channels = useSelector(channelSelectors.selectAll) || null;
  const channelsNames = channels.map(({ name }) => name);

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
        const renamedChannel = {
          id,
          name: filter.clean(data.channelName.trim()),
        };
        renameChannel(renamedChannel, (response) => {
          if (response.status === 'ok') {
            toast.success(t('toasts.channelRenamed'));
            return;
          }
          toast.error(t('toasts.networkError'));
        });
      } catch (e) {
        rollbar.error('Rename channel error', e);
        toast.error(t('toasts.networkError'));
      }
    }
    handleClose();
  };
  const modalType = 'rename';
  const { isOpen, type } = useSelector((state) => state.modal);
  const shouldOpen = isOpen && type === modalType;

  const renameChannelSchema = yup
    .object()
    .shape({
      channelName: yup
        .string()
        .trim()
        .min(3, t('errors.modals.channelNameSize'))
        .max(20, t('errors.modals.channelNameSize'))
        .required(t('errors.modals.required'))
        .notOneOf(channelsNames, t('errors.modals.notOneOf')),
    });

  return (
    <Modal
      shouldOpen={shouldOpen}
      handleClose={handleClose}
      modalTitle={t('ui.modals.renameChannelHeader')}
      modalBody={(
        <ModalForm
          shouldOpen={shouldOpen}
          handleClose={handleClose}
          eventHandler={handleRename}
          validationSchema={renameChannelSchema}
          initialValues={{ channelName: `${targetChannel}` }}
        />
      )}
      modalFooter={null}
    />
  );
};

export default RenameChannelModal;
