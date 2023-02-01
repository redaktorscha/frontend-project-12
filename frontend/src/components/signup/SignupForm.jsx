// ts-check
import React, { useRef, useEffect, useState } from 'react';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import axios from 'axios';
import { Form, Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useRollbar } from '@rollbar/react';
import { appRoutes, SIGNUP_ENDPOINT } from '../../utils/routes';
import { useAuth } from '../../hooks';

const SignupForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logIn, logOut } = useAuth();
  const rollbar = useRollbar();

  const [signupError, setSignupError] = useState('');

  const signupSchema = yup
    .object()
    .shape({
      username: yup
        .string()
        .trim()
        .required(t('errors.signup.required'))
        .min(3, t('errors.signup.usernameSize'))
        .max(20, t('errors.signup.usernameSize')),
      password: yup
        .string()
        .trim()
        .required(t('errors.signup.required'))
        .min(6, t('errors.signup.passwordSize')),
      confirmPassword: yup
        .string()
        .trim()
        .required(t('errors.signup.required'))
        .oneOf([yup.ref('password'), null], t('errors.signup.oneOf')),
    });

  const initialValues = {
    username: '',
    password: '',
    confirmPassword: '',
  };

  const inputUsername = useRef(null);
  const inputPassword = useRef(null);
  const inputConfirmPassword = useRef(null);

  useEffect(() => {
    inputUsername.current.focus();
  }, []);

  useEffect(() => {
    if (signupError !== '') {
      [inputUsername, inputPassword, inputConfirmPassword].forEach((ref) => {
        ref.current.classList.remove('is-valid');
        ref.current.classList.add('is-invalid');
      });
    }
  }, [signupError]);

  const handleSubmitSignup = async (formData) => {
    const route = appRoutes[SIGNUP_ENDPOINT]();
    try {
      setSignupError('');
      const response = await axios.post(route, formData);
      const { data } = response;
      if (data) {
        logIn(data);
        navigate('/');
      }
    } catch (e) {
      if (e.response.status === 409) {
        setSignupError(t('errors.signup.exists'));
      } else {
        rollbar.error('signup error', e);
        toast.error(t('toasts.networkError'));
      }
      logOut(); // ? remove?
    }
  };

  return (
    <Formik
      validationSchema={signupSchema}
      initialValues={initialValues}
      validateOnChange={false}
      onSubmit={async (values) => {
        await handleSubmitSignup(values);
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

          <Form.Group
            key="username"
            className="form-floating mb-4"
            controlId="f-username"
          >
            <Form.Control
              type="text"
              name="username"
              autoComplete="off"
              required
              placeholder={t('ui.signup.username')}
              value={values.username}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.username && !errors.username}
              isInvalid={touched.username && !!errors.username}
              ref={inputUsername}
            />
            <Form.Label>{t('ui.signup.username')}</Form.Label>
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.username}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            key="password"
            className="form-floating mb-4"
            controlId="f-password"
          >
            <Form.Control
              type="password"
              name="password"
              autoComplete="off"
              required
              placeholder={t('ui.signup.password')}
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.password && !errors.password}
              isInvalid={touched.password && !!errors.password}
              ref={inputPassword}
            />
            <Form.Label>{t('ui.signup.password')}</Form.Label>
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group
            key="confirmPassword"
            className="form-floating mb-4"
            controlId="f-confirmPassword"
          >
            <Form.Control
              type="password"
              name="confirmPassword"
              autoComplete="off"
              required
              placeholder={t('ui.signup.confirmPassword')}
              value={values.confirmPassword}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.confirmPassword && !errors.confirmPassword}
              isInvalid={touched.confirmPassword && !!errors.confirmPassword}
              ref={inputConfirmPassword}
            />
            <Form.Label>{t('ui.signup.confirmPassword')}</Form.Label>
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.confirmPassword || signupError}
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            type="submit"
            variant="outline-primary"
            className="w-100 mb-3"
            disabled={isSubmitting}
          >
            {t('ui.signup.btnSignup')}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

export default SignupForm;
