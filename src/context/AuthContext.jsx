// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import axiosInstance from "../API/http"; // Pastikan path ini benar
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const loginUser = useCallback(async ({ username, password }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post("/login", { username: username.trim(), password: password.trim() });
      const { token, role } = response.data.data;

      if (!token) {
        throw new Error("Token tidak ditemukan di response!");
      }

      let decoded;
      try {
        decoded = jwtDecode(token);
      } catch {
        throw new Error("Token JWT tidak valid!");
      }
      const _role = role ? role : (decoded.role ? decoded.role : (decoded.is_admin ? "admin" : "user"));

      setToken(token);
      setRole(_role);

      // SIMPAN di localStorage AGAR PERSIST
      localStorage.setItem("token", token);
      localStorage.setItem("role", _role);
      localStorage.setItem("user", JSON.stringify({ username, role: _role }));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setRole(null);
    setError(null);
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
  }, []);

  useEffect(() => {
    // Restore session dari localStorage
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    if (savedToken && savedRole) {
      setToken(savedToken);
      setRole(savedRole);
    }
  }, []);

  const value = useMemo(() => ({
    token, role, error, loading, loginUser, logout
  }), [token, role, error, loading, loginUser, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
