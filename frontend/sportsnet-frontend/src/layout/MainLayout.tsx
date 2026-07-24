import React from "react";
import { Outlet } from "react-router-dom";
import TopNavBar from "../components/TopNavBar";
import LeftNavBar from "../components/LeftNavBar";
import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      <TopNavBar />
      <div className="flex">
        {user && <LeftNavBar />}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;