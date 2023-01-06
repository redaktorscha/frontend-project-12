// ts-check
import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import { useRollbar } from '@rollbar/react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, Row, Col, Card, Form, Image, Button,
} from 'react-bootstrap';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import { toast } from 'react-toastify';
import login from '../assets/login.svg';
import AuthContext from '../contexts/AuthContext';
import getRoute from '../utils/getRoute';

const Login = () => {
  const [formLoginData, setFormLoginData] = useState({ username: null, password: null });
  const [formAuthError, setFormAuthError] = useState('');
  const [formIsValid, setFormIsValid] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();
  const inputUsername = useRef(null);
  const inputPassword = useRef(null);
  const usernameTooltip = useRef(null);

  const rollbar = useRollbar();

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

  // yup.setLocale({
  //   mixed: {
  //     required: t('errors.login.required'),
  //   },
  // });

  const { setUser } = useContext(AuthContext);

  useEffect(() => {
    if (!formIsValid) {
      return;
    }
    const getAuthToken = async () => {
      const loginRoute = getRoute('login');
      try {
        setFormAuthError('');
        const response = await axios.post(loginRoute, formLoginData);
        const { data } = response;
        if (data) {
          localStorage.setItem('user', JSON.stringify(data));
          setUser(data.username);
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

  useEffect(() => {
    if (formAuthError !== '') {
      [inputUsername, inputPassword].forEach((ref) => {
        ref.current.classList.remove('is-valid');
        ref.current.classList.add('is-invalid');
      });
      // usernameTooltip.current.style.display = 'none';
    }
  }, [formAuthError]);

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
                <Formik
                  validationSchema={loginSchema}
                  onSubmit={() => { console.log('login submit'); }} // _noop
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
