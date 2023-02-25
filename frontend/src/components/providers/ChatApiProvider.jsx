import { useMemo } from 'react';
import { ChatApiContext } from '../../contexts';

const ChatApiProvider = ({ functions, children }) => {
  const chatApi = useMemo(() => ({ ...functions }), [functions]);

  return (
    <ChatApiContext.Provider value={chatApi}>
      {children}
    </ChatApiContext.Provider>
  );
};

export default ChatApiProvider;
