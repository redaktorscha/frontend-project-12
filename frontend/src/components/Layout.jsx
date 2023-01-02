/* eslint-disable no-unused-vars */
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Container, Navbar, Button,
} from 'react-bootstrap';
import React, { Navigate, useContext } from 'react';
import AuthContext from '../contexts/AuthContext';

const rootRoute = '/';

const Header = ({ logOut, hasBtn }) => (
  <Navbar expand="lg" className="flex-shrink-0 shadow-sm bg-white mb-2">
    <Container>
      <Link className="navbar-brand" to="/">Hexlet Chat</Link>
      { hasBtn && <Button variant="primary" onClick={() => { logOut(); }}>Logout</Button>}
    </Container>
  </Navbar>
);

const Footer = () => (
  <footer className="container-fluid mt-auto d-flex justify-content-center flex-shrink-0 bg-light border-top border-light">
    <a href="https://storyset.com/online" target="_blank" className="py-3 link-dark text-muted" rel="noreferrer">Online illustrations by Storyset</a>
  </footer>
);

const Layout = () => {
  const { setUser } = useContext(AuthContext);
  const logOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  const { pathname } = useLocation();
  const hasFooter = pathname !== rootRoute;
  const hasBtn = pathname === rootRoute;

  return (
    <div className="vh-100 vw-100 d-flex flex-column justify-content-between bg-light">
      <Header logOut={logOut} hasBtn={hasBtn} />
      <main className="d-flex align-items-center flex-grow-1 py-4">
        <Outlet />
      </main>
      {hasFooter && <Footer />}
    </div>
  );
};

export default Layout;
