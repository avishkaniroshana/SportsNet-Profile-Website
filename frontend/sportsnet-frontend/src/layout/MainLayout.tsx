import { Outlet } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import LeftNavBar from "../components/LeftNavBar";
import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavBar />
      {user && <LeftNavBar />}
      <main className={`pt-16 min-h-screen ${user ? "pl-60" : ""}`}>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
