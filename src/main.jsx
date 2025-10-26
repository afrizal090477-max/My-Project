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
import DashboardLayoutUser from "@/pagesUser/DashboardLayoutUser";
import DashboardUser from "@/pagesUser/DashboardUser";
import RoomReservation from "@/pagesUser/RoomReservation";
import UserHistory from "@/pagesUser/UserHistory";
import UserSetting from "@/pagesUser/UserSetting";
import { PageTitleProvider } from "@/context/PageTitleContext";

const router = createBrowserRouter([
  // === AUTH & PUBLIC ROUTES ===
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "/reset-password", element: <ResetPassword /> },
  { path: "/new-password", element: <NewPassword /> },

  // === ADMIN DASHBOARD & MENUS ===
  {
    path: "/",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> }, // /
      { path: "dashboard", element: <Dashboard /> },
      { path: "reservation", element: <Reservation /> },
      { path: "room", element: <Room /> },
      { path: "report", element: <Report /> },
      { path: "settings", element: <Setting /> },
      { path: "history", element: <History /> },
    ],
  },

  // === USER DASHBOARD & MENUS ===
  {
    path: "/user",
    element: <DashboardLayoutUser />,
    children: [
      { index: true, element: <DashboardUser /> },
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
