import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function NewPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  // Validasi sederhana password minimal 6 karakter
  const validatePassword = (pass) => pass.length >= 6;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Semua field wajib diisi." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Password dan konfirmasi harus sama." });
      return;
    }
    if (!validatePassword(newPassword)) {
      setMessage({ type: "error", text: "Password minimal 6 karakter." });
      return;
    }

    setLoading(true);

    try {
      // Simulasi request sukses
      setTimeout(() => {
        setLoading(false);
        setMessage({
          type: "success",
          text: "Password baru berhasil dibuat. Silakan login kembali!",
        });
        // Optional: redirect ke login setelah beberapa detik
        setTimeout(() => {
          navigate("/login");
        }, 1600);
      }, 1200);

      // Jika pakai API backend, ganti dengan request di sini
      // const response = await fetch(...);
      // if (response.ok) { ... } else { setMessage({type: "error", text: "..."}); }
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-[20px] p-10 shadow-lg w-[380px] flex flex-col items-center">
        <div className="w-[50px] h-[50px] rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold text-lg mb-2">
          E
        </div>
        <span className="text-[18px] font-semibold bg-gradient-to-r from-orange-500 to-yellow-500 bg-clip-text text-transparent mb-4">
          E-Meeting
        </span>
        <h2 className="font-bold text-[28px] mb-2 text-center">Set New Password</h2>
        <p className="text-[13px] text-gray-500 mb-5 text-center">
          Masukkan password baru dan konfirmasi di bawah.
        </p>
        <form onSubmit={handleSubmit} className="w-full flex flex-col">
          <input
            type="password"
            placeholder="New password"
            className="block w-full px-4 py-3 mb-4 border border-gray-200 rounded-lg bg-gray-50"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm new password"
            className="block w-full px-4 py-3 mb-4 border border-gray-200 rounded-lg bg-gray-50"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#FF7316] hover:bg-[#e96d14] text-white font-semibold py-3 rounded-lg transition"
          >
            {loading ? "Memproses..." : "Reset Password"}
          </button>
          {message.text && (
            <div
              className={`mt-3 text-center font-medium ${
                message.type === "success"
                  ? "text-green-600"
                  : "text-red-600"
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
