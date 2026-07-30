import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Preview All Details", path: "/account/preview" },
  { label: "Personal Details", path: "/account/personal" },
  { label: "Educational Details", path: "/account/education" },
  { label: "Club Details", path: "/account/clubs" },
  { label: "Team Details", path: "/account/teams" },
  { label: "Achievements", path: "/account/achievements" },
];

const LeftNavBar = () => {
  return (
    <aside className="fixed left-0 top-16 w-60 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 overflow-y-auto">
      <div className="p-4">
        <p className="px-3 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Menu
        </p>
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `relative px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r bg-blue-600" />
                  )}
                  {item.label}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default LeftNavBar;
