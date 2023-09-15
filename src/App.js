import { useCallback, useState } from 'react';

import useTitle from './hooks/useTitle';
import useLocalStorage from './hooks/useLocalStorage';
import Navbar from './components/Navbar';
import Main from './components/Main';
import Box from './components/Box';
import WatchedSummary from './components/WatchedSummary';
import WatchedList from './components/WatchedList';
import MoviesList from './components/MoviesList';
import Search from './components/Search';
import NumberOfResults from './components/NumberOfResults';
import Logo from './components/Logo';
import Loader from './components/Loader';
import NoMovieFound from './components/NoMovieFound';
import SelectedMovie from './components/SelectedMovie';
import useMovies from './hooks/useMovies';

export default function App() {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(null);

  useTitle('usePopcorn');
  const [watched, setWatched] = useLocalStorage('WatchedList', []);

  const handleSelectedMovie = (id) =>
    setSelectedId((selectedId) => (id === selectedId ? null : id));

  const handleCloseMovie = useCallback(() => setSelectedId(null), []);

  const handleAddWatched = (movie) =>
    setWatched((watched) => [...watched, movie]);

  const handleRemoveWatched = (selectedId) => {
    const newWatched = watched.filter((movie) => movie.imdbID !== selectedId);
    setWatched(newWatched);
  };

  const { movies, isLoading, error } = useMovies(query, handleCloseMovie);

  return (
    <>
      <Navbar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumberOfResults movieCount={movies?.length} />
      </Navbar>

      <Main>
        <Box>
          {isLoading ? (
            <Loader />
          ) : error.length ? (
            <NoMovieFound message={error} />
          ) : (
            <MoviesList movies={movies} selectMovie={handleSelectedMovie} />
          )}
        </Box>

        <Box>
          {selectedId ? (
            <SelectedMovie
              selectedId={selectedId}
              closeMovie={handleCloseMovie}
              addWatchedMovie={handleAddWatched}
              removeWatchedMovie={handleRemoveWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                removeWatchedMovie={handleRemoveWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}
