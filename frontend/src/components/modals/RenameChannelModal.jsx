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
  const { renameChannel, setConnectionError } = useChatApi();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const rollbar = useRollbar();

  const { targetChannel } = useSelector((state) => state.modal);
  const channels = useSelector(channelSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => name);

  const { setModalType, setTargetChannel } = modalActions;

  const handleClose = () => {
    dispatch(setModalType({ type: null }));
    dispatch(setTargetChannel({ targetChannel: null }));
  };

  const handleRename = async (data) => {
    if (!channels) {
      return;
    }
    const [{ id }] = channels
      .filter(({ name, removable }) => removable && (name === targetChannel));
    if (targetChannel) {
      handleClose();
      const renamedChannel = {
        id,
        name: filter.clean(data.channelName.trim()),
      };
      await renameChannel(renamedChannel).then(() => {
        toast.success(t('toasts.channelRenamed'));
      })
        .catch((e) => {
          if (e.message === 'connection error') {
            setConnectionError(true);
            return;
          }
          rollbar.error('Rename channel error', e);
          toast.error(t('toasts.networkError'));
        });
    }
  };
  const modalType = 'rename';
  const { type } = useSelector((state) => state.modal);
  const shouldOpen = type === modalType;

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
