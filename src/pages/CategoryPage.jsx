import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  fetchTrending,
  fetchPopularMovies,
  fetchPopularTV,
  fetchDetails,
} from "../services/api";

import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";

export default function CategoryPage() {
  const { type } = useParams();

  const [movies, setMovies] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const normalize = (item) => ({
    ...item,
    media_type:
      item.media_type ||
      (item.title ? "movie" : "tv"),
  });

  useEffect(() => {
    loadData();
  }, [type]);

  const loadData = async () => {
    let data;

    if (type === "trending") {
      data = await fetchTrending();
    } else if (type === "movies") {
      data = await fetchPopularMovies();
    } else if (type === "tv") {
      data = await fetchPopularTV();
    }

    setMovies((data?.results || []).map(normalize));
  };

  const handleMovieClick = async (movie) => {
    const full = await fetchDetails(movie.id, movie.media_type);
    setSelectedMovie(full);
  };

  const titleMap = {
    trending: "Trending This Week",
    movies: "Popular Movies",
    tv: "Popular TV Shows",
  };

  return (
    <div className="bg-bg min-h-screen px-4 sm:px-6 lg:px-8 py-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-2xl sm:text-3xl font-semibold mb-6">
          {titleMap[type]}
        </h1>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5 sm:gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onClick={() => handleMovieClick(movie)}
            />
          ))}
        </div>

      </div>

      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />
    </div>
  );
}