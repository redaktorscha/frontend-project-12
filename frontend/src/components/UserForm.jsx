import React, {
  useEffect, useState,
} from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import axios from 'axios';
import { useRollbar } from '@rollbar/react';
import getRoute from '../utils/getRoute';
import { useAuth } from '../hooks';

const UserForm = ({
  eventType, errorCode, renderData, validationSchema,
}) => {
  const [formHandleError, setFormHandleError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { t } = useTranslation();

  const rollbar = useRollbar();

  const { inputs, buttonText } = renderData;

  const refs = inputs.reduce((acc, cur) => {
    acc.push(cur.ref);
    return acc;
  }, []);

  const initialValues = inputs.reduce((acc, cur) => {
    acc[cur.inputName] = '';
    return acc;
  }, {});

  const handleUser = async (formData) => {
    const signupRoute = getRoute(eventType);
    try {
      setFormHandleError('');
      const response = await axios.post(signupRoute, formData);
      const { data } = response;
      if (data) {
        setUser(data);
        navigate('/');
      }
    } catch (e) {
      if (e.response.status === errorCode) {
        if (eventType === 'signup') {
          setFormHandleError(t(`errors.${eventType}.exists`));
        } else {
          setFormHandleError(t(`errors.${eventType}.invalid`));
        }
      } else {
        rollbar.error(`${eventType} error`, e);
        toast.error(t('toasts.networkError'));
      }
      setUser(null);
    }
  };
  useEffect(() => {
    if (formHandleError !== '') {
      refs.forEach((ref) => {
        ref.current.classList.remove('is-valid');
        ref.current.classList.add('is-invalid');
      });
    }
  }, [formHandleError, refs]);

  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialValues}
      validateOnChange={false}
      onSubmit={async (values) => {
        await handleUser(values);
      }}
    >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        errors,
        isSubmitting,
      }) => (
        <Form
          noValidate
          onSubmit={handleSubmit}
        >
          {inputs.map(({
            type, inputName, ref, label,
          }, i) => (
            <Form.Group
              key={inputName}
              className="form-floating mb-4"
              controlId={`f-${inputName}`}
            >
              <Form.Control
                type={type}
                name={inputName}
                autoComplete="off"
                required
                placeholder={label}
                value={values[inputName]}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched[inputName] && !errors[inputName]}
                isInvalid={touched[inputName] && !!errors[inputName]}
                ref={ref}
              />
              <Form.Label>{label}</Form.Label>
              <Form.Control.Feedback type="invalid" tooltip>
                {i === inputs.length - 1 ? errors[inputName] || formHandleError : errors[inputName]}
              </Form.Control.Feedback>
            </Form.Group>
          ))}
          <Button
            type="submit"
            variant="outline-primary"
            className="w-100 mb-3"
            disabled={isSubmitting}
          >
            {buttonText}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;
