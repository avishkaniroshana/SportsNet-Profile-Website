import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-bold mb-2">
        {user ? `Welcome back, ${user.fullName}` : "Welcome to SportsNet"}
      </h1>
      <p className="text-gray-600">
        {user
          ? "Use the left menu to manage your profile details."
          : "A platform for sports performers to build a profile, track achievements, and connect with clubs and teams. Sign up or sign in to get started."}
      </p>
    </div>
  );
};

export default HomePage;
