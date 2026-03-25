import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function User() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    // ❌ Not logged in
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // ❌ If admin tries to access user page
    if (currentUser.role === "admin") {
      navigate("/admin");
      return;
    }

    // ✅ Valid user
    setUser(currentUser);
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    window.dispatchEvent(new Event("storage"));
    navigate("/login");
  };

  if (!user) return null;

  return (
  <div className="min-h-screen bg-background text-textMain pt-24 px-6">

    <div className="max-w-5xl mx-auto">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-semibold">
            Welcome, {user.name}
          </h1>
          <p className="text-textMuted text-sm mt-1">
            Manage your activity and explore your dashboard
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 transition px-5 py-2 rounded-lg text-white text-sm"
        >
          Logout
        </button>
      </div>

      {/* Dashboard Grid */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* Card 1 */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-2">
            Your Dashboard
          </h2>
          <p className="text-textMuted text-sm">
            This is your control panel. You can extend this with
            favorites, watchlist, or viewing history.
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-surface border border-border rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-medium mb-2">
            Quick Actions
          </h2>
          <p className="text-textMuted text-sm">
            Start exploring movies, search for titles, or manage your
            saved content.
          </p>
        </div>

      </div>

    </div>
  </div>
   );
}