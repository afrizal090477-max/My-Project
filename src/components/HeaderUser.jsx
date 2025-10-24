import React from "react";
import UserPhoto from "../assets/JhonDoe.png"; // Path sesuai avatar user
import LogoutIcon from "../assets/logout.png";
import { useNavigate } from "react-router-dom";
import { usePageTitle } from "../context/PageTitleContext";

const HeaderUser = () => {
  const navigate = useNavigate();
  const { pageTitle } = usePageTitle();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    navigate("/user/login");
  };

  // (Nanti data user bisa diambil dari context/auth Redux, untuk sementara manual)
  const user = {
    name: "John Doe",
    status: "User",
    photo: UserPhoto,
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 flex items-center justify-between px-8 py-4 shadow-sm">
      {/* Title dinamis dari PageTitleContext */}
      <h1 className="text-[22px] font-semibold font-roboto transition-all duration-300">
        {pageTitle}
      </h1>

      {/* Bagian kanan: profile user dan logout */}
      <div className="flex items-center gap-4">
        <img
          src={user.photo}
          alt="User Avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="text-left">
          <p className="text-sm font-medium">{user.name}</p>
          <p className="text-xs text-gray-500">{user.status}</p>
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

export default HeaderUser;
