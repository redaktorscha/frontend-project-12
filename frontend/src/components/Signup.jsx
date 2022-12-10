// ts-check
import {
  Container, Row, Col, Card, Form, Image, Button,
} from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import Wrapper from './Wrapper';
import signup from '../assets/signup.svg';

const Signup = () => {
  const schema = yup.object().shape({
    username: yup.string().required().min(2).max(20),
    password: yup.string().required().min(6),
    confirmPassword: yup.string().required().oneOf([yup.ref('password'), null], 'Passwords must match'),
  });

  return (
    <Wrapper>
      <Container fluid>
        <Row className="justify-content-center align-items-center min-vh-100">
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
                  <h1 className="text-center mb-4">Signup</h1>
                  <Formik
                    validationSchema={schema}
                    onSubmit={() => { console.log('submit'); }}
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
                      <Form noValidate onSubmit={handleSubmit}>
                        {/* {console.log(values)} */}
                        <Form.Group
                          className="form-floating mb-4"
                          controlId="f-username"
                        >
                          <Form.Control
                            type="text"
                            name="username"
                            autoComplete="off"
                            placeholder="Username"
                            value={values.username}
                            onChange={handleChange}
                            isValid={touched.username && !errors.username}
                            isInvalid={!!errors.username}
                          />
                          <Form.Label>Username</Form.Label>
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
                          />
                          <Form.Label>Password</Form.Label>
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
                          />
                          <Form.Label>Confirm password</Form.Label>
                          <Form.Control.Feedback type="invalid" tooltip>
                            {errors.confirmPassword}
                          </Form.Control.Feedback>
                        </Form.Group>
                        <Button
                          type="submit"
                          variant="outline-primary"
                          className="w-100 mb-3"
                        >
                          Signup
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
    </Wrapper>

  );
};

export default Signup;
