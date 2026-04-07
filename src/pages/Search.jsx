import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { searchMulti } from "../services/api";
import MovieCard from "../components/MovieCard";
import MovieModal from "../components/MovieModal";
import { fetchDetails } from "../services/api";

export default function Search() {
  const [params] = useSearchParams();
  const query = params.get("q");

  const [results, setResults] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  useEffect(() => {
    if (query) loadResults();
  }, [query]);

  const loadResults = async () => {
    try {
      const data = await searchMulti(query);

      const filtered = data.results.filter(
        (item) => item.media_type !== "person"
      );

      setResults(filtered);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = async (movie) => {
    try {
      const type =
        movie.media_type ||
        (movie.title ? "movie" : "tv");

      const full = await fetchDetails(movie.id, type);
      setSelectedMovie(full);
    } catch {
      alert("Failed to load details");
    }
  };

  return (
    <div className="bg-bg min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">

        <h1 className="text-2xl font-semibold mb-6">
          Results for "{query}"
        </h1>

        {results.length === 0 ? (
          <p className="text-textMuted">No results found.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {results.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onClick={() => handleClick(movie)}
              />
            ))}
          </div>
        )}

        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />

      </div>
    </div>
  );
}