import { useMemo } from 'react';
import { SocketContext } from '../../contexts';

const SocketProvider = ({ functions, children }) => {
  const socketApi = useMemo(() => ({ ...functions }), [functions]);

  return (
    <SocketContext.Provider value={socketApi}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
