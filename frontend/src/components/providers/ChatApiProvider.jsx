import { useMemo, useState } from 'react';
import { ChatApiContext } from '../../contexts';

const ChatApiProvider = ({ functions, children }) => {
  const [connectionError, setConnectionError] = useState(false);
  const chatApi = useMemo(
    () => ({ ...functions, connectionError, setConnectionError }),
    [functions, connectionError, setConnectionError],
  );

  return (
    <ChatApiContext.Provider value={chatApi}>
      {children}
    </ChatApiContext.Provider>
  );
};

export default ChatApiProvider;
