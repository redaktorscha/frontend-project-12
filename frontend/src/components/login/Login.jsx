// ts-check
import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import {
  Container, Row, Col, Card, Image,
  Form, Button,
} from 'react-bootstrap';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { Formik } from 'formik';
import axios from 'axios';
import { useRollbar } from '@rollbar/react';
import login from '../../assets/login.svg';
import { appRoutes, LOGIN_ENDPOINT } from '../../utils/routes';
import { useAuth } from '../../hooks';

const LoginForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logIn, logOut } = useAuth();
  const rollbar = useRollbar();

  const [loginError, setLoginError] = useState('');

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

  const initialValues = {
    username: '',
    password: '',
  };

  const inputUsername = useRef(null);
  const inputPassword = useRef(null);

  useEffect(() => {
    inputUsername.current.focus();
  }, []);

  // useEffect(() => {
  //   if (loginError !== '') {
  //     [inputUsername, inputPassword].forEach((ref) => {
  //       ref.current.classList.remove('is-valid');
  //       ref.current.classList.add('is-invalid');
  //     });
  //   }
  // }, [loginError]);

  const handleSubmitLogin = async (formData) => {
    const route = appRoutes[LOGIN_ENDPOINT]();
    try {
      setLoginError('');
      const response = await axios.post(route, formData);
      const { data } = response;
      if (data) {
        logIn(data);
        navigate('/');
      }
    } catch (e) {
      if (e.response.status === 401) {
        setLoginError(t('errors.login.invalid'));
      } else {
        rollbar.error('login error', e);
        toast.error(t('toasts.networkError'));
      }
      logOut(); // ? remove?
    }
  };

  return (
    <Formik
      validationSchema={loginSchema}
      initialValues={initialValues}
      validateOnChange={false}
      validateOnBlur={false}
      onSubmit={async (values) => {
        await handleSubmitLogin(values);
      }}
    >
      {({
        handleSubmit,
        handleChange,
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
              placeholder={t('ui.login.username')}
              value={values.username}
              onChange={handleChange}
              isValid={touched.username && !errors.username && !loginError}
              isInvalid={(touched.username && !!errors.username) || !!loginError}
              ref={inputUsername}
            />
            <Form.Label>{t('ui.login.username')}</Form.Label>
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
              placeholder={t('ui.login.password')}
              value={values.password}
              onChange={handleChange}
              isValid={touched.password && !errors.password && !loginError}
              isInvalid={(touched.password && !!errors.password) || !!loginError}
              ref={inputPassword}
            />
            <Form.Label>{t('ui.login.password')}</Form.Label>
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.password || loginError}
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            type="submit"
            variant="outline-primary"
            className="w-100 mb-3"
            disabled={isSubmitting}
          >
            {t('ui.login.btnLogin')}
          </Button>
        </Form>
      )}
    </Formik>
  );
};

const Login = () => {
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
                  src={login}
                  alt="Login"
                />
              </Col>
              <Col className="col-12 col-md-6 mt-3 mt-mb-0">
                <h1 className="text-center mb-4">{t('ui.login.enter')}</h1>
                <LoginForm />
              </Col>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-center p-4">
              <span className="me-2">{t('ui.login.spanNoAcc')}</span>
              <Link to="/signup">{t('ui.login.linkRegister')}</Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
