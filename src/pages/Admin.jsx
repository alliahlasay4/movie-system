import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function Admin() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const [movies, setMovies] = useState([]);
  const [newMovie, setNewMovie] = useState("");

  // LOAD DATA
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const storedMovies = JSON.parse(localStorage.getItem("movies")) || [];

    setUsers(storedUsers);
    setMovies(storedMovies);
  }, []);

  // 🔍 FILTER USERS
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  // ❌ DELETE USER
  const handleDelete = (id) => {
    const updated = users.filter((u) => u.id !== id);
    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
    toast.success("User deleted");
  };

  // 🔄 TOGGLE ADMIN
  const toggleAdmin = (id) => {
    const updated = users.map((u) =>
      u.id === id
        ? { ...u, role: u.role === "admin" ? "user" : "admin" }
        : u
    );

    setUsers(updated);
    localStorage.setItem("users", JSON.stringify(updated));
    toast.success("User role updated");
  };

  // 🎬 ADD MOVIE
  const handleAddMovie = () => {
    if (!newMovie.trim()) return;

    const updated = [...movies, { id: Date.now(), title: newMovie }];
    setMovies(updated);
    localStorage.setItem("movies", JSON.stringify(updated));
    setNewMovie("");
    toast.success("Movie added");
  };

  // ❌ DELETE MOVIE
  const handleDeleteMovie = (id) => {
    const updated = movies.filter((m) => m.id !== id);
    setMovies(updated);
    localStorage.setItem("movies", JSON.stringify(updated));
    toast.success("Movie removed");
  };

  return (
    <div className="bg-bg min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-textMain">
            Admin Dashboard
          </h1>
          <p className="text-textMuted mt-1">
            Manage users and movies
          </p>
        </div>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-sm bg-transparent border border-border px-4 py-2 rounded-lg text-textMain placeholder:text-textMuted outline-none focus:ring-2 focus:ring-accentViolet"
        />

        {/* USERS TABLE */}
        <div className="bg-surface border border-border rounded-xl overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-lg text-textMain">Users</h2>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-white/5 text-textMuted">
              <tr>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Role</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-t border-border hover:bg-white/5"
                >
                  <td className="px-4 py-3 text-textMain">{user.name}</td>
                  <td className="px-4 py-3 text-textMuted">{user.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.role === "admin"
                          ? "bg-accentViolet text-white"
                          : "bg-white/10 text-textMuted"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>

                  <td className="px-4 py-3 flex gap-2">

                    {/* Toggle Admin */}
                    <button
                      onClick={() => toggleAdmin(user.id)}
                      className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30"
                    >
                      {user.role === "admin" ? "Remove Admin" : "Make Admin"}
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-xs px-2 py-1 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30"
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MOVIE MANAGEMENT */}
        <div className="bg-surface border border-border rounded-xl p-4 space-y-4">

          <h2 className="text-lg text-textMain">Manage Movies</h2>

          {/* Add Movie */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter movie title..."
              value={newMovie}
              onChange={(e) => setNewMovie(e.target.value)}
              className="flex-1 bg-transparent border border-border px-4 py-2 rounded-lg text-textMain placeholder:text-textMuted outline-none focus:ring-2 focus:ring-accentViolet"
            />

            <button
              onClick={handleAddMovie}
              className="bg-accentViolet px-4 py-2 rounded text-white"
            >
              Add
            </button>
          </div>

          {/* Movie List */}
          <div className="space-y-2">
            {movies.length === 0 ? (
              <p className="text-textMuted text-sm">No movies added</p>
            ) : (
              movies.map((movie) => (
                <div
                  key={movie.id}
                  className="flex justify-between items-center bg-white/5 px-3 py-2 rounded"
                >
                  <span className="text-textMain text-sm">
                    {movie.title}
                  </span>

                  <button
                    onClick={() => handleDeleteMovie(movie.id)}
                    className="text-red-400 text-xs"
                  >
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>

        </div>

      </div>
    </div>
  );
}