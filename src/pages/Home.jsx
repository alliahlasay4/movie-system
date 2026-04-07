

import { useEffect, useState } from "react";
import {
  fetchTrending,
  fetchPopularMovies,
  fetchPopularTV,
  fetchDetails,
} from "../services/api";

import Hero from "../components/Hero";
import MovieRow from "../components/MovieRow";
import MovieModal from "../components/MovieModal";

export default function Home() {
  const [trending, setTrending] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularTV, setPopularTV] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const normalize = (item) => ({
    ...item,
    media_type:
      item.media_type ||
      (item.title ? "movie" : "tv"),
  });

  useEffect(() => {
    loadHome();
  }, []);
  const loadHome = async () => {
    try {
      setLoading(true);

      const t = await fetchTrending();
      const pm = await fetchPopularMovies();
      const tv = await fetchPopularTV();

      const normalizedTrending = t.results.map(normalize);

      setTrending(normalizedTrending);
      setPopularMovies(pm.results.map(normalize));
      setPopularTV(tv.results.map(normalize));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-bg min-h-screen px-6 py-10 space-y-10">

        <div className="h-[60vh] bg-surface animate-pulse rounded-xl" />

        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-3">
            <div className="w-40 h-4 bg-surface animate-pulse rounded" />

            <div className="flex gap-4">
              {[...Array(6)].map((_, idx) => (
                <div
                  key={idx}
                  className="w-[160px] h-[220px] bg-surface animate-pulse rounded-lg"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const handleMovieClick = async (movie) => {
    try {
      const full = await fetchDetails(movie.id, movie.media_type);

      // preserve media_type
      setSelectedMovie({ ...full, media_type: movie.media_type });
    } catch {
      alert("Failed to load details");
    }
  };

  return (
    <div className="bg-bg min-h-screen">

      {/* HERO */}
      <Hero movies={trending.slice(0, 5)} />

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        <MovieRow
          title="Trending This Week"
          movies={trending}
          onClick={handleMovieClick}
          viewMoreLink="/trending"
        />

        <MovieRow
          title="Popular Movies"
          movies={popularMovies}
          onClick={handleMovieClick}
          viewMoreLink="/movies"
        />

        <MovieRow
          title="Popular TV Shows"
          movies={popularTV}
          onClick={handleMovieClick}
          viewMoreLink="/tv"
        />
      </div>

      {/* MODAL */}
      <MovieModal
        movie={selectedMovie}
        onClose={() => setSelectedMovie(null)}
      />

    </div>
  );
}