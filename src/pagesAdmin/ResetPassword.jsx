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
      // Simulasi proses reset sukses
      setTimeout(() => {
        setLoading(false);
        setMessage({
          type: "success",
          text: "Permintaan reset password berhasil! Silakan cek email Anda.",
        });
        setTimeout(() => {
          navigate("/new-password");
        }, 1600);
      }, 1200);
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
    <div className="relative min-h-screen w-full overflow-hidden">
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
            <Logo />
            <h2 className="w-full mt-3 font-bold text-[32px] text-center">
              Reset Password
            </h2>
            <p className="w-full text-[15px] text-gray-500 text-center mt-1">
              Please enter your registered email here!
            </p>
          </div>

          <div className="w-full max-w-[400px] flex flex-col items-start mb-5">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316] bg-gray-50"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full max-w-[400px] h-[48px] bg-[#FF7316] hover:bg-[#e96d14] text-white font-semibold py-3 rounded-lg transition mb-3"
          >
            {loading ? "Memproses ..." : "Submit"}
          </button>
          {message.text && (
            <div
              className={`mt-1 w-full text-center text-sm font-medium ${
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
