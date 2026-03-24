import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-[#0C1322] border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-lg font-semibold text-textMain tracking-wide">
          <span className="text-accentViolet">Movie</span>Hub
        </Link>

        {/* Nav */}
        <nav className="flex items-center w-full ml-10">
          
          {/* Left */}
          <div className="flex gap-6 text-sm">
            <Link
              to="/"
              className="text-textMuted hover:text-textMain transition"
            >
              Movies
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center ml-auto text-sm">
            <Link
              to="/signup"
              className="text-textMuted hover:text-textMain transition"
            >
              Register
            </Link>

            <Link
              to="/login"
              className="ml-4 text-textMuted hover:text-textMain transition"
            >
              Login
            </Link>
          </div>

        </nav>

      </div>
    </header>
  );
}