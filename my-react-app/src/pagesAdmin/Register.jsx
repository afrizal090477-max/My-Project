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
    <div className="relative flex  min-h-screen">
      <img
        src={meetingImg}
        alt="Meeting"
        className="absolute inset-0 w-full h-full object-cover"
      />

     <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative w-[600px] h-[644px] left-[120px] top-[50px] bg-white backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl pt-4 px-8">
        <div className="flex items-center justify-center gap-2 mb-2 ">
          <div className=" text-[20px] w-[50px] h-[50px] rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold">
            E
          </div>
          <h1 className="!text-[20px] font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent">E-Meeting</h1>
        </div>

        <h2 className="text-[38px]  font-bold text-center text-gray-800">
          Create an Account
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Please fill in your details below
        </p>

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
            className="block w-full px-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm mb-4"
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
            className="block w-full px-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm mb-4"
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
            className="block w-full px-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm mb-4"
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
            className="block w-full px-3 py-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm mb-6"
            required
          />

          <button
            type="submit"
            className="w-full h-[48px] bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-md transition mt-4"
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
  );
}

export default Register;
