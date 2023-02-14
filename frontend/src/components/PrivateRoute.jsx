import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';
import appRoutes from '../utils/routes.js';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  const loginRoute = appRoutes.loginPath();

  if (!user) {
    return (
      <Navigate to={loginRoute} replace />
    );
  }

  return children;
};

export default PrivateRoute;
