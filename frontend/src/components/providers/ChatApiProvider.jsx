import { useMemo, useState } from 'react';
import { ChatApiContext } from '../../contexts';

const ChatApiProvider = ({ functions, children }) => {
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const chatApi = useMemo(
    () => ({ ...functions, hasNetworkError, setHasNetworkError }),
    [functions, hasNetworkError, setHasNetworkError],
  );

  return (
    <ChatApiContext.Provider value={chatApi}>
      {children}
    </ChatApiContext.Provider>
  );
};

export default ChatApiProvider;
