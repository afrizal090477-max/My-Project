import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const validatePassword = (pass) => pass.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Semua field wajib diisi." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({
        type: "error",
        text: "Password dan konfirmasi harus sama.",
      });
      return;
    }
    if (!validatePassword(newPassword)) {
      setMessage({ type: "error", text: "Password minimal 6 karakter." });
      return;
    }

    setLoading(true);

    try {
      setTimeout(() => {
        setLoading(false);
        setMessage({
          type: "success",
          text: "Password baru berhasil dibuat. Silakan login kembali!",
        });
        setTimeout(() => {
          navigate("/login");
        }, 1600);
      }, 1200);
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Gagal membuat password baru. Silakan coba lagi.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full  overflow-hidden">
      <img
        src="/meeting.png"
        alt="meeting"
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
        style={{ minWidth: 1536, minHeight: 1024 }}
      />
      <div className="absolute inset-0 bg-black/40 z-10"></div>

      <div className="relative z-20 min-h-screen w-full">
        <form
          onSubmit={handleSubmit}
          className="absolute bg-white rounded-[20px] shadow-xl border border-gray-200 flex flex-col items-center"
          style={{
            left: 120,
            top: "50%",
            transform: "translateY(-50%)",
            width: 600,
            height: 644,
            maxWidth: "calc(100vw - 140px)",
            maxHeight: "96vh",
            padding: 48,
          }}
          autoComplete="off"
        >
          <div className="flex flex-col items-center justify-center w-full mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-r from-orange-500 to-yellow-400 flex items-center justify-center text-white font-bold text-xl shadow">
                E
              </div>
              <span className="text-[22px] font-bold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent select-none">
                E-Meeting
              </span>
            </div>
            <h2 className="font-bold text-[32px] mb-2 text-center w-full">
              Set New Password
            </h2>
            <p className="text-[13px] text-gray-500 text-center mb-2 w-full">
              Masukkan password baru dan konfirmasi di bawah.
            </p>
          </div>

          <div className="w-full max-w-[400px] flex flex-col items-start mb-4">
            <label
              htmlFor="newPassword"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              placeholder="New password"
              className="block w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

          <div className="w-full max-w-[400px] flex flex-col items-start mb-4">
            <label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm new password"
              className="block w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full max-w-[400px] h-[48px] bg-[#FF7316] hover:bg-[#e96d14] text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Memproses..." : "Reset Password"}
          </button>
          {message.text && (
            <div
              className={`mt-3 text-center font-medium w-full ${
                message.type === "success" ? "text-green-600" : "text-red-600"
              }`}
              role={message.type === "success" ? "status" : "alert"}
            >
              {message.text}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
