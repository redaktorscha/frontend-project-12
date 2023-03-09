import React, {
  useRef, useEffect,
} from 'react';
import { Formik } from 'formik';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

const ModalForm = ({
  shouldOpen, handleClose, eventHandler, validationSchema, initialValues,
}) => {
  const inputRef = useRef(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (shouldOpen) {
      inputRef.current.focus();
    }
  }, [shouldOpen]);

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      onSubmit={(values, { setSubmitting }) => {
        eventHandler(values, setSubmitting);
      }}
    >
      {
        ({
          handleChange, handleSubmit, values, errors, isSubmitting,
        }) => (
          <Form
            className="flex-fill border rounded-2 py-2 px-2"
            noValidate
            onSubmit={handleSubmit}
          >
            <Form.Group className="d-flex align-items-center">
              <Form.Control
                id="modal-input"
                className="border-0 p-1"
                type="text"
                name="channelName"
                value={values.channelName}
                onChange={handleChange}
                autoComplete="off"
                isInvalid={!!errors.channelName}
                ref={inputRef}
              />
              <Form.Label htmlFor="modal-input" visuallyHidden>{t('ui.modals.channelName')}</Form.Label>
              <Form.Control.Feedback type="invalid" tooltip>
                {errors.channelName}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="d-flex align-items-center justify-content-end pt-3">
              <Button className="me-2" variant="secondary" onClick={handleClose} disabled={isSubmitting}>
                {t('ui.modals.cancel')}
              </Button>
              <Button type="submit" variant="primary" disabled={isSubmitting}>
                {t('ui.modals.send')}
              </Button>
            </Form.Group>
          </Form>
        )

      }
    </Formik>
  );
};

export default ModalForm;
