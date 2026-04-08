import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MovieModal from "../components/MovieModal";
import MovieCard from "../components/MovieCard";
import { fetchDetails } from "../services/api";

export default function Favorites() {
  const navigate = useNavigate();

  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [sortBy, setSortBy] = useState("latest");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      navigate("/login");
      return;
    }

    setUser(currentUser);

    const allFavorites =
      JSON.parse(localStorage.getItem("favorites")) || {};

    const userFavorites = allFavorites[currentUser.id] || [];
    setFavorites(userFavorites);
  }, [navigate]);

  const removeFavorite = (movieId) => {
    const allFavorites =
      JSON.parse(localStorage.getItem("favorites")) || {};

    const updated = (allFavorites[user.id] || []).filter(
      (m) => m.id !== movieId
    );

    allFavorites[user.id] = updated;
    localStorage.setItem("favorites", JSON.stringify(allFavorites));
    setFavorites(updated);
  };

  const openMovie = async (movie) => {
    try {
      const type =
        movie.media_type ||
        (movie.title ? "movie" : "tv");

      const full = await fetchDetails(movie.id, type);
      setSelectedMovie(full);
    } catch {
      alert("Failed to load movie");
    }
  };

  // 🎯 FILTER + SORT
  const processed = favorites
    .filter((m) => {
      if (typeFilter === "all") return true;
      if (typeFilter === "movie") return m.title;
      if (typeFilter === "tv") return m.name;
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return (b.vote_average || 0) - (a.vote_average || 0);
      }
      return b.id - a.id;
    });

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg text-textMain pt-24 px-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-3xl font-semibold">
              Your Favorites
            </h1>
            <p className="text-textMuted text-sm">
              {favorites.length} saved items
            </p>
          </div>

          {/* CONTROLS */}
          <div className="flex gap-3">

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-surface border border-border px-3 py-2 rounded text-sm"
            >
              <option value="latest">Latest</option>
              <option value="rating">Top Rated</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-surface border border-border px-3 py-2 rounded text-sm"
            >
              <option value="all">All</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
            </select>

          </div>
        </div>

        {/* EMPTY */}
        {processed.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-lg mb-2">Nothing here yet</p>
            <p className="text-textMuted mb-6">
              Add movies to your favorites
            </p>

            <button
              onClick={() => navigate("/")}
              className="bg-accentViolet px-6 py-2 rounded text-white"
            >
              Browse
            </button>
          </div>
        ) : (

          /* GRID */
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">

            {processed.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => openMovie(movie)}
                showRemove
                onRemove={removeFavorite}
              />
            ))}

          </div>
        )}

        {/* MODAL */}
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />

      </div>
    </div>
  );
}