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
    `text-xs font-bold transition-all px-3 py-1.5 rounded-xl ${
      location.pathname === path
        ? "text-blue-600 bg-blue-50"
        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-xs">
      <div className="h-full max-w-screen-2xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="text-lg font-extrabold tracking-tight text-gray-900">
              Sports<span className="text-blue-600">Net</span>
            </span>
          </Link>

          <div className="hidden sm:flex items-center gap-1">
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
                className="flex items-center gap-2.5 text-xs font-bold text-gray-800 hover:text-blue-600 bg-gray-50 hover:bg-blue-50 px-3 py-1.5 rounded-xl border border-gray-200/60 transition-all"
              >
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                  {user.fullName?.charAt(0).toUpperCase()}
                </span>
                <span>{user.fullName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="text-xs font-bold text-red-600 border border-red-200 px-3.5 py-1.5 rounded-xl hover:bg-red-50 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signup"
                className="text-xs font-bold text-gray-700 hover:text-blue-600 px-3 py-1.5 transition-colors"
              >
                Sign Up
              </Link>
              <Link
                to="/signin"
                className="text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-2 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
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