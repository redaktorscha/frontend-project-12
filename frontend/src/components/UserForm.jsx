import React, {
  useEffect, useState, useContext,
} from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import axios from 'axios';
import { useRollbar } from '@rollbar/react';
import { AuthContext } from '../contexts';
import getRoute from '../utils/getRoute';

const UserForm = ({
  eventType, errorCode, renderData, validationSchema,
}) => {
  const [formHandleError, setFormHandleError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
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
      console.log('e.response.status', e.response.status);
      if (e.response.status === errorCode) {
        if (eventType === 'signup') {
          setFormHandleError(t(`errors.${eventType}.exists`));
        } else {
          setFormHandleError(t(`errors.${eventType}.invalid`));
        }
        console.log('formHandleError', formHandleError);
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
      onSubmit={(values) => {
        handleUser(values);
      }}
    >
      {({
        handleSubmit,
        handleChange,
        values,
        touched,
        errors,
      }) => (
        <Form
          noValidate
          onSubmit={handleSubmit}
        >
          {inputs.map(({
            type, inputName, ref, label,
          }) => (
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
                isValid={touched[inputName] && !errors[inputName]}
                isInvalid={!!errors[inputName]}
                ref={ref}
              />
              <Form.Label>{label}</Form.Label>
              <Form.Control.Feedback type="invalid" tooltip>
                {errors[inputName]}
              </Form.Control.Feedback>
            </Form.Group>
          ))}
          <Form.Control.Feedback type="invalid" tooltip>
            {formHandleError}
          </Form.Control.Feedback>
          <Button
            type="submit"
            variant="outline-primary"
            className="w-100 mb-3"
          >
            {buttonText}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default UserForm;
