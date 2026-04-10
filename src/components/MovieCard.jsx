import { useState, useEffect } from "react";

import { Heart } from "lucide-react";

export default function MovieCard({ movie, onClick }) {

  const genreMap = {
    28: "Action",
    12: "Adventure",
    16: "Animation",
    35: "Comedy",
    18: "Drama",
    27: "Horror",
    10749: "Romance",
    878: "Sci-Fi",
  };

  const isTV = movie.media_type === "tv";

  const year = (movie.release_date || movie.first_air_date)?.split("-")[0];

  const currentYear = new Date().getFullYear();
  const isNew = year && Number(year) >= currentYear - 1;

  const isTrending = movie.popularity > 150;
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const isFavorited = () => {
    if (!user) return false;

    const allFavorites =
      JSON.parse(localStorage.getItem("favorites")) || {};

    const userFavorites = allFavorites[user.id] || [];

    return userFavorites.some((m) => m.id === movie.id);
  };

  const toggleFavorite = (e) => {
    e.stopPropagation();

    if (!user) return;

    const allFavorites =
      JSON.parse(localStorage.getItem("favorites")) || {};

    const userFavorites = allFavorites[user.id] || [];

    const exists = userFavorites.some((m) => m.id === movie.id);

    let updated;

    if (exists) {
      updated = userFavorites.filter((m) => m.id !== movie.id);
    } else {
      updated = [...userFavorites, movie];
    }

    allFavorites[user.id] = updated;
    localStorage.setItem("favorites", JSON.stringify(allFavorites));

    setFavorited(!exists); // ✅ force UI update
  };

  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    setFavorited(isFavorited());
  }, [movie.id]);

  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-surface rounded-xl border border-border overflow-hidden 
                 transition duration-300 hover:scale-[1.03] hover:border-accentViolet"
    >
      {/* Poster */}
      <div className="relative">
        {movie.poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title || movie.name}
            className="w-full h-[220px] sm:h-[240px] md:h-[260px] lg:h-[280px] xl:h-[320px] object-cover"
          />
        ) : (
          <div className="h-[220px] sm:h-[240px] md:h-[260px] lg:h-[280px] xl:h-[320px] flex items-center justify-center text-textMuted">
            No Image
          </div>
        )}

        {/* ❤️ Favorite Button (top right like Netflix style) */}
        <button
          onClick={toggleFavorite}
          className={`absolute top-2 right-2 bg-black/70 backdrop-blur p-2 rounded-full transition ${favorited
              ? "text-red-500 scale-110"
              : "text-white hover:bg-black"
            }`}
        >
          <Heart
            size={16}
            className={favorited ? "fill-red-500" : ""}
          />
        </button>
        {/* Type badge */}
        <div className="absolute top-2 left-2 bg-accentViolet text-xs px-2 py-1 rounded text-white">
          {isTV ? "TV" : "Movie"}
        </div>

        {/* Rating */}
        <div className="absolute top-10 right-2 bg-black/70 text-xs px-2 py-1 rounded-md text-white">
          ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
        </div>

      </div>

      {/* Content */}
      <div className="p-3 space-y-1">
        <h2 className="text-sm sm:text-base md:text-[15px] font-semibold text-textMain line-clamp-2">
          {movie.title || movie.name}
        </h2>

        {/* Genres */}
        <p className="text-[11px] sm:text-xs text-textMuted">
          {movie.genre_ids
            ?.slice(0, 2)
            .map(id => genreMap[id])
            .filter(Boolean)
            .join(", ") || "—"}
        </p>

        {/* Year */}
        <p className="text-xs text-textMuted">
          {year || "—"}
        </p>
      </div>

    </div>
  );
}