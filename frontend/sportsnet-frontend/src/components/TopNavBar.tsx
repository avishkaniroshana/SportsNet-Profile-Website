import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TopNavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinkClass = (path: string) =>
    `text-sm font-medium transition-colors ${
      location.pathname === path
        ? "text-blue-600"
        : "text-gray-600 hover:text-blue-600"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <div className="h-full max-w-screen-2xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2">
            
            <span className="text-lg font-bold text-gray-900">SportsNet</span>
          </Link>

          <div className="hidden sm:flex items-center gap-6">
            <Link to="/" className={navLinkClass("/")}>
              Home
            </Link>
            <Link to="/about" className={navLinkClass("/about")}>
              About Us
            </Link>
            <Link to="/players" className={navLinkClass("/players")}>
              All Players
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/account/personal"
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                <span className="w-7 h-7 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
                My Account
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 border border-red-200 px-4 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
              >
                Sign Up
              </Link>
              <Link
                to="/signin"
                className="text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-1.5 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default TopNavBar;