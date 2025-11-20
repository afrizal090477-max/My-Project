import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";

export default function Login() {
  const { handleLogin, token, role, error, loading } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const navigate = useNavigate();

  // Redirect otomatis sesuai role, FE mapping dari JWT (AuthContext)
  useEffect(() => {
    if (token && role) {
      console.log("Redirect berdasarkan role:", role);
      if (role === "admin") navigate("/dashboard", { replace: true });
      else if (role === "user")
        navigate("/user/room-reservation", { replace: true });
      else navigate("/user/room-reservation", { replace: true }); // fallback
    }
  }, [token, role, navigate]);

  // Handle submit dengan validasi lokal
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    if (!username || !password) {
      setLocalError("Username & password wajib diisi");
      return;
    }
    try {
      await handleLogin({ username, password });
      // Tidak perlu navigasi di sini, otomatis di useEffect di atas!
    } catch (err) {
      // Error context sudah otomatis dikirim ke 'error'
    }
  };

  return (
    <div
      className="min-h-screen w-full flex items-center left-[120px]"
      style={{
        backgroundImage: "url('/meeting.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <div className="relative z-20 min-h-screen w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-[600px] h-[644px] left-[120px] top-[190px] bg-white rounded-[20px] shadow-xl border-4 border-[#E7E7E7] p-6 sm:p-8 md:p-12 my-8">
          <div className="flex flex-col items-center justify-center w-full mb-6 sm:mb-8">
            <Logo />
            <h2 className="font-bold text-2xl sm:text-[32px] text-gray-800 w-full text-center mt-3">
              Welcome Back!
            </h2>
            <p className="text-sm sm:text-[15px] text-gray-500 w-full text-center mt-1">
              Please enter your username and password here
            </p>
          </div>
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
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
                placeholder="Username"
                required
                className="w-full h-12 px-4 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316] focus:outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                onChange={(e) => setUsername(e.target.value)}
                disabled={loading}
              />
            </div>
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
                placeholder="Password"
                required
                className="w-full h-12 px-4 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316] focus:outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="flex justify-end max-w-[380px] mx-auto w-full">
              <Link
                to="/reset-password"
                className="text-xs sm:text-sm text-[#b7bcc0] font-medium hover:text-[#FF7316] transition"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="w-full max-w-[380px] mx-auto pt-2">
              <button
                type="submit"
                className="w-full h-12 bg-[#FF7316] hover:bg-[#e96d14] text-white font-semibold rounded-[10px] transition text-base sm:text-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Loading..." : "Login"}
              </button>
            </div>
            {(localError || error) && (
              <div className="w-full max-w-[380px] mx-auto">
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm text-center">
                  {localError ? localError : String(error)}
                </div>
              </div>
            )}
          </form>
          <p className="text-sm sm:text-[14px] text-center text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="text-[#FF7316] font-medium hover:underline"
            >
              Register
            </Link>
          </p>
          <footer className="w-full mt-8 text-center text-gray-500 text-xs">
            <span className="font-italic">
              Copyright by Rizal, Pandu & Fajar. {new Date().getFullYear()}{" "}
              Frontend Developers SKFE-5.
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}
