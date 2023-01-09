import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Container, Navbar, Button,
} from 'react-bootstrap';
import React, { useContext } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import { AuthContext } from '../contexts';

const rootRoute = '/';

const Header = ({ t, logOut, hasBtn }) => (
  <Navbar expand="lg" className="flex-shrink-0 shadow-sm bg-white">
    <Container>
      <Link className="navbar-brand" to="/">Hexlet Chat</Link>
      { hasBtn && <Button variant="primary" onClick={() => { logOut(); }}>{t('ui.header.btnLogout')}</Button>}
    </Container>
  </Navbar>
);

const Footer = ({ t }) => (
  <footer className="container-fluid mt-auto d-flex justify-content-center flex-shrink-0 bg-light border-top border-light">
    <a
      href="https://storyset.com/online"
      target="_blank"
      className="py-3 link-dark text-muted"
      rel="noreferrer"
    >
      {t('ui.footer.picturesCopyright')}
    </a>
  </footer>
);

const Layout = () => {
  const { t } = useTranslation();
  const { setUser } = useContext(AuthContext);
  const logOut = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  const { pathname } = useLocation();
  const hasFooter = pathname !== rootRoute;
  const hasBtn = pathname === rootRoute;

  return (
    <div className="vh-100 d-flex flex-column justify-content-between bg-light">
      <Header t={t} logOut={logOut} hasBtn={hasBtn} />
      <main className="d-flex align-items-center flex-grow-1 my-auto py-2">
        <Outlet />
      </main>
      {hasFooter && <Footer t={t} />}
      <ToastContainer />
    </div>
  );
};

export default Layout;
