import { Link, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
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
        onClick={() => setMenuOpen(false)}
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 h-16">

        {/* LEFT: Logo */}
        <div className="flex items-center">
          <Link to="/" className="text-lg font-semibold text-white">
            <span className="text-accentViolet">Movie</span>Hub
          </Link>
        </div>

        {/* RIGHT: Hamburger (mobile only) */}
        <div className="flex items-center sm:hidden">
          <button
            type="button"
            className="p-2 rounded-md border border-border text-textMuted hover:text-white hover:border-white transition"
            aria-label="Toggle navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span className="block w-5 h-0.5 bg-white mb-1" />
            <span className="block w-5 h-0.5 bg-white mb-1" />
            <span className="block w-5 h-0.5 bg-white" />
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-4">
          {/* NOT LOGGED IN → FULL NAV */}
          {!user && (
            <>
              {navLink("/", "Home")}
              {navLink("/trending", "Trending")}
              {navLink("/movies", "Movies")}
              {navLink("/tv", "TV Shows")}
            </>
          )}

          {/* USER → CLEAN PERSONAL NAV */}
          {user?.role === "user" && navLink("/user", "Dashboard")}

          {/* ADMIN */}
          {user?.role === "admin" && navLink("/admin", "Admin")}
        </div>

        <div className="hidden sm:flex items-center gap-4">
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
              <span className="text-sm text-white hidden md:block">
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

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="sm:hidden px-4 pb-4 border-b border-border bg-black/70 overflow-hidden"
          >
            <div className="flex flex-col gap-3">
              {!user && (
                <>
                  {navLink("/", "Home")}
                  {navLink("/trending", "Trending")}
                  {navLink("/movies", "Movies")}
                  {navLink("/tv", "TV Shows")}
                </>
              )}
              {user?.role === "user" && navLink("/user", "Dashboard")}
              {user?.role === "admin" && navLink("/admin", "Admin")}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!query.trim()) return;
                setMenuOpen(false);
                navigate(`/search?q=${query}`);
              }}
              className="mt-4"
            >
              <input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-white/10 px-3 py-2 rounded-md text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-accentViolet"
              />
            </form>

            <div className="mt-4 flex flex-col gap-2">
              {user ? (
                <>
                  <span className="text-sm text-white">{user.name}</span>
                  <button
                    onClick={() => {
                      localStorage.removeItem("currentUser");
                      window.dispatchEvent(new Event("storage"));
                      window.location.href = "/";
                    }}
                    className="text-sm text-textMuted hover:text-white text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm text-textMuted hover:text-white"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMenuOpen(false)}
                    className="text-sm bg-accentViolet px-3 py-1.5 rounded text-white hover:bg-accentVioletHover inline-block"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}