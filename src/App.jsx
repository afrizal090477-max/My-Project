import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";  // TAMBAHAN: import useSelector
import ProtectedRoute from "./components/ProtectedRoute";


// Admin pages
import Dashboard from "./pagesAdmin/Dashboard";
import Reservation from "./pagesAdmin/Reservation";
import Room from "./pagesAdmin/Room";
import Report from "./pagesAdmin/Report";
import Setting from "./pagesAdmin/Setting";
import History from "./pagesAdmin/History";
import DashboardLayout from "./pagesAdmin/DashboardLayout";


// User pages
import DashboardUser from "./pagesUser/DashboardUser";
import RoomReservation from "./pagesUser/RoomReservation";
import UserHistory from "./pagesUser/UserHistory";
import UserSetting from "./pagesUser/UserSetting";
import DashboardLayoutUser from "./pagesUser/DashboardLayoutUser";


// Auth pages
import Login from "./pagesAdmin/Login";
import Register from "./pagesAdmin/Register";
import ResetPassword from "./pagesAdmin/ResetPassword";
import NewPassword from "./pagesAdmin/NewPassword";


export default function App() {
  // TAMBAHAN: Ambil token dan role dari Redux
  const { token, role } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Root route - redirect based on auth status */}
        <Route 
          path="/" 
          element={
            token ? (
              role === 'admin' ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/user/room-reservation" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />

        {/* Auth routes - redirect jika sudah login */}
        <Route 
          path="/login" 
          element={
            token ? (
              role === 'admin' ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/user/room-reservation" replace />
              )
            ) : (
              <Login />
            )
          } 
        />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/new-password" element={<NewPassword />} />


        {/* Admin routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/room" element={<Room />} />
          <Route path="/report" element={<Report />} />
          <Route path="/setting" element={<Setting />} />
          <Route path="/history" element={<History />} />
        </Route>


        {/* User routes */}
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayoutUser />
            </ProtectedRoute>
          }
        >
          <Route path="/user" element={<DashboardUser />} />
          <Route path="/user/room-reservation" element={<RoomReservation />} />
          <Route path="/user/history" element={<UserHistory />} />
          <Route path="/user/setting" element={<UserSetting />} />
        </Route>


        {/* Catch-all - redirect based on auth status */}
        <Route 
          path="*" 
          element={
            token ? (
              role === 'admin' ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/user/room-reservation" replace />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
