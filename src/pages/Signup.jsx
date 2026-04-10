// src/pages/Signup.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "", // ✅ correct
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  const handleSignup = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (!form.email.includes("@")) {
      toast.error("Invalid email");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const email = form.email.toLowerCase().trim();
    const users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find((u) => u.email === email);
    if (exists) {
      toast.error("Email already registered");
      return;
    }

    const newUser = {
      id: Date.now(),
      name: form.name.trim(),
      email,
      password: btoa(form.password),
      role: "user",
    };

    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    localStorage.setItem("currentUser", JSON.stringify(newUser));
    window.dispatchEvent(new Event("storage"));

    navigate("/");
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 sm:py-0 relative z-10">

      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <img
          src="/background/poster.png"
          alt="background"
          className="w-full h-full object-cover object-right sm:object-center"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-md p-8 rounded-2xl border border-white/10 shadow-[0_0_40px_rgba(139,92,246,0.1)]">

        {/* Title */}
        <h2 className="text-2xl font-semibold text-textMain text-center mb-1">
          Create Account
        </h2>
        <p className="text-sm text-textMuted text-center mb-6">
          Join MovieHub and start exploring
        </p>

        {/* Form */}
        <form onSubmit={handleSignup} className="flex flex-col gap-4">

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-textMuted">Full Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="John Doe"
              className="bg-transparent border border-border px-4 py-2.5 rounded-lg text-textMain placeholder:text-textMuted outline-none focus:ring-2 focus:ring-accentViolet focus:border-accentViolet transition"
            />
          </div>

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

            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] cursor-pointer text-textMuted"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1 relative">
            <label className="text-xs text-textMuted">Confirm Password</label>

            <input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className="bg-transparent border border-border px-4 py-2.5 pr-10 rounded-lg text-textMain placeholder:text-textMuted outline-none focus:ring-2 focus:ring-accentViolet focus:border-accentViolet transition"
            />

            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-[34px] cursor-pointer text-textMuted"
            >
              {showConfirmPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </span>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="mt-4 bg-accentViolet hover:opacity-90 text-white py-2.5 rounded-lg font-medium transition"
          >
            Sign Up
          </button>

        </form>
        {/* Footer */}
        <p className="text-sm text-textMuted mt-6 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-accentViolet hover:underline">
            Login
          </Link>
        </p>

      </div>
    </div>
  );
}