export default function MovieModal({ movie, onClose }) {
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
        <div className="w-1/2 h-full bg-black">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* RIGHT: Content */}
        <div className="w-1/2 h-full p-6 flex flex-col justify-between overflow-y-auto">

          <div className="space-y-3">

            {/* Title */}
            <h2 className="text-xl font-semibold text-textMain">
              {movie.title || movie.name}
            </h2>

            {/* Meta */}
            <div className="flex flex-wrap gap-2 text-xs text-textMuted">
              <span>⭐ {movie.vote_average?.toFixed(1)}</span>
              <span>•</span>
              <span>
                {(movie.release_date || movie.first_air_date)?.split("-")[0]}
              </span>
              {movie.original_language && (
                <>
                  <span>•</span>
                  <span className="uppercase">{movie.original_language}</span>
                </>
              )}
            </div>

            {/* Overview */}
            <p className="text-sm text-textMuted leading-relaxed">
              {movie.overview || "No description available."}
            </p>

            {/* Extra Info */}
            <div className="text-xs text-textMuted space-y-1 pt-2">
              {movie.popularity && (
                <p>🔥 Popularity: {Math.round(movie.popularity)}</p>
              )}
              {movie.vote_count && (
                <p>🗳 Votes: {movie.vote_count}</p>
              )}
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