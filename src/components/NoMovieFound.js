export default function NoMovieFound({ message }) {
  return (
    <p className="error">
      <span>⛔️</span> {message}
    </p>
  );
}
