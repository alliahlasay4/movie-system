import { useEffect, useState } from "react";
import { fetchPopularMovies, searchMovies } from "../services/api";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [minRating, setMinRating] = useState(0);

  // NEW: dropdown states
  const [sortOpen, setSortOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    loadMovies();
  }, []);

  const loadMovies = async () => {
    const data = await fetchPopularMovies();
    setMovies(data.results);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return loadMovies();

    const data = await searchMovies(query);
    setMovies(data.results);
  };

  const processedMovies = movies
    .filter((movie) => movie.vote_average >= minRating)
    .sort((a, b) => {
      if (sortBy === "rating") {
        return b.vote_average - a.vote_average;
      }
      if (sortBy === "latest") {
        return new Date(b.release_date) - new Date(a.release_date);
      }
      return 0;
    });

  return (
    <div className="max-w-7xl mx-auto px-6 py-6">

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-3 mb-4">
        <input
          type="text"
          placeholder="Search movies..."
          className="flex-1 px-4 py-2 rounded bg-surface border border-border 
             text-textMain placeholder:text-textMuted
             focus:outline-none focus:ring-2 focus:ring-accentViolet"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="bg-accentViolet border border-border px-5 py-2 rounded text-white hover:bg-accentVioletHover transition">
          Search
        </button>
      </form>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">

        {/* Sort Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setSortOpen(!sortOpen);
              setRatingOpen(false);
            }}
            className="bg-surface px-3 py-2 rounded border border-border text-sm text-textMain w-40 text-left"
          >
            {sortBy === "rating"
              ? "Top Rated"
              : sortBy === "latest"
                ? "Latest"
                : "Sort By"}
          </button>

          {sortOpen && (
            <div className="absolute mt-2 w-40 bg-[#111827] border border-border rounded-md shadow-lg z-50">
              <div
                onClick={() => {
                  setSortBy("");
                  setSortOpen(false);
                }}
                className="px-4 py-2 text-sm text-textMain hover:bg-accentViolet hover:text-white cursor-pointer"
              >
                Sort By
              </div>
              <div
                onClick={() => {
                  setSortBy("rating");
                  setSortOpen(false);
                }}
                className="px-4 py-2 text-sm text-textMain hover:bg-accentViolet hover:text-white cursor-pointer"
              >
                Top Rated
              </div>
              <div
                onClick={() => {
                  setSortBy("latest");
                  setSortOpen(false);
                }}
                className="px-4 py-2 text-sm text-textMain hover:bg-accentViolet hover:text-white cursor-pointer"
              >
                Latest
              </div>
            </div>
          )}
        </div>

        {/* Rating Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setRatingOpen(!ratingOpen);
              setSortOpen(false);
            }}
            className="bg-surface px-3 py-2 rounded border border-border text-sm text-textMain w-40 text-left"
          >
            {minRating === 0 ? "All Ratings" : `${minRating}+ ⭐`}
          </button>

          {ratingOpen && (
            <div className="absolute mt-2 w-40 bg-[#111827] border border-border rounded-md shadow-lg z-50">
              {[0, 5, 6, 7, 8].map((rate) => (
                <div
                  key={rate}
                  onClick={() => {
                    setMinRating(rate);
                    setRatingOpen(false);
                  }}
                  className="px-4 py-2 text-sm text-textMain hover:bg-accentViolet hover:text-white cursor-pointer"
                >
                  {rate === 0 ? "All Ratings" : `${rate}+ ⭐`}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reset */}
        <button
          onClick={() => {
            setSortBy("");
            setMinRating(0);
          }}
          className="bg-red-500 px-4 py-2 rounded text-sm hover:opacity-90"
        >
          Reset
        </button>

      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {processedMovies?.map((movie) => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onClick={() => setSelectedMovie(movie)}
          />

        ))}

        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      </div>
    </div>
  );
}