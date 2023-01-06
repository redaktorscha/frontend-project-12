import { SocketContext } from '../../contexts';

const SocketProvider = ({ functions, children }) => (
  <SocketContext.Provider value={functions}>
    {children}
  </SocketContext.Provider>
);

export default SocketProvider;
