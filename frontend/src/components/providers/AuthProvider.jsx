import { useState, useMemo } from 'react';
import { AuthContext } from '../../contexts';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user'))?.username || null);
  const userData = useMemo(() => ({ user, setUser }), [user]);

  return (
    <AuthContext.Provider value={userData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
