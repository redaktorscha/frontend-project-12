import SocketContext from '../contexts/SocketContext';
import socketFunctions from '../socket-client';

const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={socketFunctions}>
    {children}
  </SocketContext.Provider>
);

export default SocketProvider;
