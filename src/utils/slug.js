export const createSlug = (movie) => {
  const title = (movie.title || movie.name || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

  return `${title}-${movie.id}`;
};