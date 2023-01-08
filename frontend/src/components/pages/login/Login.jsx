// ts-check
import React, { useContext, useState, useEffect } from 'react';
import { useRollbar } from '@rollbar/react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container, Row, Col, Card, Image,
} from 'react-bootstrap';

import { useTranslation } from 'react-i18next';

import axios from 'axios';

import { toast } from 'react-toastify';
import login from '../../../assets/login.svg';
import { AuthContext } from '../../../contexts';
import getRoute from '../../../utils/getRoute';
import LoginForm from './LoginForm';

const Login = () => {
  const [formLoginData, setFormLoginData] = useState({ username: null, password: null });
  const [formAuthError, setFormAuthError] = useState('');
  const [formIsValid, setFormIsValid] = useState(false);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const rollbar = useRollbar();

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
                <LoginForm
                  setFormLoginData={setFormLoginData}
                  setFormIsValid={setFormIsValid}
                  formAuthError={formAuthError}
                />
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
