import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pagesAdmin/Dashboard";
import Reservation from "./pagesAdmin/Reservation";
import Room from "./pagesAdmin/Room";
import Report from "./pagesAdmin/Report";
import Setting from "./pagesAdmin/Setting";
import Login from "./pagesAdmin/Login";
import Register from "./pagesAdmin/Register";
import ResetPassword from './pagesAdmin/ResetPassword';
import NewPassword from './pagesAdmin/NewPassword';
import History from "./pagesAdmin/History";
import RoomReservation from "./pagesUser/RoomReservation";
import DashboardUser from "./pagesUser/DashboardUser";
import UserHistory from "./pagesUser/UserHistory";
import UserSetting from "./pagesUser/UserSetting";
import DashboardLayout from "./pagesAdmin/DashboardLayout";
import DashboardLayoutUser from "./pagesUser/DashboardLayoutUser";

function App() {
  return (
    <Router>
      <Routes>
        {/* AUTH */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password" element={<NewPassword />} />

        {/* ADMIN - dengan layout */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]}><DashboardLayout /></ProtectedRoute>}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/room" element={<Room />} />
          <Route path="/report" element={<Report />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/history" element={<History />} />
        </Route>

        {/* USER - dengan layout */}
        <Route element={<ProtectedRoute allowedRoles={["user"]}><DashboardLayoutUser /></ProtectedRoute>}>
          <Route path="/user" element={<DashboardUser />} />
          <Route path="/user/room-reservation" element={<RoomReservation />} />
          <Route path="/user/history" element={<UserHistory />} />
          <Route path="/user/setting" element={<UserSetting />} />
        </Route>

        {/* HALAMAN AKSES DITOLAK */}
        <Route path="/forbidden" element={
          <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#e53935", fontWeight: 700 }}>
            Access Forbidden
          </div>
        } />

        {/* CATCH ALL */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
