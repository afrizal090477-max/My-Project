import React, { useState, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./pagesAdmin/Login";
import RoomReservation from "./pagesUser/RoomReservation";
import Dashboard from "./pagesAdmin/Dashboard";
// ...import halaman lain yang dibutuhkan

// AuthContext untuk state login & role, bisa diganti ke JWT di backend nanti
const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

// ====== DUMMY AUTH PROVIDER ======
function AuthProvider({ children }) {
  // Dummy: role = "user" | "admin" | null
  const [role, setRole] = useState(null);

  // Dummy login function (replace with backend call)
  // password param tetap dipertahankan, siap diganti isi logic ke backend/JWT!
const login = (username, password) => { // eslint-disable-line no-unused-vars
  // Nanti tinggal tambahkan: call API, validasi, setRole dari response, dst

  if (username === "admin@email.com") {
    setRole("admin");
    return true;
  }
  setRole("user");
  return true;
};


  // Dummy logout
  const logout = () => setRole(null);

  // Auth object yang akan digantikan dengan real JWT ketika backend jadi
  const value = { role, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ====== PROTECTED ROUTES ======
function RequireAuth({ allowedRoles }) {
  const { role } = useAuth();
  if (!role) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }
  if (!allowedRoles.includes(role)) {
    // Forbidden
    return <Navigate to="/forbidden" replace />;
  }
  return <Outlet />; // Render child routes
}

// ====== MAIN ROUTER SETUP ======
export default function AppRouter() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* User Route (hanya untuk role "user") */}
          <Route element={<RequireAuth allowedRoles={["user"]} />}>
            <Route path="/user/room-reservation" element={<RoomReservation />} />
            {/* ...tambahkan halaman khusus user lain */}
          </Route>

          {/* Admin Route (hanya untuk role "admin") */}
          <Route element={<RequireAuth allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            {/* ...tambahkan halaman khusus admin lain */}
          </Route>

          {/* DUMMY Forbidden Page */}
          <Route path="/forbidden" element={<div>Access Forbidden</div>} />

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}
