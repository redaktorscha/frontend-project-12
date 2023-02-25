import { useContext } from 'react';
import { ChatApiContext } from '../contexts';

const useChatApi = () => useContext(ChatApiContext);

export default useChatApi;
