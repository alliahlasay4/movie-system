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
  const [activity, setActivity] = useState([]);

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

    const actions = [];

    userFavorites.forEach((m) => {
      actions.push({
        type: "favorite",
        movie: m,
        time: Date.now(),
      });
    });

    watchlistMovies.forEach((m) => {
      actions.push({
        type: "watchlist",
        movie: m,
        time: Date.now(),
      });
    });

    actions.sort((a, b) => b.time - a.time);

    setActivity(actions.slice(0, 10));
    localStorage.setItem("activity", JSON.stringify(actions));
  }, [navigate]);

  const goToMovie = (movie) => {
    navigate(
      `/movie/${createSlug(movie)}?type=${movie.media_type || (movie.title ? "movie" : "tv")
      }`
    );
  };

  const clearFavorites = () => {
    if (!user) return;
    const allFavorites = JSON.parse(localStorage.getItem("favorites")) || {};
    delete allFavorites[user.id];
    localStorage.setItem("favorites", JSON.stringify(allFavorites));
    setFavorites([]);
  };

  const clearWatchlist = () => {
    if (!user) return;

    const userMovies = JSON.parse(localStorage.getItem("userMovies")) || {};

    if (userMovies[user.id]) {
      Object.keys(userMovies[user.id]).forEach((id) => {
        userMovies[user.id][id].watchlist = false;
      });

      localStorage.setItem("userMovies", JSON.stringify(userMovies));
    }

    setWatchlist([]);
  };


  const openCategory = (path) => navigate(path);

  const logoutUser = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  if (!user) return null;

  const featured = recent[0] || favorites[0];

  return (
    <div className="min-h-screen bg-[#050816] text-white overflow-x-hidden">

      {/* 🌌 GLOBAL GLOW */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute top-[-120px] left-[-120px] w-[500px] h-[500px] bg-purple-600/20 blur-[140px]" />
        <div className="absolute bottom-[-120px] right-[-120px] w-[500px] h-[500px] bg-blue-500/20 blur-[140px]" />
      </div>

      {/* 🎬 HERO */}
      {featured && (
        <div className="relative h-[65vh] w-full overflow-hidden">

          <img
            src={`https://image.tmdb.org/t/p/original${featured.backdrop_path || featured.poster_path}`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#050816] via-transparent to-[#050816]" />

          <div className="relative z-10 h-full flex flex-col justify-end px-6 md:px-12 pb-10">

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-3xl md:text-5xl font-bold max-w-xl"
            >
              Welcome back, {user.name}
            </motion.h1>

            <p className="text-white/60 mt-2 text-sm max-w-md">
              Continue where you left off
            </p>

            {/* ACTIONS */}
            <div className="grid gap-3 sm:grid-cols-3 mt-5">
              <button
                onClick={() => goToMovie(featured)}
                className="bg-white text-black px-5 py-2 rounded-lg text-sm font-medium"
              >
                ▶ Continue watching
              </button>

              <button
                onClick={() => navigate("/watchlist")}
                className="bg-white/10 px-5 py-2 rounded-lg text-sm"
              >
                My Watchlist
              </button>

              <button
                onClick={() => openCategory("/trending")}
                className="bg-white/10 px-5 py-2 rounded-lg text-sm"
              >
                Browse Trending
              </button>
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={() => openCategory("/movies")}
                className="bg-white/10 px-4 py-2 rounded-lg text-sm text-white"
              >
                Browse Movies
              </button>
              <button
                onClick={() => openCategory("/tv")}
                className="bg-white/10 px-4 py-2 rounded-lg text-sm text-white"
              >
                Browse TV Shows
              </button>
              <button
                onClick={logoutUser}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-sm text-white"
              >
                Logout
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 📊 QUICK STATS */}
      <div className="px-4 sm:px-6 lg:px-8 mt-8 relative z-20">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
          {[
            { label: "Favorites", value: favorites.length },
            { label: "Watchlist", value: watchlist.length },
            { label: "Activity", value: activity.length },
          ].map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="p-5 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/10"
            >
              <p className="text-xs text-white/60 uppercase tracking-[0.2em]">
                {item.label}
              </p>
              <h2 className="text-3xl font-bold mt-3">{item.value}</h2>
              <p className="mt-2 text-sm text-white/60">
                {item.label === "Activity"
                  ? "Recently viewed and interacted with."
                  : item.label === "Watchlist"
                    ? "Saved for later watch."
                    : "Personal favorites list."}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 grid gap-4 grid-cols-1 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-xs text-white/60 uppercase tracking-[0.2em]">
                  Quick actions
                </p>
                <h2 className="text-2xl font-semibold mt-2">
                  Keep your profile ready
                </h2>
              </div>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => clearFavorites()}
                  className="bg-white/10 px-4 py-2 rounded-lg text-sm text-white hover:bg-white/15"
                >
                  Clear Favorites
                </button>
                <button
                  onClick={() => clearWatchlist()}
                  className="bg-white/10 px-4 py-2 rounded-lg text-sm text-white hover:bg-white/15"
                >
                  Empty Watchlist
                </button>
              </div>
            </div>
            <p className="mt-4 text-sm text-white/60">
              Use these controls to keep your watchlist and favorites clean and easy to manage.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs text-white/60 uppercase tracking-[0.2em]">
                  Explore more
                </p>
                <h2 className="text-2xl font-semibold mt-2">Browse fresh picks</h2>
              </div>
              <span className="rounded-full bg-accentViolet px-3 py-1 text-xs uppercase tracking-[0.2em] text-white">
                New
              </span>
            </div>

            <div className="mt-6 grid gap-3">
              <button
                onClick={() => openCategory("/trending")}
                className="w-full bg-accentViolet px-4 py-3 rounded-xl text-sm font-medium text-white"
              >
                Trending Now
              </button>
              <button
                onClick={() => openCategory("/movies")}
                className="w-full bg-white/10 px-4 py-3 rounded-xl text-sm text-white hover:bg-white/15"
              >
                Popular Movies
              </button>
              <button
                onClick={() => openCategory("/tv")}
                className="w-full bg-white/10 px-4 py-3 rounded-xl text-sm text-white hover:bg-white/15"
              >
                Top TV Shows
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 🎞 CONTENT */}
      <div className="px-4 sm:px-6 lg:px-8 mt-10 space-y-10 pb-10">

        <ActivityList items={activity} onClick={goToMovie} />

        <Row
          title="Continue Watching"
          items={watchlist}
          onClick={goToMovie}
          actionLabel="View Watchlist"
          onAction={() => openCategory("/watchlist")}
        />

        <Row
          title="Your Favorites"
          items={favorites}
          onClick={goToMovie}
          actionLabel="View Favorites"
          onAction={() => openCategory("/favorites")}
        />

      </div>

    </div >
  );
}

function ActivityList({ items, onClick }) {
  const navigate = useNavigate();
  return (
    <div className="px-6 md:px-12">

      {/* MATCH OTHER CARDS */}
      <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-white/60 uppercase tracking-[0.2em]">
              Activity
            </p>
            <h2 className="text-xl font-semibold mt-1">
              Recent Activity
            </h2>
          </div>

          <div className="flex items-center gap-3">

            <span className="text-xs text-white/40">
              {items.length} items
            </span>

            {items.length > 5 && (
              <button
                onClick={() => navigate("/activity")}
                className="text-xs text-accentViolet hover:underline"
              >
                View all
              </button>
            )}

          </div>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <p className="text-white/40 text-sm">No activity yet</p>
        ) : (
          <div className="divide-y divide-white/10">

            {items.slice(0, 5).map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => onClick(item.movie)}
                className="flex items-center gap-3 py-3 cursor-pointer hover:bg-white/5 px-2 rounded-md transition"
              >

                {/* Poster */}
                <img
                  src={`https://image.tmdb.org/t/p/w92${item.movie.poster_path}`}
                  className="w-9 h-12 object-cover rounded"
                />

                {/* Text */}
                <div className="flex-1 text-sm">
                  <span className="text-accentViolet font-medium">
                    {item.type === "favorite" && "Added to Favorites"}
                    {item.type === "watchlist" && "Added to Watchlist"}
                  </span>
                  {" "}
                  <span className="text-white/80">
                    {item.movie.title || item.movie.name}
                  </span>
                </div>

                {/* Time */}
                <span className="text-xs text-white/40">
                  now
                </span>

              </motion.div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

/* 🎬 EDGE-TO-EDGE ROW */
function Row({ title, items, onClick, actionLabel, onAction }) {
  return (
    <div className="px-6 md:px-12">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        {actionLabel && (
          <button
            onClick={onAction}
            className="self-start sm:self-auto bg-white/10 px-3 py-2 rounded-lg text-sm text-white hover:bg-white/15"
          >
            {actionLabel}
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-white/40 text-sm">Nothing here yet</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">

          {items.map((movie, i) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              whileHover={{ scale: 1.08 }}
              className="min-w-[160px]"
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