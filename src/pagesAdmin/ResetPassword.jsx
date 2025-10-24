import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo"; // ganti path jika perlu

export default function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const validateEmail = (email) =>
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!email) {
      setMessage({ type: "error", text: "Email wajib diisi." });
      return;
    }
    if (!validateEmail(email)) {
      setMessage({ type: "error", text: "Format email tidak valid." });
      return;
    }
    setLoading(true);

    try {
      // Simulasi request sukses: email ditemukan, email reset terkirim
      setTimeout(() => {
        setLoading(false);
        setMessage({
          type: "success",
          text: "Permintaan reset password berhasil! Silakan cek email Anda.",
        });
        // Redirect ke 'new password' setelah beberapa detik
        setTimeout(() => {
          navigate("/new-password");
        }, 1500);
      }, 1200);

      // Jika sudah terhubung ke backend:
      // const response = await fetch(API_ENDPOINT, { ... });
      // if (response.ok) { ...navigate("/new-password") }
      // else { setMessage({ type: "error", text: "Email tidak ditemukan..." }) }
    } catch (error) {
      console.error(error);
      setMessage({
        type: "error",
        text: "Terjadi kesalahan koneksi. Silakan coba lagi.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 relative">
      <div className="absolute inset-0 z-0">
        {/* Ganti src background jika ingin yang lain */}
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1500&q=80"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white rounded-[20px] shadow-xl p-12 w-[380px] flex flex-col items-center"
        autoComplete="off"
      >
        <Logo />
        <h2 className="mt-2 font-bold text-[28px] text-center">Reset Password</h2>
        <p className="text-[13px] text-gray-500 mb-7 text-center">
          Please enter your registered email here!
        </p>
        <input
          type="email"
          placeholder="Email"
          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316] mb-5 bg-gray-50"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF7316] hover:bg-[#e96d14] text-white font-semibold py-3 rounded-lg transition mb-3"
        >
          {loading ? "Memproses ..." : "Submit"}
        </button>
        {message.text && (
          <div
            className={`mt-1 w-full text-center text-sm font-medium ${
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
  );
}
