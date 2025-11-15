// AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { decodeToken } from "../utils/jwt";
import { getToken, clearToken, setToken as saveToken } from "../utils/storage";
import { login as loginApi } from "../API/http";

export const AuthContext = createContext();

function mapRoleFromPayload(payload) {
  if (!payload) return "user";
  if (payload.is_admin === true) return "admin";
  if (payload.role) return payload.role;
  if (payload.email === "admin@mail.com") return "admin";
  if (payload.user_id === 1 || payload.user_id === "1") return "admin";
  return "user";
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setTokenState] = useState(getToken());
  const [role, setRole] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      const payload = decodeToken(token);
      const mappedRole = mapRoleFromPayload(payload);
      setRole(mappedRole);
      setUser({ token, role: mappedRole, ...payload });
    } else {
      setRole(null);
      setUser(null);
    }
  }, [token]);

  const handleLogin = async ({ username, password }) => {
    setError("");
    setLoading(true);
    try {
      const { token: newToken, role: mappedRole, payload } = await loginApi(username, password);

      if (!newToken) throw new Error("Token tidak ditemukan pada response API");

      saveToken(newToken);
      setTokenState(newToken);
      setRole(mappedRole || mapRoleFromPayload(payload));
      setUser({ token: newToken, role: mappedRole || mapRoleFromPayload(payload), ...payload });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Login gagal");
      clearToken();
      setTokenState(null);
      setRole(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    clearToken();
    setTokenState(null);
    setRole(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, role, error, loading, handleLogin, handleLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

