import React, { useState, useRef, useEffect } from "react";
import defaultPhoto from "../assets/home.png";
import { fetchProfile, updateProfile } from "../API/profileAPI";
import { useUserProfile } from "../context/UserProfileContext";

export default function UserSetting() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    role: "",
    status: "",
    language: "",
    password: "",
  });
  const [photo, setPhoto] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  // Ambil updater context, AGAR HEADER OTOMATIS UPDATE
  const { updateProfilePhoto } = useUserProfile();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await fetchProfile();
        setFormData({
          email: data.email || "",
          username: data.username || "",
          role: data.role || "",
          status: data.status || "",
          language: data.language || "",
          password: "********",
        });
        setPhoto(data.photo_url || data.photo || "");
      } catch {
        alert("Gagal memuat profil user!");
      }
      setLoading(false);
    };
    loadProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Patch penting: update context SETELAH update berhasil
  const handleToggleEdit = async () => {
    if (isEditing) {
      try {
        const fd = new FormData();
        fd.append("email", formData.email);
        fd.append("username", formData.username);
        fd.append("role", formData.role);
        fd.append("status", formData.status);
        fd.append("language", formData.language);
        if (formData.password && formData.password !== "********") {
          fd.append("password", formData.password);
        }
        if (photoFile) {
          fd.append("photo", photoFile);
        }
        const updated = await updateProfile(fd);
        if (updated?.photo_url) {
          setPhoto(updated.photo_url);               // preview lokal di Setting
          updateProfilePhoto(updated.photo_url);     // ini agar Header ikut berubah
        }
        setPhotoFile(null);
        alert("Perubahan profil berhasil disimpan!");
      } catch {
        alert("Gagal menyimpan perubahan profil.");
      }
    }
    setIsEditing((prev) => !prev);
  };

  const handleChangePicture = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhotoFile(file);
    setPhoto(URL.createObjectURL(file)); // preview segera
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-[1320px] mx-auto bg-white shadow-md p-8 rounded-xl">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">My Account</h2>
        <div className="flex items-center gap-4 mb-8">
          <img
            src={photo || defaultPhoto}
            alt="User"
            className="w-16 h-16 rounded-full object-cover"
          />
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

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-2">
                Email
              </label>
              <input
                id="email"
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
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-600 mb-2">
                Username
              </label>
              <input
                id="username"
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
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-600 mb-2">
                Role
              </label>
              {isEditing ? (
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full h-[48px] border border-orange-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option>User</option>
                  <option>Admin</option>
                </select>
              ) : (
                <div className="w-full h-[48px] border border-gray-300 rounded-lg px-3 py-2 flex items-center bg-gray-50 text-gray-600">
                  {formData.role}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-600 mb-2">
                Status
              </label>
              <input
                id="status"
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
            <div>
              <label htmlFor="language" className="block text-sm font-medium text-gray-600 mb-2">
                Language
              </label>
              {isEditing ? (
                <select
                  id="language"
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full h-[48px] border border-orange-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option>English</option>
                  <option>Indonesia</option>
                </select>
              ) : (
                <div className="w-full h-[48px] border border-gray-300 rounded-lg px-3 py-2 flex items-center bg-gray-50 text-gray-600">
                  {formData.language}
                </div>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              disabled={!isEditing}
              onChange={handleChange}
              className={`w-full max-w-[410px] h-[48px] border ${
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
