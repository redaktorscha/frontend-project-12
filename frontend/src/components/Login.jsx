import { Stack, Container } from 'react-bootstrap';
import Header from './Header';

const Login = () => (
  <Container fluid className="min-vh-100">
    <Stack className="bg-light mx-auto">
      <Header />
    </Stack>
  </Container>
);

export default Login;
