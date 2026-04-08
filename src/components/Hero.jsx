import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toggleWatchlist, isInWatchlist } from "../utils/userMovies";

export default function Hero({ movies }) {

  const [refresh, setRefresh] = useState(false);

  const user = JSON.parse(localStorage.getItem("currentUser"));

  const [index, setIndex] = useState(0);

  // auto slide
  useEffect(() => {
    if (!movies?.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % movies.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [movies]);

  if (!movies || movies.length === 0) return null;

  const movie = movies[index];


  const inWatchlist =
    user && isInWatchlist(user.id, movie.id);

  return (
    <div className="relative h-[80vh] w-full overflow-hidden">

      <AnimatePresence mode="wait">
        <motion.img
          key={movie.id}
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        />
      </AnimatePresence>

      {/* gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute bottom-0 w-full h-40 bg-gradient-to-t from-bg to-transparent" />

      {/* content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 h-full flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={movie.id + "-text"}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="max-w-xl space-y-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold">
              {movie.title || movie.name}
            </h1>

            <p className="text-sm text-textMuted line-clamp-3">
              {movie.overview}
            </p>

            <div className="flex gap-3 pt-2">
              <button className="bg-accentViolet px-6 py-2 rounded text-white">
                ▶ Watch Now
              </button>

              <button
                onClick={() => {
                  if (!user) return;

                  localStorage.setItem(`movie-${movie.id}`, JSON.stringify(movie));
                  toggleWatchlist(user.id, movie);

                  setRefresh(prev => !prev); // force re-render
                }}
                className={`border px-6 py-2 rounded text-white ${inWatchlist ? "bg-accentViolet border-accentViolet" : "border-border"
                  }`}
              >
                {inWatchlist ? "✓ In Watchlist" : "+ Watchlist"}
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* dots indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
        {movies.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full ${i === index ? "bg-accentViolet" : "bg-white/40"
              }`}
          />
        ))}
      </div>

    </div>
  );
}