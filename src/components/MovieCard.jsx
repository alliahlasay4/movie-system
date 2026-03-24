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

  const isTV = movie.media_type === "tv" || (!movie.title && movie.name);

  const year = (movie.release_date || movie.first_air_date)?.split("-")[0];

  const isNew = year && Number(year) >= 2024;

  const isTrending = movie.popularity > 150; // adjust threshold if needed

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
            className="w-full h-[300px] object-cover"
          />
        ) : (
          <div className="h-[300px] flex items-center justify-center text-textMuted">
            No Image
          </div>
        )}

        {/* Type badge */}
        <div className="absolute top-2 left-2 bg-accentViolet text-xs px-2 py-1 rounded text-white">
          {isTV ? "TV" : "Movie"}
        </div>

        {/* Rating */}
        <div className="absolute top-2 right-2 bg-black/70 text-xs px-2 py-1 rounded-md text-white">
          ⭐ {movie.vote_average?.toFixed(1) || "N/A"}
        </div>

        {/* NEW badge */}
        {isNew && (
          <div className="absolute bottom-2 left-2 bg-green-500 text-[10px] px-2 py-1 rounded text-white">
            NEW
          </div>
        )}

        {/* Trending badge */}
        {isTrending && (
          <div className="absolute bottom-2 right-2 bg-orange-500 text-[10px] px-2 py-1 rounded text-white">
            🔥 HOT
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 space-y-1">
        <h2 className="text-sm font-semibold text-textMain line-clamp-2">
          {movie.title || movie.name}
        </h2>

        {/* Genres */}
        <p className="text-xs text-textMuted">
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

        {/* Runtime / Seasons */}
        <p className="text-xs text-textMuted">
          {movie.runtime
            ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
            : movie.number_of_seasons
              ? `${movie.number_of_seasons} Season${movie.number_of_seasons > 1 ? "s" : ""}`
              : ""}
        </p>
      </div>
    </div>
  );
}