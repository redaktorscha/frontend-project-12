import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks';

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Navigate to="/login" replace />
    );
  }

  return children;
};

export default PrivateRoute;
