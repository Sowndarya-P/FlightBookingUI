import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Auth = () => {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  // If already logged in, redirect to home
  if (user) return <Navigate to="/" replace />;

  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const getUsers = () => JSON.parse(localStorage.getItem("skyease_users") || "[]");
  const saveUser = (u) => {
    const users = getUsers();
    users.push(u);
    localStorage.setItem("skyease_users", JSON.stringify(users));
  };

  const validate = () => {
    const e = {};
    if (mode === "signup" && !form.name.trim()) e.name = "Full name is required";
    if (!form.email.includes("@")) e.email = "Enter a valid email";
    if (form.password.length < 6) e.password = "Minimum 6 characters";
    if (mode === "signup" && form.password !== form.confirm) e.confirm = "Passwords do not match";
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setTimeout(() => {
      if (mode === "signup") {
        const users = getUsers();
        if (users.find((u) => u.email === form.email)) {
          setErrors({ email: "Email already registered" });
          setLoading(false);
          return;
        }
        const newUser = { name: form.name, email: form.email, password: form.password };
        saveUser(newUser);
        login(newUser);
      } else {
        const users = getUsers();
        const found = users.find((u) => u.email === form.email && u.password === form.password);
        if (!found) {
          setErrors({ email: "Invalid email or password" });
          setLoading(false);
          return;
        }
        login(found);
      }
      setLoading(false);
      navigate("/");
    }, 800);
  };

  // Fixed: separate handlers so each tab independently sets the correct mode
  const goSignIn = () => {
    setMode("signin");
    setForm({ name: "", email: "", password: "", confirm: "" });
    setErrors({});
  };

  const goSignUp = () => {
    setMode("signup");
    setForm({ name: "", email: "", password: "", confirm: "" });
    setErrors({});
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #020818 0%, #0a1628 40%, #0d2444 70%, #0a3060 100%)" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes spin-slow { to { transform: rotate(360deg); } }

        .auth-card { animation: fadeUp 0.6s ease forwards; }

        .shimmer-text {
          background: linear-gradient(90deg, #fff 0%, #93c5fd 40%, #fff 60%, #bfdbfe 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }
        .input-field {
          width: 100%;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 14px 16px;
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          box-sizing: border-box;
        }
        .input-field::placeholder { color: rgba(255,255,255,0.3); }
        .input-field:focus { border-color: rgba(59,130,246,0.6); background: rgba(255,255,255,0.08); }
        .input-field.error { border-color: rgba(248,113,113,0.6); }

        .submit-btn {
          width: 100%; padding: 14px; border-radius: 12px;
          font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 1rem;
          color: #fff; background: linear-gradient(135deg, #2563eb, #1d4ed8);
          border: none; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s, opacity 0.2s;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 16px 32px rgba(37,99,235,0.4); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .glass-card {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
        .dot-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
          background-size: 48px 48px;
        }
        .orbit {
          position: absolute; border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.04);
          animation: spin-slow 20s linear infinite;
        }
        .tab-btn {
          flex: 1; padding: 10px; border-radius: 8px;
          font-family: 'DM Sans', sans-serif; font-size: 0.9rem; font-weight: 600;
          transition: all 0.25s ease; cursor: pointer; border: none;
        }
        .tab-active { background: rgba(59,130,246,0.25); color: #93c5fd; }
        .tab-inactive { background: transparent; color: rgba(255,255,255,0.3); }
        .tab-inactive:hover { color: rgba(255,255,255,0.6); }
      `}</style>

      <div className="dot-grid" />
      <div className="orbit" style={{ width: 500, height: 500, top: "50%", left: "50%", transform: "translate(-50%,-50%)" }} />
      <div className="orbit" style={{ width: 340, height: 340, top: "50%", left: "50%", transform: "translate(-50%,-50%)", animationDirection: "reverse", animationDuration: "14s" }} />
      <div style={{ position: "absolute", top: "20%", right: "15%", width: 180, height: 180, borderRadius: "50%", background: "radial-gradient(circle, rgba(37,99,235,0.12), transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: "20%", left: "10%", width: 220, height: 220, borderRadius: "50%", background: "radial-gradient(circle, rgba(14,165,233,0.08), transparent 70%)", pointerEvents: "none" }} />

      <div className="auth-card glass-card rounded-2xl w-full max-w-md p-8 relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-white text-3xl font-black tracking-tighter mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            SKY<span className="shimmer-text">EASE</span>
          </h1>
          <p className="text-white/30 text-xs tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            ✈ Your flight companion
          </p>
        </div>

        {/* Tab switcher — FIXED: each button sets its own mode directly */}
        <div className="flex gap-1 p-1 rounded-xl mb-7" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}>
          <button className={`tab-btn ${mode === "signin" ? "tab-active" : "tab-inactive"}`} onClick={goSignIn} type="button">
            Sign In
          </button>
          <button className={`tab-btn ${mode === "signup" ? "tab-active" : "tab-inactive"}`} onClick={goSignUp} type="button">
            Sign Up
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-white text-xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
            {mode === "signin" ? "Welcome back" : "Create account"}
          </h2>
          <p className="text-white/40 text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {mode === "signin" ? "Sign in to continue booking flights" : "Join SkyEase and start exploring"}
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-4">
            {mode === "signup" && (
              <div>
                <input className={`input-field ${errors.name ? "error" : ""}`}
                  type="text" name="name" placeholder="Full Name"
                  value={form.name} onChange={handleChange} autoComplete="name" />
                {errors.name && <p className="text-red-400 text-xs mt-1 ml-1">{errors.name}</p>}
              </div>
            )}

            <div>
              <input className={`input-field ${errors.email ? "error" : ""}`}
                type="email" name="email" placeholder="Email Address"
                value={form.email} onChange={handleChange} autoComplete="email" />
              {errors.email && <p className="text-red-400 text-xs mt-1 ml-1">{errors.email}</p>}
            </div>

            <div className="relative">
              <input className={`input-field ${errors.password ? "error" : ""}`}
                type={showPass ? "text" : "password"} name="password" placeholder="Password"
                value={form.password} onChange={handleChange}
                autoComplete={mode === "signup" ? "new-password" : "current-password"} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs transition-colors">
                {showPass ? "HIDE" : "SHOW"}
              </button>
              {errors.password && <p className="text-red-400 text-xs mt-1 ml-1">{errors.password}</p>}
            </div>

            {mode === "signup" && (
              <div>
                <input className={`input-field ${errors.confirm ? "error" : ""}`}
                  type={showPass ? "text" : "password"} name="confirm" placeholder="Confirm Password"
                  value={form.confirm} onChange={handleChange} autoComplete="new-password" />
                {errors.confirm && <p className="text-red-400 text-xs mt-1 ml-1">{errors.confirm}</p>}
              </div>
            )}

            <button type="submit" className="submit-btn mt-2" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                    <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {mode === "signin" ? "Signing in..." : "Creating account..."}
                </span>
              ) : (
                mode === "signin" ? "Sign In →" : "Create Account →"
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-white/30 text-sm mt-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
          <button onClick={mode === "signin" ? goSignUp : goSignIn} type="button"
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors underline underline-offset-2">
            {mode === "signin" ? "Sign Up" : "Sign In"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Auth;