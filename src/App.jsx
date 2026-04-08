import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/NavBar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Admin from "./pages/Admin";
import ProtectedRoute from "./components/ProtectedRoute";
import User from "./pages/User";
import Favorites from "./pages/Favorites";
import CategoryPage from "./pages/CategoryPage";
import MovieDetails from "./pages/MovieDetails";
import Search from "./pages/Search";
import Watchlist from "./pages/Watchlist";

import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0C1322] text-textMain">
        <Navbar />

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0C1322",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        />

        <Routes>
          {/* MAIN */}
          <Route path="/" element={<Home />} />

          {/* AUTH */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/movie/:slug" element={<MovieDetails />} />

          <Route path="/search" element={<Search />} />

          {/* 🔐 ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <Admin />
              </ProtectedRoute>
            }
          />

          {/* 🔐 USER */}
          <Route
            path="/user"
            element={
              <ProtectedRoute role="user">
                <User />
              </ProtectedRoute>
            }
          />

          {/* 🔐 FAVORITES */}
          <Route
            path="/favorites"
            element={
              <ProtectedRoute role="user">
                <Favorites />
              </ProtectedRoute>
            }
          />

          <Route
            path="/watchlist"
            element={
              <ProtectedRoute role="user">
                <Watchlist />
              </ProtectedRoute>
            }
          />

          {/* 🎬 CATEGORY PAGES (IMPORTANT: KEEP LAST) */}
          <Route path="/:type" element={<CategoryPage />} />

        </Routes>
      </div>
    </Router>
  );
}