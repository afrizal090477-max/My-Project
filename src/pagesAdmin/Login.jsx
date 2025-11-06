import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authAPI";
import { clearError } from "../features/auth/authSlice";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token, role } = useSelector((state) => state.auth);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();
    if (!trimmedUser || !trimmedPass) return;
    dispatch(loginUser({ username: trimmedUser, password: trimmedPass }));
  };

  useEffect(() => {
    if (token && role) {
      if (role === 'admin') {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/user/room-reservation", { replace: true });
      }
    }
  }, [token, role, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  return (
    <div className="relative min-h-screen w-full overflow-hidden font-roboto">
      {/* Background Image - RESPONSIVE FIX */}
      <img
        src="/meeting.png"
        alt="Meeting"
        className="absolute inset-0 w-full h-full object-cover"
      />
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* MAIN FIX: Container jadi flex center, hapus fixed positioning */}
      <div className="relative z-20 min-h-screen w-full  px-4 sm:px-6 lg:px-8">
        
        {/* Card - RESPONSIVE FIX: max-w instead of fixed width */}
        <div className="w-full max-w-[600px] h-[644px] left-[120px] top-[190px] bg-white rounded-[20px] shadow-xl border-4 border-[#E7E7E7] p-6 sm:p-8 md:p-12 my-8">
          
          {/* Logo & Text - RESPONSIVE FIX */}
          <div className="flex flex-col items-center justify-center w-full mb-6 sm:mb-8">
            <Logo />
            <h2 className="font-bold text-2xl sm:text-[32px]  text-gray-800 w-full text-center mt-3">
              Welcome Back!
            </h2>
            <p className="text-sm sm:text-[15px] text-gray-500 w-full text-center mt-1">
              Please enter your username and password here
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            
            {/* Username - RESPONSIVE FIX */}
            <div className="w-full max-w-[380px] mx-auto">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                autoComplete="username"
                placeholder="Email: john@mail.com"
                required
                className="w-full h-12 px-4 border border-gray-300 rounded-[10px] 
                         focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316] focus:outline-none
                         bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Password - RESPONSIVE FIX */}
            <div className="w-full max-w-[380px] mx-auto">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                autoComplete="current-password"
                placeholder="Password: changeme"
                required
                className="w-full h-12 px-4 border border-gray-300 rounded-[10px]
                         focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316] focus:outline-none
                         bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            {/* Forgot Password - RESPONSIVE FIX */}
            <div className="flex justify-end max-w-[380px] mx-auto w-full">
              <Link
                to="/reset-password"
                className="text-xs sm:text-sm text-[#b7bcc0] font-medium hover:text-[#FF7316] transition"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Button - RESPONSIVE FIX */}
            <div className="w-full max-w-[380px] mx-auto pt-2">
              <button
                type="submit"
                className="w-full h-12 bg-[#FF7316] hover:bg-[#e96d14] text-white font-semibold 
                         rounded-[10px] transition text-base sm:text-lg
                         disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Loading..." : "Login"}
              </button>
            </div>

            {/* Error - RESPONSIVE FIX */}
            {error && (
              <div className="w-full max-w-[380px] mx-auto">
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
                  {String(error)}
                </div>
              </div>
            )}
          </form>

          {/* Register Link - RESPONSIVE FIX */}
          <p className="text-sm sm:text-[14px] text-center text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-[#FF7316] font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
