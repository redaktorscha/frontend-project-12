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
import { useSocketFunctions } from '../../hooks';

const AddChannelModal = ({ setBtnFocused }) => {
  const { setIsOpen, setType } = modalActions;
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(setIsOpen({ isOpen: false }));
    dispatch(setType({ type: null }));
    setBtnFocused(true);
  };

  const { t } = useTranslation();
  const rollbar = useRollbar();
  const { addNewChannel } = useSocketFunctions();
  const channels = useSelector(channelSelectors.selectAll) || [];
  const channelsNames = channels.map(({ name }) => name);

  const modalType = 'add';
  const { isOpen, type } = useSelector((state) => state.modal);
  const shouldOpen = isOpen && type === modalType;

  const handleAdd = (data) => {
    try {
      const newChannel = {
        name: filter.clean(data.channelName.trim()),
      };
      addNewChannel(newChannel, (response) => {
        if (response.status === 'ok') {
          toast.success(t('toasts.channelCreated'));
          return;
        }
        toast.error(t('toasts.networkError'));
      });
    } catch (e) {
      rollbar.error('Add channel error', e);
      toast.error(t('toasts.networkError'));
    }
    handleClose();
  };

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
      handleClose={handleClose}
      modalTitle={t('ui.modals.addChannelHeader')}
      modalBody={(
        <ModalForm
          shouldOpen={shouldOpen}
          handleClose={handleClose}
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
