import { useState, useMemo } from 'react';
import AuthContext from './AuthContext';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // useEffect(() => {
  //   setUser(null); // async request /data?
  // }, []);

  const userData = useMemo(() => ({ user, setUser }), [user]);

  return (
    <AuthContext.Provider value={userData}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
