import React from "react";
import AdminPhoto from "@/assets/admin.png";
import LogoutIcon from "@/assets/logout.png";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "@/context/PageTitleContext"; // ✅ Tambahkan ini

const Header = () => {
  const navigate = useNavigate();
  const { pageTitle } = usePageTitle(); // ✅ Ambil judul dari Context

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <header className="w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-8 py-4 shadow-sm">
      {/* Title dinamis */}
      <h1 className="text-[22px] font-semibold font-roboto transition-all duration-300">
        {pageTitle}
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <img
          src={AdminPhoto}
          alt="Admin"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="text-left">
          <p className="text-sm font-medium">Angelina</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Admin</p>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="ml-4 focus:outline-none"
          aria-label="Logout"
        >
          <img
            src={LogoutIcon}
            alt="Logout Icon"
            className="w-6 h-6 hover:opacity-70 transition"
          />
        </button>
      </div>
    </header>
  );
};

export default Header;
