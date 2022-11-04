// ts-check
import { Stack, Container } from 'react-bootstrap';
import Header from './Header';

const Chat = () => (
  <Container fluid className="min-vh-100">
    <Stack className="bg-light mx-auto">
      <Header />
    </Stack>
  </Container>
);
export default Chat;
