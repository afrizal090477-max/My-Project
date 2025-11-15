import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; 
import { usePageTitle } from "../context/PageTitleContext";
import UserPhoto from "../assets/JhonDoe.png";
import LogoutIcon from "../assets/logout.png";

const HeaderUser = () => {
  const navigate = useNavigate();
  const { user, role, handleLogout } = useAuth();
  const { pageTitle } = usePageTitle();

  const username = user?.username || user?.email || "User";
  const userRole = role === 'user' ? 'Customer' : role || 'Customer';

  const onLogout = () => {
    handleLogout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 flex items-center justify-between px-8 py-4 shadow-sm">
      <h1 className="text-[22px] font-semibold font-roboto transition-all duration-300">
        {pageTitle}
      </h1>
      <div className="flex items-center gap-4">
        <img src={UserPhoto} alt="User" className="w-10 h-10 rounded-full object-cover" />
        <div className="text-left">
          <p className="text-sm font-medium">{username}</p>
          <p className="text-xs text-gray-500">{userRole}</p>
        </div>
        <button onClick={handleLogout} className="ml-4 focus:outline-none" aria-label="Logout">
          <img src={LogoutIcon} alt="Logout" className="w-6 h-6 hover:opacity-70 transition" />
        </button>
      </div>
    </header>
  );
};

export default HeaderUser;
