import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  // Don't show navbar on the auth page
  if (location.pathname === "/auth") return null;

  return (
    <nav className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-[#003580]/90 backdrop-blur-md shadow-md">
      <Link
        to="/"
        className="text-2xl font-bold text-white tracking-tighter"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        SKYEASE
      </Link>

      <div className="flex gap-4 md:gap-6 items-center text-sm font-semibold">
        <Link
          to="/"
          className={`px-4 py-2 rounded-full transition-all shadow-md ${
            location.pathname === "/"
              ? "bg-white text-blue-700"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          Home
        </Link>

      

        {user ? (
          <div className="flex items-center gap-3">
            <span
              className="text-white/70 text-sm hidden md:block"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {user.name}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-full transition-all shadow-md text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="bg-white text-blue-700 font-bold px-5 py-2 rounded-full hover:bg-blue-50 transition-all shadow-md"
          >
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;