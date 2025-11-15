import React, { useState, useEffect } from "react";
import SidebarUser from "../components/SidebarUser";
import HeaderUser from "../components/HeaderUser";
import { Outlet } from "react-router-dom";

const DashboardLayoutUser = () => {
  const [darkMode, setDarkMode] = useState(() => {
    // Ambil preferensi dark mode dari localStorage jika ada
    const lsVal = localStorage.getItem("darkMode");
    return lsVal ? JSON.parse(lsVal) : false;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div
      className={`flex min-h-screen ${
        darkMode ? "bg-gray-900 text-black" : "bg-[#F7F7F7] text-gray-900"
      } transition-colors duration-500`}
    >
      <SidebarUser />
      <div className="flex-1 flex flex-col">
        <HeaderUser />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
        <footer className="flex justify-center items-center py-4 border-t border-gray-300 dark:border-gray-700">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="flex items-center space-x-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-full shadow-sm transition"
          >
            <span>{darkMode ? "🌙 Dark Mode" : "☀️ Light Mode"}</span>
          </button>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayoutUser;
