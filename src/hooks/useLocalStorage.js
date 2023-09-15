import { useEffect, useState } from 'react';

export default function useLocalStorageMovies(storageKey, initialState) {
  const [value, setValue] = useState(() => {
    const storedValues = localStorage.getItem(storageKey);
    return JSON.parse(storedValues) || initialState;
  });

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(value));
  }, [value, storageKey]);

  return [value, setValue];
}
