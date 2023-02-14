import { useMemo } from 'react';
import { ApiContext } from '../../contexts';

const ApiProvider = ({ functions, children }) => {
  const socketApi = useMemo(() => ({ ...functions }), [functions]);

  return (
    <ApiContext.Provider value={socketApi}>
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;
