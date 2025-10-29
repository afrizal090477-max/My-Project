import React from "react";
import meetingImg from "@/assets/meeting.png";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Registrasi berhasil!");
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen w-full bg-[#bfc0c0] overflow-hidden">
      <img
        src={meetingImg}
        alt="Meeting"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        style={{ minWidth: 1536, minHeight: 1024 }}
      />
      <div className="absolute inset-0 bg-black/30 z-10"></div>

      <div className="relative z-20 min-h-screen w-full">
        <div
          className="absolute bg-white shadow-2xl backdrop-blur-md border border-gray-200 rounded-[20px]"
          style={{
            left: 120,
            top: "50%",
            transform: "translateY(-50%)",
            width: 600,
            height: 815,
            maxWidth: "calc(100vw - 140px)",
            maxHeight: "96vh",
            padding: 48,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div className="flex flex-col items-center justify-center w-full mb-8">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold text-xl shadow">
                E
              </div>
              <span className="text-[22px] font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent select-none">
                E-Meeting
              </span>
            </div>
            <h2 className="text-[32px] font-bold text-gray-800 w-full text-center mt-2">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-500 w-full text-center mt-1">
              Create your account here!
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg mb-4 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            />

            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="email@example.com"
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg mb-4 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            />

            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg mb-4 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            />

            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg mb-6 shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
              required
            />

            <button
              type="submit"
              className="w-full h-[48px] bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition mt-4 text-[17px]"
            >
              Register
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?
            <Link
              to="/login"
              className="text-orange-500 font-medium hover:underline ml-1"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
