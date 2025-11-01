import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Logo from "../components/Logo";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authAPI";
import { clearError } from "../features/auth/authSlice";  // TAMBAHAN: import clearError


export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token, role } = useSelector((state) => state.auth);  // TAMBAHAN: ambil role


  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");


  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmedUser = username.trim();
    const trimmedPass = password.trim();
    if (!trimmedUser || !trimmedPass) return;
    dispatch(loginUser({ username: trimmedUser, password: trimmedPass }));
  };


  // MODIFIKASI: Redirect berdasarkan role
  useEffect(() => {
    if (token && role) {
      if (role === 'admin') {
        navigate("/dashboard", { replace: true });
      } else {
        navigate("/user/room-reservation", { replace: true });
      }
    }
  }, [token, role, navigate]);
  
  
  // TAMBAHAN: Clear error saat component unmount
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);


  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <img
        src="/meeting.png"
        alt="Meeting"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        style={{ minWidth: 1536, minHeight: 1024 }}
      />
      <div className="absolute inset-0 bg-black/30 z-10" />
      <div className="relative z-20 min-h-screen w-full">
        <div
          className="absolute rounded-[20px] shadow-xl bg-white border border-gray-200"
          style={{
            left: 120,
            top: "50%",
            transform: "translateY(-50%)",
            width: 600,
            height: 644,
            maxWidth: "calc(100vw - 140px)",
            maxHeight: "96vh",
            padding: 48,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div className="flex flex-col items-center justify-center w-full mb-8">
            <Logo />
            <h2 className="font-bold text-[32px] text-gray-800 w-full text-center mt-3">
              Welcome Back!
            </h2>
            <p className="text-[15px] text-gray-500 w-full text-center mt-1">
              Please enter your username and password here
            </p>
          </div>


          <form onSubmit={handleSubmit} className="flex flex-col">
            <label
              htmlFor="username"
              className="text-sm font-medium text-gray-700 mb-1"
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
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316] bg-white"
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />


            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 mb-1"
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
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316] bg-white"
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />


            <div className="flex justify-end mt-1 mb-6">
              <Link
                to="/reset-password"
                className="text-xs text-[#b7bcc0] font-medium hover:text-orange-400 transition"
              >
                Forgot Password?
              </Link>
            </div>


            <button
              type="submit"
              className="w-full h-[48px] bg-[#FF7316] hover:bg-[#e96d14] text-white font-semibold rounded-lg transition text-lg"
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>


            {error && (
              <div className="mt-3 text-red-600 text-center text-sm">
                {String(error)}
              </div>
            )}
          </form>


          <p className="text-[14px] text-center text-gray-600 mt-6">
            Don&apos;t have an account?{" "}
            <Link
              to="/register"
              className="!text-[#FF7316] font-medium hover:underline"
            >
              Register
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
