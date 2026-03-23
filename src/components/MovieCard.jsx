export default function MovieCard({ movie, onClick }) {
  return (
    <div className="bg-surface rounded-xl border border-border overflow-hidden 
                    transition duration-300 hover:scale-[1.03] hover:border-accentViolet">

      {/* Poster */}
      <div className="relative">
        <img
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          className="w-full h-[300px] object-cover"
        />

        {/* Rating badge */}
        <div className="absolute top-2 right-2 bg-black/70 text-xs px-2 py-1 rounded-md text-white">
          ⭐ {movie.vote_average.toFixed(1)}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        <h2 className="text-sm font-semibold text-textMain line-clamp-2">
          {movie.title}
        </h2>

        {/* Optional: release year */}
        <p className="text-xs text-textMuted mt-1">
          {movie.release_date?.split("-")[0]}
        </p>
      </div>
    </div>
  );
}