import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto space-y-10">
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl border border-indigo-500/20">
        <div className="absolute right-0 bottom-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="max-w-2xl space-y-6 relative z-10">
          

          <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight tracking-tight">
            Build Your Digital Sports Profile & Connect with Clubs
          </h1>

          <p className="text-blue-100 text-base leading-relaxed">
            {user
              ? `Welcome back, ${user.fullName}! Keep your sports profiles, education history, team experiences, and trophy achievements updated to attract scouts and recruiters.`
              : "The all-in-one platform for players to showcase stats, track career achievements, list club and team histories, and connect with scouts nationwide."}
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            {user ? (
              <>
                <Link
                  to="/account/sports"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/30 transition-all"
                >
                  Manage Sport Profiles
                </Link>
                <Link
                  to="/account/preview"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-6 py-3 rounded-2xl border border-white/20 backdrop-blur-xs transition-all"
                >
                  Preview My Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-lg shadow-blue-500/30 transition-all"
                >
                  Get Started Free →
                </Link>
                <Link
                  to="/players"
                  className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-6 py-3 rounded-2xl border border-white/20 backdrop-blur-xs transition-all"
                >
                  Explore Directory
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3 hover:shadow-md transition-all">
          <h3 className="font-extrabold text-gray-900 text-lg">
            Multi-Sport Profiles
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Add separate profiles for each sport you play — Cricket, Football,
            Rugby, Athletics — and track your position and bio per sport.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3 hover:shadow-md transition-all">
          <h3 className="font-extrabold text-gray-900 text-lg">
            Clubs & Teams History
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Record all clubs and teams you have represented with start/end
            dates, roles, and achievements attached directly to each sport.
          </p>
        </div>

        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-3 hover:shadow-md transition-all">
          <h3 className="font-extrabold text-gray-900 text-lg">
            Public Player Directory
          </h3>
          <p className="text-gray-500 text-sm leading-relaxed">
            Gain visibility in our public player directory. Allow scouts,
            coaches, and clubs to discover your physical stats and milestones.
          </p>
        </div>
      </div>

      {/* Quick Action Banner */}
      <div className="bg-gradient-to-r from-gray-900 to-slate-800 text-white rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-1 text-center sm:text-left">
          <h2 className="text-xl font-extrabold">
            Ready to explore active players?
          </h2>
          <p className="text-gray-400 text-sm">
            Browse our nationwide database of sports performers.
          </p>
        </div>
        <Link
          to="/players"
          className="bg-white text-gray-900 hover:bg-gray-100 font-extrabold text-xs px-6 py-3 rounded-2xl transition-all shrink-0"
        >
          View All Players →
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
