import { useContext } from 'react';
import { ApiContext } from '../contexts';

const useSocketFunctions = () => useContext(ApiContext);

export default useSocketFunctions;
