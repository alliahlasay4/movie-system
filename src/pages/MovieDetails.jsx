import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toggleWatchlist, isInWatchlist } from "../utils/userMovies";

import {
  fetchDetails,
  fetchCredits,
  fetchVideos,
  fetchSimilar,
} from "../services/api";

import MovieCard from "../components/MovieCard";
import { createSlug } from "../utils/slug";

export default function MovieDetails() {

  const [refresh, setRefresh] = useState(false);

  
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const type = searchParams.get("type");
  const id = slug?.split("-").pop();

  const [movie, setMovie] = useState(null);
  const [cast, setCast] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMovie();
  }, [id, type]);

  const loadMovie = async () => {
    if (!id || !type) return;

    setLoading(true);

    try {
      const data = await fetchDetails(id, type);
      const credits = await fetchCredits(id, type);
      const videos = await fetchVideos(id, type);
      const similarData = await fetchSimilar(id, type);

      setMovie(data);
      setCast(credits.cast?.slice(0, 8) || []);

      const trailerVideo = videos.results.find(
        (v) => v.type === "Trailer" && v.site === "YouTube"
      );
      setTrailer(trailerVideo);

      setSimilar(similarData.results || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-textMuted">
        Loading movie details...
      </div>
    );
  }

  const inWatchlist =
    user && isInWatchlist(user.id, movie.id);

  return (
    <div className="bg-bg min-h-screen text-white">

      {/* HERO */}
      <div className="relative min-h-screen flex items-center">

        {/* BACKDROP */}
        <img
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* GRADIENT OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/20" />

        {/* CONTENT */}
        <div className="relative z-10 w-full flex justify-center px-6 pb-12">
          <div className="flex flex-col md:flex-row items-center gap-10 max-w-4xl w-full">

            {/* POSTER */}
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              className="w-52 md:w-64 rounded-xl shadow-2xl"
            />

            {/* INFO */}
            <div className="space-y-4 max-w-xl text-center md:text-left">

              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                {movie.title || movie.name}
              </h1>

              {/* META */}
              <div className="flex flex-wrap gap-3 text-sm text-textMuted justify-center md:justify-start">
                <span>⭐ {movie.vote_average?.toFixed(1)}</span>
                <span>
                  {movie.release_date || movie.first_air_date}
                </span>
                {movie.runtime && <span>{movie.runtime} min</span>}
              </div>

              {/* GENRES */}
              <div className="flex gap-2 flex-wrap justify-center md:justify-start">
                {movie.genres?.map((g) => (
                  <span
                    key={g.id}
                    className="px-3 py-1 text-xs border border-white/20 rounded-full hover:bg-white hover:text-black transition cursor-pointer"
                  >
                    {g.name}
                  </span>
                ))}
              </div>

              {/* OVERVIEW */}
              <p className="text-sm md:text-base text-textMuted leading-relaxed">
                {movie.overview}
              </p>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 pt-2 justify-center md:justify-start">
                {trailer && (
                  <a
                    href={`https://www.youtube.com/watch?v=${trailer.key}`}
                    target="_blank"
                    className="px-5 py-2 bg-white text-black rounded-lg text-sm font-medium hover:opacity-80 transition"
                  >
                    ▶ Watch Trailer
                  </a>
                )}

                <button
                  onClick={() => {
                  if (!user) return;

                  localStorage.setItem(`movie-${movie.id}`, JSON.stringify(movie));
                  toggleWatchlist(user.id, movie);

                  setRefresh(prev => !prev); // force re-render
                }}
                  className={`px-5 py-2 rounded-lg text-sm transition ${inWatchlist
                      ? "bg-accentViolet text-white"
                      : "border border-white/30 hover:bg-white hover:text-black"
                    }`}
                >
                  {inWatchlist ? "✓ In Watchlist" : "+ Add to Watchlist"}
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* TRAILER SECTION */}
      {trailer && (
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-xl font-semibold mb-4">Trailer</h2>

          <div className="aspect-video overflow-hidden rounded-xl shadow-lg">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${trailer.key}`}
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* CAST */}
      {cast.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-12">
          <h2 className="text-xl font-semibold mb-6">Top Cast</h2>

          <div className="flex gap-5 overflow-x-auto pb-2">
            {cast.map((actor) => (
              <div
                key={actor.id}
                className="w-28 flex-shrink-0 text-center group"
              >
                <img
                  src={
                    actor.profile_path
                      ? `https://image.tmdb.org/t/p/w185${actor.profile_path}`
                      : "/no-avatar.png"
                  }
                  className="w-full h-36 object-cover rounded-lg mb-2 group-hover:scale-105 transition"
                />

                <p className="text-xs font-medium">{actor.name}</p>
                <p className="text-[10px] text-textMuted">
                  {actor.character}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SIMILAR */}
      {similar.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-xl font-semibold mb-6">
            You May Also Like
          </h2>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {similar.slice(0, 12).map((m) => (
              <div key={m.id} className="min-w-[170px]">
                <MovieCard
                  movie={m}
                  onClick={() =>
                    navigate(`/movie/${createSlug(m)}?type=${type}`)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}