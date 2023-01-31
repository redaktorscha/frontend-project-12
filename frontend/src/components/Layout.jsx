import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  Container, Navbar, Button,
} from 'react-bootstrap';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../hooks';

const rootRoute = '/';

const supportedLanguages = ['ru', 'en'];

const switchLanguage = ({ value }, i18n) => {
  i18n.changeLanguage(value);
};

const LanguagePicker = () => {
  const { t, i18n } = useTranslation();
  return (
    <select id="select" className="py-2 rounded" onChange={(e) => switchLanguage(e.target, i18n)}>
      {supportedLanguages.map((language) => (
        <option
          key={language}
          value={language}
        >
          {t(`ui.header.${language}`)}

        </option>
      ))}
    </select>
  );
};

const Header = ({
  t, logOut, hasBtn,
}) => (
  <Navbar expand="lg" className="flex-shrink-0 shadow-sm bg-white">
    <Container>
      <Link className="navbar-brand" to="/">Hexlet Chat</Link>
      <LanguagePicker />
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
  const { logOut } = useAuth();
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
