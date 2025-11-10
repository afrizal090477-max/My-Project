import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Eager load (langsung import): komponen penting yang sering dipakai
import Login from "./pagesAdmin/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Lazy load (kode split): komponen yang jarang diakses, menghemat load time awal
const DashboardLayout = lazy(() => import("./pagesAdmin/DashboardLayout"));
const DashboardLayoutUser = lazy(() => import("./pagesUser/DashboardLayoutUser"));
const Dashboard = lazy(() => import("./pagesAdmin/Dashboard"));
const Reservation = lazy(() => import("./pagesAdmin/Reservation"));
const Room = lazy(() => import("./pagesAdmin/Room"));
const Report = lazy(() => import("./pagesAdmin/Report"));
const Setting = lazy(() => import("./pagesAdmin/Setting"));
const History = lazy(() => import("./pagesAdmin/History"));
const RoomReservation = lazy(() => import("./pagesUser/RoomReservation"));
const UserHistory = lazy(() => import("./pagesUser/UserHistory"));
const UserSetting = lazy(() => import("./pagesUser/UserSetting"));
const Register = lazy(() => import("./pagesAdmin/Register"));
const ResetPassword = lazy(() => import("./pagesAdmin/ResetPassword"));
const NewPassword = lazy(() => import("./pagesAdmin/NewPassword"));

function App() {
  const { token, role, restoreSession } = useAuth();

  // Restore token & role dari localStorage saat pertama kali App dijalankan
  useEffect(() => {
    restoreSession?.();
  }, [restoreSession]);

  return (
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}>
          <div>Loading...</div>
        </div>
      }
    >
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            token ? (
              role === "admin"
                ? <Navigate to="/dashboard" replace />
                : <Navigate to="/user/room-reservation" replace />
            ) : <Login />
          }
        />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password" element={<NewPassword />} />

        {/* Admin Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="reservation" element={<Reservation />} />
          <Route path="room" element={<Room />} />
          <Route path="report" element={<Report />} />
          <Route path="setting" element={<Setting />} />
          <Route path="history" element={<History />} />
        </Route>

        {/* User Routes */}
        <Route
          path="/user"
          element={
            <ProtectedRoute>
              <DashboardLayoutUser />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/user/room-reservation" replace />} />
          <Route path="room-reservation" element={<RoomReservation />} />
          <Route path="history" element={<UserHistory />} />
          <Route path="setting" element={<UserSetting />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
