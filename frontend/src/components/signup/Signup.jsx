// ts-check
import React from 'react';
import {
  Container, Row, Col, Card, Image,
} from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import signup from '../../assets/signup.svg';
import SignupForm from './SignupForm';

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
