export const getUserMovies = (userId) => {
  const data = JSON.parse(localStorage.getItem("userMovies")) || {};
  return data[userId] || {};
};

export const toggleWatchlist = (userId, movie) => {
  const data = JSON.parse(localStorage.getItem("userMovies")) || {};

  if (!data[userId]) data[userId] = {};
  if (!data[userId][movie.id]) data[userId][movie.id] = {};

  const current = data[userId][movie.id].watchlist;

  data[userId][movie.id].watchlist = !current;

  localStorage.setItem("userMovies", JSON.stringify(data));
};

export const isInWatchlist = (userId, movieId) => {
  const data = JSON.parse(localStorage.getItem("userMovies")) || {};
  return data[userId]?.[movieId]?.watchlist || false;
};