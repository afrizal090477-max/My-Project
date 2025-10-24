import React, { useState, useRef, useEffect } from "react";
import defaultPhoto from "../assets/home.png";

export default function UserSetting() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "johndoe@gmail.com",
    username: "John Doe",
    status: "Active",
    language: "English",
    password: "********",
  });

  const [photo, setPhoto] = useState(defaultPhoto);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const savedPhoto = localStorage.getItem("userPhoto");
    if (savedPhoto) setPhoto(savedPhoto);
  }, []);

  useEffect(() => {
    localStorage.setItem("userPhoto", photo);
  }, [photo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleEdit = () => {
    if (isEditing) alert("✅ Changes saved successfully!");
    setIsEditing(!isEditing);
  };

  const handleChangePicture = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="w-[800px] max-w-full bg-white shadow-md p-8 mx-auto rounded-xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-8">My Account</h2>
        <div className="flex items-center gap-4 mb-8">
          <img
            src={photo}
            alt="User"
            className="w-[100px] h-[100px] rounded-full object-cover border-2 border-orange-400"
          />
          {isEditing && (
            <div>
              <button
                onClick={handleChangePicture}
                className="mt-2 w-[106px] h-[34px] bg-orange-500 text-white px-4 py-2 rounded-md text-xs font-medium hover:bg-orange-600 transition"
              >
                Change Picture
              </button>
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        <div className="space-y-6">
          {/* Email */}
          <div>
            <label 
            htmlFor="email"
            className="block text-sm font-medium text-gray-600 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              disabled={!isEditing}
              onChange={handleChange}
              className={`w-full h-[48px] border ${
                isEditing ? "border-orange-400" : "border-gray-300"
              } rounded-lg px-3 py-2 focus:outline-none ${
                isEditing && "focus:ring-2 focus:ring-orange-400"
              }`}
            />
          </div>
          {/* Username */}
          <div>
            <label 
            htmlFor="username"
            className="block text-sm font-medium text-gray-600 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              disabled={!isEditing}
              onChange={handleChange}
              className={`w-full h-[48px] border ${
                isEditing ? "border-orange-400" : "border-gray-300"
              } rounded-lg px-3 py-2 focus:outline-none ${
                isEditing && "focus:ring-2 focus:ring-orange-400"
              }`}
            />
          </div>
          {/* Status */}
          <div>
            <label
            htmlFor="status"
            className="block text-sm font-medium text-gray-600 mb-2">
              Status
            </label>
            <input
              type="text"
              name="status"
              value={formData.status}
              disabled={!isEditing}
              onChange={handleChange}
              className={`w-full h-[48px] border ${
                isEditing ? "border-orange-400" : "border-gray-300"
              } rounded-lg px-3 py-2 focus:outline-none ${
                isEditing && "focus:ring-2 focus:ring-orange-400"
              }`}
            />
          </div>
          {/* Language */}
          <div>
            <label
            htmlFor="language"
            className="block text-sm font-medium text-gray-600 mb-2">
              Language
            </label>
            <select
              name="language"
              value={formData.language}
              disabled={!isEditing}
              onChange={handleChange}
              className={`w-full h-[48px] border ${
                isEditing ? "border-orange-400" : "border-gray-300"
              } rounded-lg px-3 py-2 bg-white focus:outline-none ${
                isEditing && "focus:ring-2 focus:ring-orange-400"
              }`}
            >
              <option>English</option>
              <option>Indonesia</option>
            </select>
          </div>
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              disabled={!isEditing}
              onChange={handleChange}
              className={`w-full h-[48px] border ${
                isEditing ? "border-orange-400" : "border-gray-300"
              } rounded-lg px-3 py-2 focus:outline-none ${
                isEditing && "focus:ring-2 focus:ring-orange-400"
              }`}
            />
          </div>
        </div>

        <div className="flex justify-start mt-8">
          <button
            onClick={handleToggleEdit}
            className="px-6 py-3 w-[133px] h-[48px] font-semibold rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors duration-300"
          >
            {isEditing ? "Save Changes" : "Edit"}
          </button>
        </div>
      </div>
    </div>
  );
}
