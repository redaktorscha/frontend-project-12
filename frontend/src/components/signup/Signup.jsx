// ts-check
import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Card, Image,
  Form, Button,
} from 'react-bootstrap';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import axios from 'axios';
import { useRollbar } from '@rollbar/react';
import signup from '../../assets/signup.svg';
import { appRoutes, SIGNUP_ENDPOINT } from '../../utils/routes';
import { useAuth } from '../../hooks';

const SignupForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logIn } = useAuth();
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

  useEffect(() => {
    inputUsername.current.focus();
  }, []);

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
    }
  };

  return (
    <Formik
      validationSchema={signupSchema}
      initialValues={initialValues}
      validateOnChange={false}
      onSubmit={handleSubmitSignup}
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
              isValid={touched.username && !errors.username && !signupError}
              isInvalid={(touched.username && !!errors.username) || !!signupError}
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
              isValid={touched.password && !errors.password && !signupError}
              isInvalid={(touched.password && !!errors.password) || !!signupError}
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
              isValid={touched.confirmPassword && !errors.confirmPassword && !signupError}
              isInvalid={(touched.confirmPassword && !!errors.confirmPassword) || !!signupError}
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

const Signup = () => {
  const { t } = useTranslation();

  return (
    <Container fluid>
      <Row className="justify-content-center align-items-center">
        <Col className="col-12 col-md-8 col-xxl-6">
          <Card className="shadow-sm">
            <Card.Body as={Row} className="p-5">
              <Col className="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <Image
                  fluid
                  src={signup}
                  alt="Login"
                  className="mt-4"
                />
              </Col>
              <Col className="col-12 col-md-6 mt-3 mt-mb-0">
                <h1 className="text-center mb-4">{t('ui.signup.signup')}</h1>
                <SignupForm />
              </Col>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
