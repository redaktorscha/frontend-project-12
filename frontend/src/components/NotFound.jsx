import {
  Container, Image, Row, Col,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import notfound from '../assets/404.svg';

const NotFound = () => (
  <Container fluid>
    <Row className="min-vh-100 d-flex justify-content-center">
      <Col className="col-sm-8 col-md-6 col-lg-4 d-flex flex-column align-items-center">
        <Image
          fluid
          src={notfound}
        />
        <h1 className="h3 text-muted">Page not found</h1>
        <small className="text-muted">
          Would you like to return
        </small>
        <Link to="/">to the main page?</Link>
      </Col>
    </Row>
  </Container>
);

export default NotFound;
