import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const syncUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("currentUser"));
      setUser(storedUser);
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    return () => window.removeEventListener("storage", syncUser);
  }, []);

  const navLink = (path, label) => {
    const isActive = location.pathname === path;

    return (
      <Link
        to={path}
        className={`transition text-sm ${isActive
          ? "text-white border-b-2 border-accentViolet pb-1"
          : "text-textMuted hover:text-white"
          }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="bg-black/60 backdrop-blur-md border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">

        {/* Logo */}
        <Link to="/" className="text-lg font-semibold text-white mr-10">
          <span className="text-accentViolet">Movie</span>Hub
        </Link>

        {/* LEFT NAV (content-focused now) */}
        <nav className="flex items-center gap-6">

          {navLink("/", "Home")}
          {navLink("/trending", "Trending")}
          {navLink("/movies", "Movies")}
          {navLink("/tv", "TV Shows")}

          {/* Keep dashboards but visually secondary */}
          {user?.role === "admin" && navLink("/admin", "Admin")}
          {user?.role === "user" && navLink("/user", "Dashboard")}

          {user && navLink("/favorites", "Favorites")}
        </nav>

        {/* RIGHT SIDE */}
        <div className="ml-auto flex items-center gap-4">

          {/* Search (UI only for now) */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!query.trim()) return;
              navigate(`/search?q=${query}`);
            }}
          >
            <input
              type="text"
              placeholder="Search..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="bg-white/10 px-3 py-1.5 rounded-md text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-accentViolet"
            />
          </form>

          {user ? (
            <>
              <span className="text-sm text-white hidden sm:block">
                {user.name}
              </span>

              <button
                onClick={() => {
                  localStorage.removeItem("currentUser");
                  window.dispatchEvent(new Event("storage"));
                  window.location.href = "/";
                }}
                className="text-sm text-textMuted hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm text-textMuted hover:text-white"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="text-sm bg-accentViolet px-3 py-1.5 rounded text-white hover:bg-accentVioletHover"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

      </div>
    </header>
  );
}