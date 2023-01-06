// ts-check
import React, {
  useContext, useRef, useEffect,
} from 'react';
import { Form, Button, Modal as BootstrapModal } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRollbar } from '@rollbar/react';
import filter from 'leo-profanity';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import * as yup from 'yup';
import { selectors as channelSelectors } from '../../slices/channelsSlice.js';
import { setIsOpen, setType, setTargetChannel } from '../../slices/modalSlice.js';
import { SocketContext } from '../../contexts';

filter.loadDictionary('ru');

const RenameChannelForm = ({
  t, shouldOpen, handleClose, handleRename,
}) => {
  const inputRef = useRef(null);
  const channels = useSelector(channelSelectors.selectAll);
  const channelsNames = channels.map(({ name }) => name);
  const { targetChannel } = useSelector((state) => state.modal);

  useEffect(() => {
    if (shouldOpen) {
      inputRef.current.focus();
    }
  }, [shouldOpen]);

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
    <Formik
      validationSchema={renameChannelSchema}
      initialValues={{
        channelName: `${targetChannel}`,
      }}
      onSubmit={(values) => handleRename(values)}
    >
      {
      ({
        handleChange, handleSubmit, values, errors,
      }) => (
        <Form
          className="flex-fill border rounded-2 py-2 px-2"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <Form.Group className="d-flex align-items-center">
            <Form.Control
              className="border-0 p-1"
              type="text"
              name="channelName"
              value={values.channelName}
              onChange={handleChange}
              autoComplete="off"
              isInvalid={!!errors.channelName}
              ref={inputRef}
            />
            <Form.Label className="visually-hidden">{t('ui.modals.renameChannelHeader')}</Form.Label>
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.channelName}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="d-flex align-items-center justify-content-end pt-3">
            <Button className="me-2" variant="secondary" onClick={handleClose}>
              {t('ui.modals.cancel')}
            </Button>
            <Button type="submit" variant="primary">
              {t('ui.modals.send')}
            </Button>
          </Form.Group>

        </Form>
      )
    }
    </Formik>
  );
};

const RenameChannelModal = () => {
  const { renameChannel } = useContext(SocketContext);
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

  return (
    <BootstrapModal centered show={shouldOpen} onHide={handleClose}>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{t('ui.modals.addChannelHeader')}</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body>
        <RenameChannelForm
          t={t}
          shouldOpen={shouldOpen}
          handleClose={handleClose}
          handleRename={handleRename}
        />
      </BootstrapModal.Body>
    </BootstrapModal>
  );
};

export default RenameChannelModal;
