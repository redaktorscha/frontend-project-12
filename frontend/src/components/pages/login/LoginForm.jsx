import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import { useRollbar } from '@rollbar/react';
import { useNavigate } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty';
import { AuthContext } from '../../../contexts';
import getRoute from '../../../utils/getRoute';

const LoginForm = () => {
  const [formLoginData, setFormLoginData] = useState({ username: null, password: null });
  const [formAuthError, setFormAuthError] = useState('');
  const [formIsValid, setFormIsValid] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const rollbar = useRollbar();

  const { setUser } = useContext(AuthContext);

  const usernameTooltip = useRef(null);
  const inputUsername = useRef(null);
  const inputPassword = useRef(null);

  useEffect(() => {
    if (formAuthError !== '') {
      [inputUsername, inputPassword].forEach((ref) => {
        ref.current.classList.remove('is-valid');
        ref.current.classList.add('is-invalid');
      });
    }
  }, [formAuthError]);

  useEffect(() => {
    if (!formIsValid) {
      return;
    }
    const getAuthToken = async () => {
      const loginRoute = getRoute('login');
      try {
        setFormAuthError('');
        console.log('formLoginData', formLoginData);
        const response = await axios.post(loginRoute, formLoginData);
        const { data } = response;
        console.log('data', data);
        if (data) {
          setUser(data);
          navigate('/');
        }
      } catch (e) {
        if (e.response.status === 401) {
          setFormAuthError(t('errors.login.invalid'));
        } else {
          rollbar.error('Auth error', e);
          toast.error(t('toasts.networkError'));
        }
        setUser(null);
      }
    };
    getAuthToken();
  }, [t, rollbar, formIsValid, formLoginData, setUser, navigate]);

  const loginSchema = yup
    .object()
    .shape({
      username: yup
        .string()
        .trim()
        .required(t('errors.login.required')),
      password: yup
        .string()
        .trim()
        .required(t('errors.login.required')),
    });

  return (
    <Formik
      validationSchema={loginSchema}
      initialValues={{
        username: '',
        password: '',
      }}
      onSubmit={() => { console.log('login submit'); }}
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
          onSubmit={(e) => {
            e.preventDefault();
            setFormLoginData({ ...values });
            setFormIsValid(isEmpty(errors));
            handleSubmit();
          }}
        >
          <Form.Group
            className="form-floating mb-4"
            controlId="f-username"
          >
            <Form.Control
              type="text"
              name="username"
              autoComplete="off"
              required
              placeholder="Username"
              value={values.username}
              onChange={handleChange}
              isValid={touched.username && !errors.username}
              isInvalid={!!errors.username}
              ref={inputUsername}
            />
            <Form.Label>{t('ui.login.username')}</Form.Label>
            <Form.Control.Feedback type="invalid" tooltip ref={usernameTooltip}>
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            controlId="f-password"
            className="form-floating mb-4"
          >
            <Form.Control
              type="password"
              name="password"
              autoComplete="off"
              required
              placeholder="Password"
              value={values.password}
              onChange={handleChange}
              isValid={touched.password && !errors.password}
              isInvalid={!!errors.password}
              ref={inputPassword}
            />
            <Form.Label>{t('ui.login.password')}</Form.Label>
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.password}
            </Form.Control.Feedback>
            <Form.Control.Feedback type="invalid" tooltip>
              {formAuthError}
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            type="submit"
            variant="outline-primary"
            className="w-100 mb-3"
          >
            {t('ui.login.btnLogin')}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
