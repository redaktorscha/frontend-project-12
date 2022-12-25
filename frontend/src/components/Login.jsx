// ts-check
import React, {
  useContext, useState, useEffect, useRef,
} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, Row, Col, Card, Form, Image, Button,
} from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import isEmpty from 'lodash/isEmpty';
import login from '../assets/login.svg';
import AuthContext from '../contexts/AuthContext';
import getRoute from '../utils/getRoute';

const Login = () => {
  const [formLoginData, setFormLoginData] = useState({ username: null, password: null });
  const [formAuthError, setFormAuthError] = useState('');
  const [formIsValid, setFormIsValid] = useState(false);
  const navigate = useNavigate();
  const inputPassword = useRef();

  const loginSchema = yup
    .object()
    .shape({
      username: yup
        .string()
        .trim()
        .required(),
      password: yup
        .string()
        .trim()
        .required(),
    });
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
        console.log('LoginErr', e);
        setUser(null);
        setFormAuthError('wrong username or password');
      }
    };
    getAuthToken();
  }, [formIsValid, formLoginData, setUser, navigate]);

  useEffect(() => {
    if (formAuthError !== '') {
      inputPassword.current.classList.remove('is-valid');
      inputPassword.current.classList.add('is-invalid');
    }
  }, [formAuthError]);

  return (
    <Container fluid>
      <Row className="justify-content-center align-items-center min-vh-100">
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
                <h1 className="text-center mb-4">Login</h1>
                <Formik
                  validationSchema={loginSchema}
                  onSubmit={() => {}} // _noop
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
                          placeholder="Your nick"
                          value={values.username}
                          onChange={handleChange}
                          isValid={touched.username && !errors.username}
                          isInvalid={!!errors.username}
                        />
                        <Form.Label>Your nick</Form.Label>
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
                          placeholder="Your password"
                          value={values.password}
                          onChange={handleChange}
                          isValid={touched.password && !errors.password}
                          isInvalid={!!errors.password}
                          ref={inputPassword}
                        />
                        <Form.Label>Your password</Form.Label>
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
                        Enter
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Col>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-center p-4">
              <span className="me-2">No account?</span>
              <Link to="/signup">Register</Link>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
