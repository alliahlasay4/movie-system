const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

export const fetchPopularMovies = async () => {
  const res = await fetch(
    `${BASE_URL}/movie/popular?api_key=${API_KEY}`
  );
  return res.json();
};

export const fetchPopularTV = async () => {
  const res = await fetch(
    `${BASE_URL}/tv/popular?api_key=${API_KEY}`
  );
  return res.json();
};

export const fetchDetails = async (id, type) => {
  const res = await fetch(
    `${BASE_URL}/${type}/${id}?api_key=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch details");
  }

  return res.json();
};

export const searchMulti = async (query) => {
  const res = await fetch(
    `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${query}`
  );
  return res.json();
};

export const fetchTrending = async () => {
  const res = await fetch(
    `${BASE_URL}/trending/all/week?api_key=${API_KEY}`
  );
  return res.json();
};

export const fetchCredits = async (id, type) => {
  const res = await fetch(
    `${BASE_URL}/${type}/${id}/credits?api_key=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch credits");
  }

  return res.json();
};

export const fetchVideos = async (id, type) => {
  const res = await fetch(
    `${BASE_URL}/${type}/${id}/videos?api_key=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch videos");
  }

  return res.json();
};

export const fetchSimilar = async (id, type) => {
  const res = await fetch(
    `${BASE_URL}/${type}/${id}/similar?api_key=${API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch similar content");
  }

  return res.json();
};