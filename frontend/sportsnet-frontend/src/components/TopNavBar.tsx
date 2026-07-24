import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TopNavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // changed from "/signin"
  };

  return (
    <nav className="bg-white shadow px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-blue-600">SportsNet</h1>
        <Link
          to="/"
          className="text-gray-700 hover:text-blue-600 text-sm font-medium"
        >
          Home
        </Link>
        <Link
          to="/about"
          className="text-gray-700 hover:text-blue-600 text-sm font-medium"
        >
          About Us
        </Link>
        <Link
          to="/players"
          className="text-gray-700 hover:text-blue-600 text-sm font-medium"
        >
          All Players Summary
        </Link>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              to="/account/personal"
              className="text-gray-700 hover:text-blue-600 text-sm font-medium"
            >
              My Account
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-1.5 rounded text-sm hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              to="/signup"
              className="text-gray-700 hover:text-blue-600 text-sm font-medium"
            >
              Sign Up
            </Link>
            <Link
              to="/signin"
              className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700"
            >
              Sign In
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default TopNavBar;


