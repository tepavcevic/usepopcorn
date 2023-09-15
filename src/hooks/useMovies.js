import { useEffect, useState } from 'react';
import { API_BASE_URL } from '../constants/apiKey';

export default function useMovies(query, handleCloseMovie) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const controller = new AbortController();

    const fetchMovies = async () => {
      try {
        setError('');
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}s=${query}`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error('Something went wrong with fetching movies.');
        }
        const data = await response.json();

        if (data.Response === 'False') {
          throw new Error('Movie not found.');
        }
        setMovies(data.Search);
        setError('');
      } catch (error) {
        if (error.name !== 'AbortError') {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length < 3) {
      setMovies([]);
      setError('');
      return;
    }

    handleCloseMovie?.();
    fetchMovies();

    return () => controller.abort();
  }, [handleCloseMovie, query]);

  return { movies, isLoading, error };
}
