// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    ensureAdminExists();

    const users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
      (u) =>
        u.email === form.email &&
        (
          u.password === form.password ||          // for admin (plain text)
          atob(u.password) === form.password       // for encoded users
        )
    );

    if (!user) {
      alert("Invalid email or password");
      return;
    }

    // save logged-in user
    localStorage.setItem("currentUser", JSON.stringify(user));
    window.dispatchEvent(new Event("storage"));

    // redirect based on role
    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }
  };

  const ensureAdminExists = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const adminExists = users.find((u) => u.email === "admin@gmail.com");

    if (!adminExists) {
      const adminUser = {
        id: 1,
        name: "Admin",
        email: "admin@gmail.com",
        password: "123456",
        role: "admin",
      };

      users.push(adminUser);
      localStorage.setItem("users", JSON.stringify(users));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">

      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src="/background/poster.png"
          alt="background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.1)]">


        {/* Title */}
        <h2 className="text-2xl font-semibold text-textMain text-center mb-1">
          Welcome Back
        </h2>
        <p className="text-sm text-textMuted text-center mb-6">
          Login to continue exploring MovieHub
        </p>

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-textMuted">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="bg-transparent border border-border px-4 py-2.5 rounded-lg text-textMain placeholder:text-textMuted outline-none focus:ring-2 focus:ring-accentViolet focus:border-accentViolet transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-xs text-textMuted">Password</label>

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              className="bg-transparent border border-border px-4 py-2.5 pr-10 rounded-lg text-textMain placeholder:text-textMuted outline-none focus:ring-2 focus:ring-accentViolet focus:border-accentViolet transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-textMuted hover:text-textMain"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="mt-4 bg-accentViolet hover:opacity-90 text-white py-2.5 rounded-lg font-medium transition"
          >
            Login
          </button>

        </form>
        {/* Footer */}
        <p className="text-sm text-textMuted mt-6 text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-accentViolet hover:underline">
            Sign up
          </Link>
        </p>

      </div>
    </div>
  );
}