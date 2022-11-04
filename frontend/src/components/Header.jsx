// ts-check
import { Link } from 'react-router-dom';
import {
  Container, Navbar, Button,
} from 'react-bootstrap';

const Header = () => (
  <Navbar expand="lg" className="shadow-sm bg-white">
    <Container>
      <Link className="navbar-brand" to="/">Hexlet Chat</Link>
      <Button variant="primary">Logout</Button>
    </Container>
  </Navbar>
);

export default Header;
