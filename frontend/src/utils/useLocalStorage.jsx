import { useEffect, useState } from 'react';

const useLocalStorage = (key, defaultValue) => {
  const [storageValue, setStorageValue] = useState(() => JSON.parse(localStorage
    .getItem(key)) || defaultValue);

  useEffect(() => {
    if (storageValue === null) {
      localStorage.removeItem(key);
      return;
    }
    localStorage.setItem(key, JSON.stringify(storageValue));
  }, [storageValue, key]);

  return [storageValue, setStorageValue];
};

export default useLocalStorage;
