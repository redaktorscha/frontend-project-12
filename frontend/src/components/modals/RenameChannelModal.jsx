// ts-check
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import filter from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { selectors as channelSelectors } from '../../slices/channelsSlice.js';
import { actions as modalActions } from '../../slices/modalSlice.js';
import Modal from './Modal';
import ModalForm from './ModalForm';
import { useChatApi } from '../../hooks';

const RenameChannelModal = () => {
  const { renameChannel, setHasNetworkError } = useChatApi();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { setModalType, setTargetChannelId, setIsClosed } = modalActions;

  const rollbar = useRollbar();

  const { targetChannelId } = useSelector((state) => state.modal);

  const channels = useSelector(channelSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => name);

  const handleClose = () => {
    dispatch(setModalType({ type: null }));
    dispatch(setIsClosed({ isOpen: false }));
    dispatch(setTargetChannelId({ targetChannelId: null }));
  };

  const handleRename = async (data, setFormSubmitting) => {
    if (!channels) {
      return;
    }
    const { removable } = channels
      .find(({ id }) => id === targetChannelId);

    if (removable) {
      const renamedChannel = {
        id: targetChannelId,
        name: filter.clean(data.channelName.trim()),
      };
      await renameChannel(renamedChannel).then(() => {
        handleClose();
        setFormSubmitting(false);
        toast.success(t('toasts.channelRenamed'));
      })
        .catch((e) => {
          setHasNetworkError(true);
          setTimeout(() => setFormSubmitting(false), 2000);
          rollbar.error('Rename channel error', e);
          toast.error(t('toasts.networkError'));
        });
    }
  };

  const modalType = 'rename';
  const { type } = useSelector((state) => state.modal);
  const { isOpen } = useSelector(((state) => state.modal));
  const shouldOpen = isOpen && type === modalType;
  const { name: channelName } = channels.find(({ id }) => id === targetChannelId) || '';

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
          initialValues={{ channelName: `${channelName}` }}
        />
      )}
      modalFooter={null}
    />
  );
};

export default RenameChannelModal;
