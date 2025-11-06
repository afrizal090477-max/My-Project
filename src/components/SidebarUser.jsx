import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowRightIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
  Cog6ToothIcon
} from "@heroicons/react/24/outline";
import { usePageTitle } from "../context/PageTitleContext";

const SidebarUser = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setPageTitle } = usePageTitle();
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const [hoveredMenu, setHoveredMenu] = useState(null);

  useEffect(() => {
    setActiveMenu(location.pathname);
  }, [location.pathname]);

  const menuItems = [
    { id: "reservation", name: "Room Reservation", path: "/user/room-reservation", icon: <BuildingOffice2Icon className="w-6 h-6" /> },
    { id: "history", name: "History", path: "/user/history", icon: <DocumentTextIcon className="w-6 h-6" /> },
    { id: "settings", name: "Setting", path: "/user/setting", icon: <Cog6ToothIcon className="w-6 h-6" /> }
  ];

  const handleGoBack = () => {
    if (globalThis.history.state && globalThis.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/user");
    }
  };

  const handleNavigation = (path, name) => {
    setActiveMenu(path);
    setPageTitle(name);
    navigate(path);
  };

  return (
    <aside className="w-[80px] bg-white border-r border-gray-200 flex flex-col items-center py-8 space-y-10">
      <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold shadow-md">
        E
      </div>
      <div className="relative">
        <button
          type="button"
          onClick={handleGoBack}
          onMouseEnter={() => setHoveredMenu("back")}
          onMouseLeave={() => setHoveredMenu(null)}
          className="w-[48px] h-[48px] flex items-center justify-center"
        >
          <ArrowRightIcon
            className={`w-6 h-6 transition-colors duration-300 ${hoveredMenu === "back" ? "text-orange-500" : "text-gray-700"}`}
          />
        </button>
        {hoveredMenu === "back" && (
          <div className="absolute left-[65px] top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-md shadow-md whitespace-nowrap">
            Go Back
          </div>
        )}
      </div>
      <nav className="flex flex-col items-center gap-6 mt-2">
        {menuItems.map((item) => {
          const isActive = activeMenu === item.path;
          const isHovered = hoveredMenu === item.path;
          return (
            <div key={item.id} className="relative flex flex-col items-center">
              <button
                type="button"
                aria-label={`Go to ${item.name}`}
                onClick={() => handleNavigation(item.path, item.name)}
                onMouseEnter={() => setHoveredMenu(item.path)}
                onMouseLeave={() => setHoveredMenu(null)}
                className="w-[48px] h-[48px] flex items-center justify-center"
              >
                <span className={`transition-colors duration-300 text-[22px] ${isActive || isHovered ? "text-orange-500" : "text-gray-700"}`}>
                  {item.icon}
                </span>
                {isActive && (
                  <span className="absolute right-[-10px] w-[4px] h-[24px] bg-orange-500 rounded-full shadow-[0_0_6px_rgba(249,115,22,0.5)] transition-all duration-300"></span>
                )}
              </button>
              {hoveredMenu === item.path && (
                <div className="absolute z-10 left-[65px] top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-md shadow-md whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default SidebarUser;
