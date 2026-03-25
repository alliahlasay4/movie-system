import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Favorites() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);

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

  if (!user) return null;

  return (
    <div className="min-h-screen bg-bg text-textMain pt-24 px-6">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-semibold mb-8">
          Your Favorites
        </h1>

        {favorites.length === 0 ? (
          <p className="text-textMuted">
            No favorites yet. Start adding movies.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favorites.map((movie) => (
              <div
                key={movie.id}
                className="bg-surface border border-border rounded-xl overflow-hidden"
              >
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full h-64 object-cover"
                />

                <div className="p-4">
                  <h2 className="text-sm font-medium mb-2">
                    {movie.title || movie.name}
                  </h2>

                  <button
                    onClick={() => removeFavorite(movie.id)}
                    className="text-xs text-red-400 hover:text-red-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}