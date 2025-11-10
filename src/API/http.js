// src/API/http.js
import axios from "axios";
import { getToken, setToken, clearToken } from "../utils/storage";

// Instance untuk semua request lewat proxy Vite
const http = axios.create({
  baseURL: "/api/v1/auth",
});

// Inject Authorization token di setiap permintaan
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle error global (misal token expired)
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      // window.location = "/login"; jika ingin langsung logout
    }
    return Promise.reject(error);
  }
);

// Fungsi login sesuai spec swagger
export const login = async (username, password, navigate) => {
  const response = await http.post("/login", { username, password });
  const { token, role } = response.data; // sesuaikan property dengan response backend
  setToken(token);
  if (role === "admin") {
    navigate("/admin");
  } else if (role === "user") {
    navigate("/dashboard");
  } else {
    navigate("/"); // default fallback
  }
  return response.data; // kalau butuh data ke component
};




// Fungsi lupa password (sesuai spec swagger)
export const forgotPassword = async (email) => {
  // Sesuaikan payload dengan backend (misal {email})
  return http.post("/forgot-password", { email });
};

// Export default instance untuk kebutuhan custom
export default http;
