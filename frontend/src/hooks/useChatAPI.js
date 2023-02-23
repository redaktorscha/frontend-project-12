import { useContext } from 'react';
import { ApiContext } from '../contexts';

const useChatAPI = () => useContext(ApiContext);

export default useChatAPI;
