import MovieCard from "./MovieCard";
import { Link } from "react-router-dom";


export default function MovieRow({ title, movies, onClick, viewMoreLink }) {
  return (
    <div className="space-y-3">

      <div className="flex items-center justify-between">

        <h2 className="text-lg font-semibold text-textMain">
          {title}
        </h2>

        {viewMoreLink && (
          <Link to={viewMoreLink} className="text-sm text-textMuted hover:text-white">
            View more →
          </Link>
        )}

      </div>

      <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">

        {movies.map((movie) => (
          <div
            key={movie.id}
            className="min-w-[160px] snap-start"
          >
            <div className="scale-[0.95] hover:scale-100 transition">
              <MovieCard
                movie={movie}
                onClick={() => onClick(movie)}
              />
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}