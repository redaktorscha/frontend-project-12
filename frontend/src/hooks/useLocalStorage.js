import { useEffect, useState, useRef } from 'react';

const useLocalStorage = (key, defaultValue = null) => {
  const [storageValue, setStorageValue] = useState(() => JSON.parse(localStorage
    .getItem(key)) || defaultValue);

  const prevValue = useRef(storageValue);

  useEffect(() => {
    if (storageValue !== null) {
      localStorage.setItem(key, JSON.stringify(storageValue));
      prevValue.current = storageValue;
      return;
    }
    if (prevValue.current !== null) {
      localStorage.removeItem(key); // for logout
    }
  }, [storageValue, key]);

  return [storageValue, setStorageValue];
};

export default useLocalStorage;
