import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "../components/Logo";
import { resetPassword } from "../API/authAPI";

export default function NewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const otp = query.get("otp");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (!newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Semua field wajib diisi." });
      return;
    }
    if (newPassword.length < 6) {
      setMessage({ type: "error", text: "Password minimal 6 karakter." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Password tidak cocok." });
      return;
    }
    if (!otp) {
      setMessage({ type: "error", text: "OTP tidak ditemukan di URL." });
      return;
    }
    setLoading(true);
    try {
      const data = await resetPassword(otp, newPassword, confirmPassword);
      setMessage({
        type: "success",
        text: data.message || "Password berhasil direset. Silakan login.",
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Gagal reset password.",
      });
    }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center justify-center"
      style={{
        backgroundImage: "url('/meeting.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      <div className="absolute inset-0 bg-black/35" />
      <div
        className="relative bg-white rounded-[20px] shadow-2xl border-4 border-[#E7E7E7] flex flex-col items-center"
        style={{
          width: 600,
          maxWidth: "96vw",
          minHeight: 480,
          zIndex: 10,
          padding: 48,
        }}
      >
        <Logo />
        <h2 className="font-bold text-[32px] w-full text-center mt-3">
          Set New Password
        </h2>
        <p className="text-gray-500 text-center text-base mb-7 w-full">
          Please enter your new password and confirm
        </p>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-3">
            <label htmlFor="newPassword" className="block mb-2 text-gray-700 text-[15px] font-medium">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-[#fafafa] placeholder:text-gray-400 focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316] focus:outline-none"
              disabled={loading}
            />
          </div>
          <div className="mb-2">
            <label htmlFor="confirmPassword" className="block mb-2 text-gray-700 text-[15px] font-medium">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-[#fafafa] placeholder:text-gray-400 focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316] focus:outline-none"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full h-12 bg-[#FF7316] hover:bg-[#e96d14] text-white font-semibold rounded-lg shadow-md transition text-base disabled:bg-gray-400 disabled:cursor-not-allowed mt-5"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Reset Password"}
          </button>
          {message.text && (
            <div
              className={`w-full py-2 text-center text-sm font-medium ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
            >
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
