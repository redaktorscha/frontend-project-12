import { useTranslation } from 'react-i18next';
import {
  Container, Image, Row, Col,
} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import notfound from '../../../assets/404.svg';

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <Container fluid>
      <Row className="d-flex justify-content-center">
        <Col className="col-sm-8 col-md-6 col-lg-4 d-flex flex-column align-items-center">
          <Image
            fluid
            src={notfound}
          />
          <h1 className="h3 text-muted">{t('ui.notfound.heading')}</h1>
          <small className="text-muted">
            {t('ui.notfound.text')}
          </small>
          <Link to="/">{t('ui.notfound.link')}</Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
