import { useContext } from 'react';
import { SocketContext } from '../contexts';

const useSocketFunctions = () => useContext(SocketContext);

export default useSocketFunctions;
