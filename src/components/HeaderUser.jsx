import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";  // TAMBAHAN: import useSelector
import { logout as logoutAction } from "../features/auth/authSlice";
import { usePageTitle } from "../context/PageTitleContext";
import UserPhoto from "../assets/JhonDoe.png";
import LogoutIcon from "../assets/logout.png";


const HeaderUser = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { pageTitle } = usePageTitle();
  
  // MODIFIKASI: Ambil user dan role dari Redux store (bukan localStorage)
  const { user, role } = useSelector((state) => state.auth);
  const username = user?.username || user?.email || "User";
  const userRole = role === 'user' ? 'Customer' : role || 'Customer';


  const handleLogout = () => {
    // Clear Redux store (sudah termasuk clear localStorage di dalam action)
    dispatch(logoutAction());
    
    // HAPUS: localStorage manual clear (sudah di handle di authSlice)
    // localStorage.removeItem("isLoggedIn");
    // localStorage.removeItem("role");
    // localStorage.removeItem("username");
    // localStorage.removeItem("token");
    
    // Redirect ke login
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
