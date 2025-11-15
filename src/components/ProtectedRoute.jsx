import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, role: requiredRole }) => {
  const { token, role } = useAuth();
  const location = useLocation();

  if (!token) {
    // Belum login, redirect login dengan status kembali ke halaman ini
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Role tidak sesuai, redirect page unauthorized atau login
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
