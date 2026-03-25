export default function MovieModal({ movie, onClose }) {

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

  if (!movie) return null;

  return (
    <div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-xl overflow-hidden w-[1000px] max-w-[95%] h-[80vh] shadow-2xl flex"
        onClick={(e) => e.stopPropagation()}
      >

        {/* LEFT: Poster */}
        <div className="w-1/2 h-full bg-black flex items-center justify-center">
          {movie.poster_path ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title || movie.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-textMuted">No Image</div>
          )}
        </div>

        <div className="w-1/2 h-full p-6 flex flex-col justify-between overflow-y-auto">

          <div className="space-y-4">

            {/* Title */}
            <h2 className="text-2xl font-semibold text-textMain">
              {movie.title || movie.name}
            </h2>

            {/* Tagline (if exists) */}
            {movie.tagline && (
              <p className="text-sm italic text-textMuted">
                {movie.tagline}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap gap-2 text-xs text-textMuted">
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              <span>•</span>
              <span>{(movie.release_date || movie.first_air_date)?.split("-")[0]}</span>
              <span>•</span>
              <span className="uppercase">{movie.original_language}</span>
              <span>•</span>
              <p className="text-sm text-textMuted">
                {movie.genres
                  ? movie.genres.map(g => g.name).join(", ")
                  : movie.genre_ids
                    ?.map(id => genreMap[id])
                    .filter(Boolean)
                    .join(", ") || "No genres available"}
              </p>
            </div>

            {/* Genres */}
            <p className="text-sm text-textMuted">
              {movie.genre_ids
                ?.map(id => genreMap[id])
                .filter(Boolean)
                .join(", ") || "No genres available"}
            </p>

            {/* Overview */}
            <p className="text-sm text-textMuted leading-relaxed">
              {movie.overview || "No description available."}
            </p>

            {/* Extra Info */}
            <div className="text-xs text-textMuted space-y-2 pt-2">

              {/* Popularity */}
              {movie.popularity && (
                <p>🔥 Popularity: {Math.round(movie.popularity)}</p>
              )}

              {/* Votes */}
              {movie.vote_count && (
                <p>🗳 Votes: {movie.vote_count}</p>
              )}

              {/* Runtime / Seasons */}
              {movie.runtime && (
                <p>
                  ⏱ Runtime: {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </p>
              )}

              {movie.number_of_seasons && (
                <p>
                  📺 Seasons: {movie.number_of_seasons}
                </p>
              )}

              {/* Status */}
              {movie.status && (
                <p>📌 Status: {movie.status}</p>
              )}

              {/* Adult */}
              {movie.adult !== undefined && (
                <p>{movie.adult ? "🔞 Adult" : "👨‍👩‍👧 Family Friendly"}</p>
              )}
            </div>

          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="mt-4 bg-accentViolet hover:bg-accentVioletHover text-white py-2 rounded-md text-sm"
          >
            Close
          </button>

        </div>
      </div>
    </div>
  );
}