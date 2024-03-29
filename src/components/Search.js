import { useRef } from 'react';

import useKey from '../hooks/useKey';

export default function Search({ query, setQuery }) {
  const inputRef = useRef();

  useKey('Enter', () => {
    if (document.activeElement === inputRef.current) return;

    inputRef.current.focus();
    setQuery('');
  });
  return (
    <input
      className="search"
      type="text"
      ref={inputRef}
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
    />
  );
}
