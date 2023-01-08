// ts-check
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import {
  Container, Row, Col, Card, Image,
} from 'react-bootstrap';
import login from '../../../assets/login.svg';
import LoginForm from './LoginForm';

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
