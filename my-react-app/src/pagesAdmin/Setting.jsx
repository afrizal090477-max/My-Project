import React, { useState } from "react";
import ProfilePic from "../assets/admin.png";

const Setting = () => {
  const [formData, setFormData] = useState({
    email: "johndoe@gmail.com",
    username: "John Doe",
    role: "Admin",
    status: "Active",
    language: "English",
    password: "********",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Changes saved successfully!");
  };

  return (
    <div className="p-8 w-full min-h-screen bg-[#F7F7F7]">
      <h1 className="text-3xl font-semibold text-gray-800 mb-8">Settings</h1>  
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-8 max-w-[1320px] mx-auto">
        <h2 className="text-lg font-semibold mb-6 text-gray-700">My Account</h2>

        <div className="flex items-start gap-8 mb-10">
          <div className="flex flex-col items-center">
            <img
              src={ProfilePic}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover shadow"
            />
            <button
              type="button"
              className="mt-4 bg-orange-500 text-white text-sm font-medium px-4 py-2 rounded-md hover:bg-orange-600 transition"
            >
              Change Picture
            </button>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex-1 grid grid-cols-3 gap-6 text-sm"
          >
            <div className="flex flex-col">
              <label htmlFor="email" className="text-gray-600 mb-1 font-medium">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="username"
                className="text-gray-600 mb-1 font-medium"
              >
                Username
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="flex flex-col">
              <label htmlFor="role" className="text-gray-600 mb-1 font-medium">
                Role
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                disabled
                className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="status"
                className="text-gray-600 mb-1 font-medium"
              >
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="language"
                className="text-gray-600 mb-1 font-medium"
              >
                Language
              </label>
              <select
                name="language"
                value={formData.language}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option>English</option>
                <option>Indonesia</option>
              </select>
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="text-gray-600 mb-1 font-medium"
              >
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>
          </form>
        </div>

        <div className="border-t border-gray-200 my-6"></div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSubmit}
            className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-2 rounded-md transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default Setting;
