import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import ResetPassword from "@/pagesAdmin/ResetPassword";
import NewPassword from "@/pagesAdmin/NewPassword";
import Login from "@/pagesAdmin/Login";
import Register from "@/pagesAdmin/Register";
import DashboardLayout from "@/pagesAdmin/DashboardLayout";
import Dashboard from "@/pagesAdmin/Dashboard";
import Reservation from "@/pagesAdmin/Reservation";
import Room from "@/pagesAdmin/Room";
import Report from "@/pagesAdmin/Report";
import Setting from "@/pagesAdmin/Setting";
import History from "@/pagesAdmin/History";
import PrivateRoute from "@/utils/PrivateRoute";
import { PageTitleProvider } from "@/context/PageTitleContext";
import LoginUser from "@/pagesUser/LoginUser";
import RegisterUser from "@/pagesUser/RegisterUser";
import ResetPasswordUser from "@/pagesUser/ResetPasswordUser";
import RoomReservation from "@/pagesUser/RoomReservation";
import UserHistory from "@/pagesUser/UserHistory";
import UserSetting from "@/pagesUser/UserSetting";
import DashboardLayoutUser from "@/pagesUser/DashboardLayoutUser";
import DashboardUser from "@/pagesUser/DashboardUser";

// Router definition
const router = createBrowserRouter([
  // AUTH & PUBLIC ROUTES
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/new-password", element: <NewPassword /> },
  { path: "/loginUser", element: <LoginUser /> },
  { path: "/registerUser", element: <RegisterUser /> },
  { path: "/reset-passwordUser", element: <ResetPasswordUser /> },

  // ADMIN DASHBOARD & MENUS
  {
    path: "/",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Dashboard /> },                  // /
      { path: "dashboard", element: <Dashboard /> },
      { path: "reservation", element: <Reservation /> },
      { path: "room", element: <Room /> },
      { path: "report", element: <Report /> },
      { path: "settings", element: <Setting /> },
      { path: "history", element: <History /> },                // (optional, if admin has history)
    ],
  },

  // USER DASHBOARD & MENUS
  {
    path: "/user",
    element: <DashboardLayoutUser />,
    children: [
      { index: true, element: <DashboardUser /> },              // /user
      { path: "room-reservation", element: <RoomReservation /> },
      { path: "history", element: <UserHistory /> },
      { path: "setting", element: <UserSetting /> },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <PageTitleProvider>
      <RouterProvider router={router} />
    </PageTitleProvider>
  </StrictMode>
);
