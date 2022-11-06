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

const Footer = () => (
  <footer className="container-fluid fixed-bottom d-flex justify-content-center bg-light border-top border-light">
    <a href="https://storyset.com/online" target="_blank" className="py-3 link-dark text-muted" rel="noreferrer">Online illustrations by Storyset</a>
  </footer>
);

const Wrapper = ({ showCopyrightCredit = true, children }) => (
  <div className="vh-100 vw-100 d-flex flex-column bg-light">
    <Header />
    {children}
    {showCopyrightCredit && <Footer />}
  </div>
);

export default Wrapper;
