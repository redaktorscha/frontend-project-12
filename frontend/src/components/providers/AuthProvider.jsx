import { useMemo } from 'react';
import { AuthContext } from '../../contexts';
import useLocalStorage from '../../utils/useLocalStorage';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user');
  const userData = useMemo(() => ({ user, setUser }), [user, setUser]);
  return (
    <AuthContext.Provider value={userData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
