// src/pages/Signup.jsx
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6">

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
          Create Account
        </h2>
        <p className="text-sm text-textMuted text-center mb-6">
          Join MovieHub and start exploring
        </p>

        {/* Form */}
        <form className="flex flex-col gap-4">

          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-textMuted">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="bg-transparent border border-border px-4 py-2.5 rounded-lg text-textMain placeholder:text-textMuted outline-none focus:ring-2 focus:ring-accentViolet focus:border-accentViolet transition"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-textMuted">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="bg-transparent border border-border px-4 py-2.5 rounded-lg text-textMain placeholder:text-textMuted outline-none focus:ring-2 focus:ring-accentViolet focus:border-accentViolet transition"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-textMuted">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="bg-transparent border border-border px-4 py-2.5 rounded-lg text-textMain placeholder:text-textMuted outline-none focus:ring-2 focus:ring-accentViolet focus:border-accentViolet transition"
            />
          </div>

          {/* Button */}
          <button className="mt-4 bg-accentViolet hover:opacity-90 text-white py-2.5 rounded-lg font-medium transition">
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