import React, { useEffect, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import isEmpty from 'lodash/isEmpty';

const LoginForm = ({ setFormLoginData, setFormIsValid, formAuthError }) => {
  const { t } = useTranslation();
  const usernameTooltip = useRef(null);
  const inputUsername = useRef(null);
  const inputPassword = useRef(null);

  useEffect(() => {
    if (formAuthError !== '') {
      [inputUsername, inputPassword].forEach((ref) => {
        ref.current.classList.remove('is-valid');
        ref.current.classList.add('is-invalid');
      });
      // usernameTooltip.current.style.display = 'none';
    }
  }, [formAuthError]);

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
      onSubmit={() => { console.log('login submit'); }}
      initialValues={{
        username: '',
        password: '',
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
