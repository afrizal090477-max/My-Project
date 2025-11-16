import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { getToken, setToken, clearToken } from "../utils/storage";

// Konfigurasi baseURL ke Swagger endpoint backend produksi/dev
const apiHttp = axios.create({
  baseURL: "https://emiting-be.vercel.app", // Pastikan ini sesuai alamat backend API 
});

// Interceptor: tambahkan token Authorization jika ada untuk semua request
apiHttp.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor: jika response 401, hapus token dari storage (otomatis logout saat token invalid)
apiHttp.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
    }
    return Promise.reject(error);
  }
);

// Fungsi login
export const login = async (username, password) => {
  try {
    const response = await apiHttp.post("/api/v1/auth/login", { username, password });

    // Format hasil harus { status: "success", data: { token, user }, ... }
    // Pastikan backend mengirimkan respons seperti ini
    let token = null;

    if (response.data?.data && response.data.data.token) {
      token = response.data.data.token;
    } else if (response.data?.token) {
      // Fallback jika backend pakai data.token langsung di root response
      token = response.data.token;
    }

    if (response.data?.status !== "success" || !token) {
      throw new Error(response.data?.message || "Login gagal: token tidak valid dari backend");
    }

    setToken(token);
    const payload = jwtDecode(token);

    let role = "user";
    if (payload.is_admin || payload.role === "admin") role = "admin";
    if (payload.email === "admin@mail.com") role = "admin";
    if (payload.user_id === 1 || payload.user_id === "1") role = "admin";

    return { token, role, payload, user: response.data.data?.user || null };
  } catch (error) {
    throw new Error(error.response?.data?.message || error.message || "Login error");
  }
};

// Registrasi user ke endpoint backend
export const register = async (data) =>
  apiHttp.post("/api/v1/auth/register", data);

// Forgot password (endpoint sesuai backend)
export const forgotPassword = async (email) =>
  apiHttp.post("/api/v1/auth/forgot-password", { email });

export default apiHttp;
