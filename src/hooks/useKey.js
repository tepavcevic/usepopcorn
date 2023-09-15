import { useEffect } from 'react';

export default function useKey(key, action) {
  useEffect(() => {
    const callback = (event) => {
      if (event.code.toLowerCase() === key.toLowerCase()) {
        action();
      }
    };

    document.addEventListener('keydown', callback);

    return () => {
      document.removeEventListener('keydown', callback);
    };
  }, [action, key]);
}
