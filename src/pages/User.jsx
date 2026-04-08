import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import MovieCard from "../components/MovieCard";
import { createSlug } from "../utils/slug";

export default function User() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (!currentUser) {
      navigate("/login");
      return;
    }

    if (currentUser.role === "admin") {
      navigate("/admin");
      return;
    }

    setUser(currentUser);

    const allFavorites =
      JSON.parse(localStorage.getItem("favorites")) || {};
    const userFavorites = allFavorites[currentUser.id] || [];
    setFavorites(userFavorites);

    const userMovies =
      JSON.parse(localStorage.getItem("userMovies")) || {};
    const userData = userMovies[currentUser.id] || {};

    const watchlistMovies = Object.keys(userData)
      .filter((id) => userData[id]?.watchlist)
      .map((id) =>
        JSON.parse(localStorage.getItem(`movie-${id}`))
      )
      .filter(Boolean);

    setWatchlist(watchlistMovies);

    const combined = [...userFavorites, ...watchlistMovies];
    const unique = Array.from(
      new Map(combined.map((m) => [m.id, m])).values()
    );

    setRecent(unique.slice(0, 10));
  }, [navigate]);

  const goToMovie = (movie) => {
    navigate(
      `/movie/${createSlug(movie)}?type=${
        movie.media_type || (movie.title ? "movie" : "tv")
      }`
    );
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#050816] text-white pt-24 px-6 relative overflow-hidden">

      {/* 🌌 BACKGROUND GLOW */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-purple-600/20 blur-[120px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-blue-500/20 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto space-y-10">

        {/* 🔥 HERO */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative p-8 rounded-2xl border border-white/10
                     bg-white/5 backdrop-blur-xl
                     shadow-[0_0_40px_rgba(139,92,246,0.15)]"
        >
          <div className="flex justify-between items-center">

            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {user.name}
              </h1>
              <p className="text-white/50 mt-2 text-sm">
                Your personal movie dashboard
              </p>
            </div>

            <button
              onClick={() => {
                localStorage.removeItem("currentUser");
                navigate("/login");
              }}
              className="bg-red-500/90 hover:bg-red-600 px-5 py-2 rounded-lg text-sm"
            >
              Logout
            </button>

          </div>
        </motion.div>

        {/* 📊 STATS */}
        <div className="grid md:grid-cols-3 gap-6">

          {[
            {
              label: "Favorites",
              value: favorites.length,
              glow: "from-pink-500/30 to-red-500/10",
              link: "/favorites"
            },
            {
              label: "Watchlist",
              value: watchlist.length,
              glow: "from-blue-500/30 to-cyan-500/10",
              link: "/watchlist"
            },
            {
              label: "Activity",
              value: recent.length,
              glow: "from-purple-500/30 to-indigo-500/10"
            }
          ].map((item, i) => (

            <motion.div
              key={i}
              whileHover={{ scale: 1.05 }}
              className={`cursor-pointer p-6 rounded-xl border border-white/10 
                          bg-gradient-to-br ${item.glow}
                          backdrop-blur-lg relative overflow-hidden`}
              onClick={() => item.link && navigate(item.link)}
            >
              <div className="absolute inset-0 opacity-20 blur-xl bg-white/10" />

              <p className="text-white/60 text-sm">{item.label}</p>
              <h2 className="text-4xl font-bold mt-2">{item.value}</h2>

            </motion.div>

          ))}

        </div>

        {/* 🎬 SECTIONS */}
        <Section title="Recent Activity" items={recent} onClick={goToMovie} />
        <Section title="Continue Watching" items={watchlist} onClick={goToMovie} />
        <Section title="Your Favorites" items={favorites} onClick={goToMovie} />

      </div>
    </div>
  );
}

/* 🔥 PREMIUM ROW */
function Section({ title, items, onClick }) {
  return (
    <div className="space-y-4">

      <h2 className="text-xl font-semibold text-white/90">
        {title}
      </h2>

      {items.length === 0 ? (
        <p className="text-white/40 text-sm">Nothing here yet</p>
      ) : (
        <div className="flex gap-5 overflow-x-auto pb-3">

          {items.map((movie, i) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.05 }}
              className="min-w-[190px]"
            >
              <MovieCard
                movie={movie}
                onClick={() => onClick(movie)}
              />
            </motion.div>
          ))}

        </div>
      )}

    </div>
  );
}