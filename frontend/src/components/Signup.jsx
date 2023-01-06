/* eslint-disable no-unused-vars */
// ts-check
import React, {
  useEffect, useState, useContext, useRef,
} from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import {
  Container, Row, Col, Card, Form, Image, Button,
} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { useRollbar } from '@rollbar/react';
import signup from '../assets/signup.svg';
import AuthContext from '../contexts/AuthContext';
import getRoute from '../utils/getRoute';

const Signup = () => {
  const [formIsValid, setFormIsValid] = useState(false);
  const [formSignupError, setFormSignupError] = useState('');
  const [formSignupData, setFormSignupData] = useState({ username: null, password: null });
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const inputUsername = useRef(null);
  const inputPassword = useRef(null);
  const inputConfirmPassword = useRef(null);
  const { t } = useTranslation();

  const rollbar = useRollbar();

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
  // yup.setLocale({
  //   mixed: {
  //     required: t('errors.signup.required'),
  //     oneOf: t('errors.signup.oneOf'),
  //   },
  // });

  useEffect(() => {
    console.log('formIsValid', formIsValid);

    const registerUser = async () => {
      const signupRoute = getRoute('signup');
      console.log('formSignupData', formSignupData);
      try {
        setFormSignupError('');
        const response = await axios.post(signupRoute, formSignupData);
        const { data } = response;
        console.log('signup data', data);
        if (data) {
          localStorage.setItem('user', JSON.stringify(data));
          setUser(data.username);
          navigate('/');
        }
      } catch (e) {
        if (e.response.status === 409) {
          setFormSignupError(t('errors.signup.exists'));
        } else {
          rollbar.error('Signup error', e);
          toast.error(t('toasts.networkError'));
        }
        setUser(null);
      }
    };
    if (!formIsValid) {
      return;
    }
    registerUser();
  }, [t, formIsValid, formSignupData, navigate, setUser]);

  useEffect(() => {
    if (formSignupError !== '') {
      [inputUsername, inputPassword, inputConfirmPassword].forEach((ref) => {
        ref.current.classList.remove('is-valid');
        ref.current.classList.add('is-invalid');
      });
    }
  }, [formSignupError]);

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
                <Formik
                  validationSchema={signupSchema}
                  onSubmit={() => { console.log('signup submit'); }}
                  initialValues={{
                    username: '',
                    password: '',
                    confirmPassword: '',
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
                        const { username, password } = values;
                        setFormSignupData({ username, password });
                        console.log('errors', isEmpty(errors));
                        console.log('formSignupData', formSignupData);
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
                        <Form.Label>{t('ui.signup.username')}</Form.Label>
                        <Form.Control.Feedback type="invalid" tooltip>
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
                        <Form.Label>{t('ui.signup.password')}</Form.Label>
                        <Form.Control.Feedback type="invalid" tooltip>
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Form.Group
                        controlId="f-password-confirm"
                        className="form-floating mb-4"
                      >
                        <Form.Control
                          type="password"
                          name="confirmPassword"
                          autoComplete="off"
                          required
                          placeholder="Confirm password"
                          value={values.confirmPassword}
                          onChange={handleChange}
                          isValid={touched.confirmPassword && !errors.confirmPassword}
                          isInvalid={!!errors.confirmPassword}
                          ref={inputConfirmPassword}
                        />
                        <Form.Label>{t('ui.signup.confirmPassword')}</Form.Label>
                        <Form.Control.Feedback type="invalid" tooltip>
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="invalid" tooltip>
                          {formSignupError}
                        </Form.Control.Feedback>
                      </Form.Group>
                      <Button
                        type="submit"
                        variant="outline-primary"
                        className="w-100 mb-3"
                      >
                        {t('ui.signup.btnSignup')}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
