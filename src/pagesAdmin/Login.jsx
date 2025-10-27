import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function Login() {
  const navigate = useNavigate();
  const [remember, setRemember] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email === "admin@email.com") {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", "admin");
      navigate("/dashboard");
    } else if (email.endsWith("@email.com")) {
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("role", "user");
      navigate("/user/room-reservation");
    } else {
      setMessage(
        "Email tidak dikenali! Gunakan admin@email.com atau user@email.com"
      );
    }
  };

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
              Please enter your email and password here
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316] bg-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              required
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316] bg-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <div className="flex items-center justify-between mt-3 mb-6">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 text-[#FF7316] border-gray-300 rounded focus:ring-[#FF7316]"
                />
                <span>Remember me</span>
              </label>
              <div>
                <Link
                  to="/reset-password"
                  className="text-xs text-[#b7bcc0] font-medium hover:text-orange-400 transition"
                >
                  Forgot Password?
                </Link>
              </div>
            </div>
            <button
              type="submit"
              className="w-full h-[48px] bg-[#FF7316] hover:bg-[#e96d14] text-white font-semibold rounded-lg transition text-lg"
            >
              Login
            </button>
            {message && (
              <div className="mt-3 text-red-600 text-center text-sm">
                {message}
              </div>
            )}
          </form>
          <p className="text-[14px] text-center text-gray-600 mt-6">
            Don’t have an account?{" "}
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
