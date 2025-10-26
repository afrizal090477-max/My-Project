import React, { useState, useRef, useEffect } from "react";
import defaultPhoto from "../assets/home.png"; // ganti sesuai nama file kamu

export default function Setting() {
  // 🔸 Inisialisasi state
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "johndoe@gmail.com",
    username: "John Doe",
    role: "User",
    status: "Active",
    language: "English",
    password: "********",
  });

  // 🔹 State untuk foto profil dan input file ref
  const [photo, setPhoto] = useState(defaultPhoto);
  const fileInputRef = useRef(null);

  // 🔹 Load foto dari localStorage (jika sudah pernah diganti)
  useEffect(() => {
    const savedPhoto = localStorage.getItem("userPhoto");
    if (savedPhoto) {
      setPhoto(savedPhoto);
    }
  }, []);

  // 🔹 Simpan foto ke localStorage saat berubah
  useEffect(() => {
    localStorage.setItem("userPhoto", photo);
  }, [photo]);

  // 🔹 Fungsi umum untuk input field
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔹 Ganti mode Edit/Save
  const handleToggleEdit = () => {
    if (isEditing) {
      alert("✅ Changes saved successfully!");
    }
    setIsEditing(!isEditing);
  };

  // 🔹 Klik tombol Change Picture → buka file dialog
  const handleChangePicture = () => {
    fileInputRef.current.click();
  };

  // 🔹 Saat user memilih file gambar
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="w-[1320px] h-[622px] top-[100px] left-[100px] bg-white  shadow-md p-8 ">
        <h2 className="text-xl font-semibold text-gray-700">My Account</h2>
        {/* My Account Section */}
        <div className="flex items-center gap-4 mb-8">
          <img
            src={photo}
            alt="User"
            className="w-[100px] h-[100px] rounded-full object-cover border-2 border-orange-400"
          />
          <div>
            {/* Tombol Change Picture hanya muncul saat mode edit */}
            {isEditing && (
              <>
                <button
                  onClick={handleChangePicture}
                  className="mt-2 w-[106px] h-[34px] bg-orange-500 text-white px-4 py-2 rounded-md !text-xs font-medium hover:bg-orange-600 transition"
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
              </>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Row 1: Email - Username - Role */}
          <div className="grid grid-cols-1 md:grid-cols-3 w-[1270px] h-[74px] gap-[20px]">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                disabled={!isEditing}
                onChange={handleChange}
                className={`w-[410px] h-[48px] border ${
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
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                name="username"
                value={formData.username}
                disabled={!isEditing}
                onChange={handleChange}
                className={`w-[410px] h-[48px] border ${
                  isEditing ? "border-orange-400" : "border-gray-300"
                } rounded-lg px-3 py-2 focus:outline-none ${
                  isEditing && "focus:ring-2 focus:ring-orange-400"
                }`}
              />
            </div>

            {/* Role */}
            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Role
              </label>
              {isEditing ? (
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-[410px] h-[48px] border border-orange-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option>User</option>
                </select>
              ) : (
                <p className="w-[410px] h-[48px] border border-gray-300 rounded-lg px-3 py-2 text-gray-700 bg-gray-50">
                  {formData.role}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Status - Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 w-[840px] h-[74px] gap-[20px] ">
            {/* Status */}
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Status
              </label>
              <input
                id="status"
                type="text"
                name="status"
                value={formData.status}
                disabled={!isEditing}
                onChange={handleChange}
                className={`w-[410px] h-[48px] border ${
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
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Language
              </label>
              <select
                id="language"
                name="language"
                value={formData.language}
                disabled={!isEditing}
                onChange={handleChange}
                className={`w-[410px] h-[48px] border ${
                  isEditing ? "border-orange-400" : "border-gray-300"
                } rounded-lg px-3 py-2 bg-white focus:outline-none ${
                  isEditing && "focus:ring-2 focus:ring-orange-400"
                }`}
              >
                <option>English</option>
                <option>Indonesia</option>
              </select>
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600 mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              disabled={!isEditing}
              onChange={handleChange}
              className={`w-[410px] h-[48px] border ${
                isEditing ? "border-orange-400" : "border-gray-300"
              } rounded-lg px-3 py-2 focus:outline-none ${
                isEditing && "focus:ring-2 focus:ring-orange-400"
              }`}
            />
          </div>
        </div>

        {/* Tombol Simpan / Edit */}
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
