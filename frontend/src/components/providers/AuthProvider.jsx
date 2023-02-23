import { useMemo } from 'react';
import { AuthContext } from '../../contexts';
import { useLocalStorage } from '../../hooks';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage('user');

  const userData = useMemo(() => {
    const logIn = (authData) => setUser(authData);
    const logOut = () => setUser(null);
    return {
      user, logIn, logOut,
    };
  }, [user, setUser]);

  return (
    <AuthContext.Provider value={userData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
