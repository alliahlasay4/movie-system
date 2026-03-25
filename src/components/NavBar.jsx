import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("currentUser"));
    setUser(storedUser);
  }, []);

  useEffect(() => {
    const syncUser = () => {
      const storedUser = JSON.parse(localStorage.getItem("currentUser"));
      setUser(storedUser);
    };

    window.addEventListener("storage", syncUser);

    // also run once
    syncUser();

    return () => window.removeEventListener("storage", syncUser);
  }, []);

  return (
    <header className="bg-[#0C1322] border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-lg font-semibold text-textMain tracking-wide">
          <span className="text-accentViolet">Movie</span>Hub
        </Link>
        <nav className="flex items-center w-full ml-10">

          {/* Left */}
          <div className="flex gap-6 text-sm">
            <Link
              to="/"
              className="text-textMuted hover:text-textMain transition"
            >
              Home
            </Link>

            {/* ✅ Admin only */}
            {user?.role === "admin" && (
              <Link
                to="/admin"
                className="text-textMuted hover:text-textMain transition"
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Right */}
          <div className="flex items-center ml-auto text-sm gap-4">
            {user ? (
              <>
                <span className="text-textMain">
                  {user.name}
                </span>

                <button
                  onClick={() => {
                    localStorage.removeItem("currentUser");
                    window.dispatchEvent(new Event("storage"));
                    window.location.href = "/";
                  }}
                  className="text-textMuted hover:text-textMain"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="text-textMuted hover:text-textMain transition"
                >
                  Register
                </Link>

                <Link
                  to="/login"
                  className="text-textMuted hover:text-textMain transition"
                >
                  Login
                </Link>
              </>
            )}
          </div>

        </nav>
      </div >
    </header >
  );
}