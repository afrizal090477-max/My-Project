import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

export default function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    if (!email || !otp) {
      setMessage({ type: "error", text: "Email dan OTP wajib diisi." });
      return;
    }
    setLoading(true);
    // Di versi ini, langsung redirect ke new password setelah input OTP & email
    navigate(`/new-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`);
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen w-full flex items-center left-[120px]"
      style={{
        backgroundImage: "url('/meeting.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
      }}
    >
      
      <div
        className="relative bg-white rounded-[20px] shadow-2xl border-4 border-[#E7E7E7] flex flex-col items-center"
        style={{
          width: 600,
          height: 644,
          maxWidth: "96vw",
          maxHeight: "96vh",
          zIndex: 10,
          padding: 48,
        }}
      >
        <div className="flex flex-col items-center mb-7">
          <Logo />
          <h2 className="font-bold text-[32px] w-full text-center mt-3">
            Reset Password
          </h2>
          <p className="text-[15px] text-gray-500 w-full text-center mt-1 mb-3">
            Masukkan email terdaftar & OTP yang dikirim ke email kamu.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="w-full flex flex-col items-center ">
          <div className="mb-3">
            <label htmlFor="email" className="block mb-2 text-gray-700 text-[15px] font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              className="w-[380px] h-12 px-4 border border-gray-300 rounded-lg bg-[#fafafa] placeholder:text-gray-400 focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316] focus:outline-none"
              disabled={loading}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="otp" className="block mb-2 text-gray-700 text-[15px] font-medium">
              OTP (dari email)
            </label>
            <input
              type="text"
              id="otp"
              placeholder="Kode OTP email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              autoComplete="one-time-code"
              className="w-[380px] h-12 px-4 border border-gray-300 rounded-lg bg-[#fafafa] placeholder:text-gray-400 focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316] focus:outline-none"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-[380px] h-12 bg-[#FF7316] hover:bg-[#e96d14] text-white font-semibold rounded-lg shadow-md transition text-base disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Submit OTP"}
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
