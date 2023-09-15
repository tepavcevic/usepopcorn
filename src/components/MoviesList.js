import Movie from './Movie';

export default function MoviesList({ movies, selectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Movie key={movie?.imdbID} movie={movie} selectMovie={selectMovie} />
      ))}
    </ul>
  );
}
