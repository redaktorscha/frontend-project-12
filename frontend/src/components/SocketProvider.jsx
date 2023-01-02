import SocketContext from '../contexts/SocketContext';

const SocketProvider = ({ functions, children }) => (
  <SocketContext.Provider value={functions}>
    {children}
  </SocketContext.Provider>
);

export default SocketProvider;
