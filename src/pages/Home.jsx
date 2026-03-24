import { useEffect, useState } from "react";
import {
  fetchTrending,
  fetchPopularMovies,
  fetchPopularTV,
  searchMulti
} from "../services/api";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [minRating, setMinRating] = useState(0);

  const [typeFilter, setTypeFilter] = useState("all");
  const [typeOpen, setTypeOpen] = useState(false);

  // NEW: dropdown states
  const [sortOpen, setSortOpen] = useState(false);
  const [ratingOpen, setRatingOpen] = useState(false);

  const [selectedMovie, setSelectedMovie] = useState(null);

  const [sourceFilter, setSourceFilter] = useState("trending");
  // values will now be: "trending" | "popular"
  const [sourceOpen, setSourceOpen] = useState(false);

  useEffect(() => {
    loadMovies();
  }, [sourceFilter, typeFilter]);

  const loadMovies = async () => {
    let data;

    if (sourceFilter === "trending") {
      data = await fetchTrending();
    }

    if (sourceFilter === "popular") {
      if (typeFilter === "movie") {
        data = await fetchPopularMovies();
      } else if (typeFilter === "tv") {
        data = await fetchPopularTV();
      } else {
        const movies = await fetchPopularMovies();
        const tv = await fetchPopularTV();

        data = {
          results: [...movies.results, ...tv.results],
        };
      }
    }

    setMovies(data?.results || []);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query) return loadMovies();

    const data = await searchMulti(query);

    const filtered = data.results.filter(
      (item) => item.media_type !== "person"
    );

    setMovies(filtered);
  };
  const processedMovies = movies
    .filter((movie) => {
      // rating filter
      const ratingOk = (movie.vote_average || 0) >= minRating;

      // type filter
      const typeOk =
        typeFilter === "all" ||
        movie.media_type === typeFilter ||
        // fallback for endpoints without media_type
        (typeFilter === "movie" && movie.title) ||
        (typeFilter === "tv" && movie.name);

      return ratingOk && typeOk;
    })
    .sort((a, b) => {
      if (sortBy === "rating") {
        return (b.vote_average || 0) - (a.vote_average || 0);
      }
      if (sortBy === "latest") {
        return new Date(b.release_date || b.first_air_date) -
          new Date(a.release_date || a.first_air_date);
      }
      return 0;
    });

  return (
    <div className="bg-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-3 mb-4">
          <input
            type="text"
            placeholder="Search movies or TV shows..."
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
              <div className="absolute mt-2 w-40 bg-surface border border-border rounded-md shadow-lg z-50">
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
              <div className="absolute mt-2 w-40 bg-surface border border-border rounded-md shadow-lg z-50">
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

          <div className="relative">
            <button
              onClick={() => {
                setSourceOpen(!sourceOpen);
                setSortOpen(false);
                setRatingOpen(false);
                setTypeOpen(false);
              }}
              className="bg-surface px-3 py-2 rounded border border-border text-sm text-textMain w-40 text-left"
            >
              {sourceFilter === "trending" ? "Trending" : "Popular"}
            </button>

            {sourceOpen && (
              <div className="absolute mt-2 w-40 bg-surface border border-border rounded-md shadow-lg z-50">
                <div
                  onClick={() => {
                    setSourceFilter("trending");
                    setSourceOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-accentViolet hover:text-white cursor-pointer"
                >
                  Trending
                </div>

                <div
                  onClick={() => {
                    setSourceFilter("popular");
                    setSourceOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-accentViolet hover:text-white cursor-pointer"
                >
                  Popular
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => {
                setTypeOpen(!typeOpen);
                setSortOpen(false);
                setRatingOpen(false);
                setSourceOpen(false);
              }}
              className="bg-surface px-3 py-2 rounded border border-border text-sm text-textMain w-40 text-left"
            >
              {typeFilter === "all"
                ? "All Types"
                : typeFilter === "movie"
                  ? "Movies"
                  : "TV Shows"}
            </button>

            {typeOpen && (
              <div className="absolute mt-2 w-40 bg-surface border border-border rounded-md shadow-lg z-50">
                <div
                  onClick={() => {
                    setTypeFilter("all");
                    setTypeOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-accentViolet hover:text-white cursor-pointer"
                >
                  All Types
                </div>

                <div
                  onClick={() => {
                    setTypeFilter("movie");
                    setTypeOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-accentViolet hover:text-white cursor-pointer"
                >
                  Movies
                </div>

                <div
                  onClick={() => {
                    setTypeFilter("tv");
                    setTypeOpen(false);
                  }}
                  className="px-4 py-2 hover:bg-accentViolet hover:text-white cursor-pointer"
                >
                  TV Shows
                </div>
              </div>
            )}
          </div>

          {/* Reset */}
          <button
            onClick={() => {
              setSortBy("");
              setMinRating(0);
              setTypeFilter("all");
              setSourceFilter("trending");
              setQuery("");

              // optional: close dropdowns
              setSortOpen(false);
              setRatingOpen(false);
              setTypeOpen(false);
              setSourceOpen(false);

              // reload default data
              loadMovies();
            }}
            className="bg-border hover:bg-accentViolet hover:text-white px-4 py-2 rounded text-sm text-textMuted transition"
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
        </div>

        {/* Modal */}
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      </div >
    </div>
  );
}