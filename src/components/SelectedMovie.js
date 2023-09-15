import { useEffect, useRef, useState } from 'react';

import useTitle from '../hooks/useTitle';
import { API_BASE_URL } from '../constants/apiKey';
import StarRating from './StarRating';
import Loader from './Loader';
import useKey from '../hooks/useKey';

export default function SelectedMovie({
  selectedId,
  closeMovie,
  addWatchedMovie,
  removeWatchedMovie,
  watched,
}) {
  const [movie, setMovie] = useState({});
  const [userRating, setUserRating] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const countRef = useRef(0);

  const isWatched = watched.some((movie) => movie.imdbID === selectedId);
  const currentMovieUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  useTitle(`MOVIE: ${title}`);

  const handleAdd = () => {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
      countRatingDecisions: countRef.current,
    };
    addWatchedMovie(newWatchedMovie);
    closeMovie();
  };

  const handleRemove = () => {
    removeWatchedMovie(selectedId);
    closeMovie();
  };

  useKey('Escape', closeMovie);

  useEffect(() => {
    if (userRating) countRef.current += 1;
  }, [userRating]);

  useEffect(() => {
    const controller = new AbortController();

    const getMovieDetails = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}&i=${selectedId}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        setMovie(data);
        setIsLoading(false);
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.log(error);
        }
      }
    };

    getMovieDetails();

    return () => controller.abort();
  }, [selectedId]);

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={closeMovie}>
              <span>&larr;</span>
            </button>
            <img src={poster} alt={`Poster of ${title}`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDB Rating
              </p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    defaultRating={userRating}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating && (
                    <button className="btn-add" onClick={() => handleAdd()}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <>
                  <p>You rated this movie with {currentMovieUserRating} 🌟</p>
                  <button
                    className="btn-add"
                    onClick={() => handleRemove(selectedId)}
                  >
                    Remove from the list
                  </button>
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  );
}
