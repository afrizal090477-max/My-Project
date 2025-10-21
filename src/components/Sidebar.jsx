import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaArrowRight,
  FaThLarge,
  FaClipboardList,
  FaBed,
  FaFileAlt,
  FaCog,
 
} from "react-icons/fa";
import { usePageTitle } from "../context/PageTitleContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setPageTitle } = usePageTitle();
  const [activeMenu, setActiveMenu] = useState(location.pathname);
  const [hoveredMenu, setHoveredMenu] = useState(null);

  // menu utama
  const menuItems = [
    { id: "dashboard", name: "Dashboard", path: "/dashboard", icon: <FaThLarge /> },
    { id: "reservation", name: "Reservation Schedule", path: "/reservation", icon: <FaClipboardList /> },
    { id: "rooms", name: "Rooms", path: "/rooms", icon: <FaBed /> },
    { id: "report", name: "Report", path: "/report", icon: <FaFileAlt /> },
    { id: "settings", name: "Settings", path: "/settings", icon: <FaCog /> },
  ];

  const handleNavigation = (path, name) => {
    setActiveMenu(path);
    setPageTitle(name);
    navigate(path);
  };

  const handleGoBack = () => {
    if (globalThis.history.state && globalThis.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <aside className="w-[80px] bg-white border-r border-gray-200 flex flex-col items-center py-8 space-y-10">
      {/* Logo */}
      <div className="w-[40px] h-[40px] rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold shadow-md">
        E
      </div>

      {/* Tombol Go Back */}
      <div className="relative">
        <button
          type="button"
          onClick={handleGoBack}
          onMouseEnter={() => setHoveredMenu("back")}
          onMouseLeave={() => setHoveredMenu(null)}
          className="w-[48px] h-[48px] flex items-center justify-center"
        >
          <FaArrowRight
            size={22}
            className={`transition-colors duration-300 ${
              hoveredMenu === "back" ? "text-orange-500" : "text-gray-700"
            }`}
          />
        </button>

        {/* Tooltip Go Back */}
        {hoveredMenu === "back" && (
          <div className="absolute left-[65px] top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-md shadow-md whitespace-nowrap">
            Go Back
          </div>
        )}
      </div>

      {/* Menu Navigasi */}
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
                <span
                  className={`transition-colors duration-300 text-[22px] ${
                    isActive || isHovered ? "text-orange-500" : "text-gray-700"
                  }`}
                >
                  {item.icon}
                </span>

                {/* Garis aktif di kanan */}
                {isActive && (
                  <span className="absolute right-[-10px] w-[4px] h-[24px] bg-orange-500 rounded-full shadow-[0_0_6px_rgba(249,115,22,0.5)] transition-all duration-300"></span>
                )}
              </button>

              {/* Tooltip */}
              {hoveredMenu === item.path && (
                <div className="absolute left-[65px] top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-md shadow-md whitespace-nowrap">
                  {item.name}
                </div>
              )}
            </div>
          );
        })}
      </nav>

     

        {hoveredMenu === "home" && (
          <div className="absolute left-[65px] top-1/2 -translate-y-1/2 bg-gray-800 text-white text-xs px-3 py-1 rounded-md shadow-md whitespace-nowrap">
            Home
          </div>
        )}
     
    </aside>
  );
};

export default Sidebar;
