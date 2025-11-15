import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../API/authAPI";
import Logo from "../components/Logo";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (
      !form.username ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setMessage({ type: "error", text: "Semua field wajib diisi." });
      return;
    }
    if (form.password.length < 6) {
      setMessage({ type: "error", text: "Password harus minimal 6 karakter." });
      return;
    }
    if (form.password !== form.confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi password tidak cocok." });
      return;
    }

    setLoading(true);
    try {
      const data = await register({
        username: form.username,
        email: form.email,
        password: form.password,
      });
      setMessage({
        type: "success",
        text: data.message || "Registrasi berhasil!",
      });
      setTimeout(() => navigate("/login"), 1300);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Registrasi gagal.",
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
        className="relative bg-white rounded-[20px] shadow-2xl border-4 border-[#E7E7E7] flex flex-col items-center w-[600px] max-w-full"
        style={{
          minHeight: 815,
          zIndex: 10,
          padding: 48,
        }}
      >
        <div className="flex flex-col items-center gap-3 mb-3 mt-5">
          <Logo />
        </div>
        <h2 className="font-bold text-[32px] text-center w-full mt-1 mb-1">
          Welcome Back!
        </h2>
        <p className="text-gray-500 text-center text-base mb-7 w-full">
          Create your account here!
        </p>

        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-3">
            <label htmlFor="username" className="block mb-2 text-gray-700 text-[15px] font-medium">
              Username
            </label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-[#fafafa] placeholder:text-gray-400 focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316] focus:outline-none"
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="email" className="block mb-2 text-gray-700 text-[15px] font-medium">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-[#fafafa] placeholder:text-gray-400 focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316] focus:outline-none"
              disabled={loading}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="block mb-2 text-gray-700 text-[15px] font-medium">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-[#fafafa] placeholder:text-gray-400 focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316] focus:outline-none"
              disabled={loading}
            />
          </div>
          <div className="mb-1">
            <label htmlFor="confirmPassword" className="block mb-2 text-gray-700 text-[15px] font-medium">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              className="w-full h-12 px-4 border border-gray-300 rounded-lg bg-[#fafafa] placeholder:text-gray-400 focus:ring-2 focus:ring-[#FF7316] focus:border-[#FF7316] focus:outline-none"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            className="w-full h-12 bg-[#FF7316] hover:bg-[#e96d14] text-white text-base font-semibold rounded-lg mt-5 mb-1 shadow-md transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? "Registering..." : "Create Account"}
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
        <p className="text-gray-500 text-center text-sm mt-4 mb-0 w-full">
          Already have an account?{" "}
          <span
            className="text-[#FF7316] font-semibold cursor-pointer hover:underline"
            onClick={() => navigate("/login")}
            tabIndex={0}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
