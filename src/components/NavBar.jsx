export default function Navbar() {
  return (
    <header className="bg-navbar border-b border-border sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-navbar/80">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <h1 className="text-lg font-semibold text-textMain tracking-wide">
          <span className="text-accentViolet">Movie</span>Hub
        </h1>

        {/* Nav */}
        <nav className="flex items-center gap-6 text-sm">
          <a className="text-textMuted hover:text-textMain transition">
            Movies
          </a>
          <a className="text-textMuted hover:text-textMain transition">
            Favorites
          </a>
        </nav>

      </div>
    </header>
  );
}