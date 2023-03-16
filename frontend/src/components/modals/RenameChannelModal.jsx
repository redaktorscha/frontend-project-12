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
  const { renameChannel } = useChatApi();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { handleClose } = modalActions;

  const rollbar = useRollbar();

  const { targetChannelId } = useSelector((state) => state.modal);

  const channels = useSelector(channelSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => name);

  const handleCloseModal = () => {
    dispatch(handleClose({ type: null, isOpened: false, targetChannelId: null }));
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
        handleCloseModal();
        setFormSubmitting(false);
        toast.success(t('toasts.channelRenamed'));
      })
        .catch((e) => {
          if (e.message === 'network error') {
            toast.error(t('toasts.networkError'));
          } else {
            toast.error(t('toasts.unknownError'));
          }
          setTimeout(() => setFormSubmitting(false), 2000);
          rollbar.error('Rename channel error', e);
        });
    }
  };

  const modalType = 'rename';
  const { type } = useSelector((state) => state.modal);
  const { isOpened } = useSelector(((state) => state.modal));
  const shouldOpen = isOpened && type === modalType;
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
      handleClose={handleCloseModal}
      modalTitle={t('ui.modals.renameChannelHeader')}
      modalBody={(
        <ModalForm
          shouldOpen={shouldOpen}
          handleClose={handleCloseModal}
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
