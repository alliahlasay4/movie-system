import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserMovies } from "../utils/userMovies";
import MovieCard from "../components/MovieCard";

export default function Watchlist() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser"));

    if (!user) {
      navigate("/login");
      return;
    }

    const data = getUserMovies(user.id);

    const watchlist = Object.entries(data)
      .filter(([_, value]) => value.watchlist)
      .map(([movieId]) => JSON.parse(localStorage.getItem(`movie-${movieId}`)))
      .filter(Boolean);

    setMovies(watchlist);
  }, []);

  return (
    <div className="min-h-screen bg-bg px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Your Watchlist</h1>

        {movies.length === 0 ? (
          <p className="text-textMuted">No watchlist items yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}