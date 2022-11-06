// ts-check
import {
  Container, Row, Col, Card, Form, Image, Button,
} from 'react-bootstrap';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Link } from 'react-router-dom';
import Wrapper from './Wrapper';
import login from '../assets/login.svg';

const Login = () => {
  const schema = yup.object().shape({
    username: yup.string().required(),
    password: yup.string().required(),
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
                    src={login}
                    alt="Login"
                  />
                </Col>
                <Col className="col-12 col-md-6 mt-3 mt-mb-0">
                  <h1 className="text-center mb-4">Login</h1>
                  <Formik
                    validationSchema={schema}
                    onSubmit={() => {}}
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
                      <Form noValidate onSubmit={handleSubmit}>
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
                          />
                          <Form.Label>Your password</Form.Label>
                          <Form.Control.Feedback type="invalid" tooltip>
                            {errors.password}
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
    </Wrapper>

  );
};

export default Login;
