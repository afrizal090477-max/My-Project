import React, { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const DashboardLayout = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  return (
    <div
      className={`flex min-h-screen ${
        darkMode ? "bg-gray-900 text-black" : "bg-[#F7F7F7] text-gray-900"
      } transition-colors duration-500`}
    >
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />

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

export default DashboardLayout;
