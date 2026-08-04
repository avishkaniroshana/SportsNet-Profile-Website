import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Personal Details", path: "/account/personal"},
  { label: "Sport Profiles", path: "/account/sports"},
  { label: "Educational Details", path: "/account/education"},
  { label: "Club Details", path: "/account/clubs" },
  { label: "Team Details", path: "/account/teams" },
  { label: "Achievements", path: "/account/achievements" },
  { label: "Preview Profile", path: "/account/preview" },
];

const LeftNavBar = () => {
  return (
    <aside className="fixed left-0 top-16 w-60 h-[calc(100vh-4rem)] bg-white border-r border-gray-100 overflow-y-auto z-40 hidden md:block shadow-xs">
      <div className="p-4 space-y-4">
        <div>
          <p className="px-3 mb-2 text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">
            Player Management
          </p>
          <nav className="flex flex-col gap-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `relative flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-xs"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-blue-600" />
                    )}
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </aside>
  );
};

export default LeftNavBar;
