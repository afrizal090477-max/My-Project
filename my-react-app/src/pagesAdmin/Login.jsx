import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import meetingImg from "../assets/meeting.png";

export default function Login() {
  const navigate = useNavigate();
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("isLoggedIn", "true");
    navigate("/dashboard");
  };

  return (
    <div className="relative min-h-screen flex   bg-gray-50">
      <div className="absolute inset-0">
        <img
          src={meetingImg}
          alt="Meeting Room"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div
        className="relative bg-white w-[600px] h-[644px] left-[120px] top-[50px] rounded-[20px] shadow-xl border border-gray-200 radius-20 p-8">
        
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold text-lg">
            E
          </div>
          <span className="text-[20px] font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">
            E-Meeting
          </span>
        </div>

        <h2 className="text-[38px] md:text-[36px] font-bold text-center text-gray-800">
          Welcome Back!
        </h2>
        <p className="text-[14px] text-center text-gray-500 mb-8">
          Please enter your username and password here
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <label
            htmlFor="username"
            className="text-sm font-medium text-gray-700 mb-1"
          >
            Username
          </label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            required
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316]"
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
            className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316]"
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

            <button
              type="button"
              className="text-xs text-[#b7bcc0] font-medium hover:text-orange-400"
              onClick={() => alert("Redirect to reset password page")}
            >
              Forgot Password?
            </button>
          </div>

          {/* Tombol Login */}
          <button
            type="submit"
            className="w-full h-[48px] bg-[#FF7316] hover:bg-[#e96d14] text-white font-semibold rounded-lg transition"
          >
            Login
          </button>
        </form>

        <p className="text-[13px] text-center text-gray-600 mt-6">
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
  );
}
