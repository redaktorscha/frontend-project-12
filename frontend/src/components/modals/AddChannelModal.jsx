// ts-check
import { useTranslation } from 'react-i18next';
import filter from 'leo-profanity';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import { useRollbar } from '@rollbar/react';
import { selectors as channelSelectors } from '../../slices/channelsSlice.js';
import { actions as modalActions } from '../../slices/modalSlice.js';
import Modal from './Modal';
import ModalForm from './ModalForm';
import { useChatApi } from '../../hooks';

const AddChannelModal = ({ setBtnFocused }) => {
  const { handleClose } = modalActions;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const rollbar = useRollbar();
  const { addNewChannel } = useChatApi();

  const channels = useSelector(channelSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => name);

  const handleCloseModal = () => {
    dispatch(handleClose({ type: null, targetChannelId: null }));
    setBtnFocused(true);
  };

  const handleAdd = async (data, setFormSubmitting) => {
    const newChannel = {
      name: filter.clean(data.channelName.trim()),
    };

    await addNewChannel(newChannel)
      .then(() => {
        handleCloseModal();
        setFormSubmitting(false);
        toast.success(t('toasts.channelCreated'));
      })
      .catch((e) => {
        if (e.message === 'network error') {
          toast.error(t('toasts.networkError'));
        } else {
          toast.error(t('toasts.unknownError'));
        }
        setTimeout(() => setFormSubmitting(false), 2000);
        rollbar.error('Add channel error', e);
      });
  };

  const modalType = 'add';
  const { type } = useSelector((state) => state.modal);
  const { isOpened } = useSelector(((state) => state.modal));
  const shouldOpen = isOpened && type === modalType;

  const addChannelSchema = yup
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
      modalTitle={t('ui.modals.addChannelHeader')}
      modalBody={(
        <ModalForm
          shouldOpen={shouldOpen}
          handleClose={handleCloseModal}
          eventHandler={handleAdd}
          validationSchema={addChannelSchema}
          initialValues={{ channelName: '' }}
        />
      )}
      modalFooter={null}
    />
  );
};

export default AddChannelModal;
