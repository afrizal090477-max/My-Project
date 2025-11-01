import axios from "axios";
import { getToken } from "../utils/storage";

const instance = axios.create({
  baseURL: "https://your-api-server.com/api", // ganti sesuai endpoint backend
});

// Set token di setiap request jika ada
instance.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
