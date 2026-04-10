import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Activity() {
  const navigate = useNavigate();

  const [activity, setActivity] = useState([]);
  const [favorites, setFavorites] = useState({});
  const [user, setUser] = useState(null);
  const [userMovies, setUserMovies] = useState({});

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(currentUser);

    const storedActivity =
      JSON.parse(localStorage.getItem("activity")) || [];
    setActivity(storedActivity);

    const storedFavorites =
      JSON.parse(localStorage.getItem("favorites")) || {};
    setFavorites(storedFavorites);

    const storedUserMovies =
      JSON.parse(localStorage.getItem("userMovies")) || {};
    setUserMovies(storedUserMovies);
  }, []);

  if (!user) return null;

  const userFavorites = favorites[user.id] || [];
  const userData = userMovies[user.id] || {};

  // ❤️ TOGGLE FAVORITE
  const toggleFavorite = (movie) => {
    const updated = { ...favorites };
    const current = updated[user.id] || [];

    const exists = current.find((m) => m.id === movie.id);

    if (exists) {
      updated[user.id] = current.filter((m) => m.id !== movie.id);
    } else {
      updated[user.id] = [...current, movie];
    }

    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
  };

  // ➕ TOGGLE WATCHLIST
  const toggleWatchlist = (movie) => {
    const updated = { ...userMovies };

    if (!updated[user.id]) updated[user.id] = {};

    if (!updated[user.id][movie.id]) {
      updated[user.id][movie.id] = { watchlist: true };
    } else {
      updated[user.id][movie.id].watchlist =
        !updated[user.id][movie.id].watchlist;
    }

    localStorage.setItem("userMovies", JSON.stringify(updated));
    setUserMovies(updated);
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold">All Activity</h1>

          <button
            onClick={() => navigate("/user")}
            className="text-sm text-white/60 hover:text-white"
          >
            ← Back
          </button>
        </div>

        {/* LIST */}
        <div className="space-y-4">
          {activity.map((item, i) => {
            const movie = item.movie;
            if (!movie) return null;

            const isFav = userFavorites.some(
              (m) => m.id === movie.id
            );

            const isWatch =
              userData[movie.id]?.watchlist || false;

            return (
              <motion.div
                key={i}
                whileHover={{ y: -2 }}
                className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition"
              >

                {/* POSTER */}
                <img
                  src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                  className="w-12 h-16 object-cover rounded-md"
                />

                {/* TEXT */}
                <div
                  onClick={() =>
                    navigate(`/movie/${movie.id}`)
                  }
                  className="flex-1 cursor-pointer"
                >
                  <p className="text-sm">
                    <span className="text-accentViolet font-medium">
                      {item.type === "favorite"
                        ? "Added to Favorites"
                        : "Added to Watchlist"}
                    </span>{" "}
                    <span className="text-white/80">
                      {movie.title || movie.name}
                    </span>
                  </p>

                  <p className="text-xs text-white/40 mt-1">
                    Just now
                  </p>
                </div>

                {/* ❤️ FAVORITE */}
                <button
                  onClick={() => toggleFavorite(movie)}
                  className={`text-lg transition ${
                    isFav
                      ? "text-red-500"
                      : "text-white/40 hover:text-red-400"
                  }`}
                >
                  ❤️
                </button>

                {/* ➕ WATCHLIST */}
                <button
                  onClick={() => toggleWatchlist(movie)}
                  className={`text-lg transition ${
                    isWatch
                      ? "text-accentViolet"
                      : "text-white/40 hover:text-accentViolet"
                  }`}
                >
                  ➕
                </button>

              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}