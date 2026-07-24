import React from "react";
import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Preview All Details", path: "/account/preview" },
  { label: "Personal Details", path: "/account/personal" },
  { label: "Educational Details", path: "/account/education" },
  { label: "Clubs Details", path: "/account/clubs" },
  { label: "Team Details", path: "/account/teams" },
  { label: "Achievements", path: "/account/achievements" },
];

const LeftNavBar = () => {
  return (
    <div className="flex flex-col gap-1 p-4 w-60">
      {menuItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `px-3 py-2 rounded text-sm font-medium ${
              isActive
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
};

export default LeftNavBar;


