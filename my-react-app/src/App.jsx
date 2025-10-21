import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardLayout from "./components/DashboardLayout";
import Dashboard from "./pagesAdmin/Dashboard";
import Reservation from "./pagesAdmin/Reservation";
import Rooms from "./pagesAdmin/Rooms";
import Report from "./pagesAdmin/Report";
import Setting from "./pagesAdmin/Setting";
import Login from "@/pagesAdmin/Login";
import Register from "@/pagesAdmin/Register";

function App() {
  return (
    <Router>
      <Routes>
        {/* Login & Register */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/reservation" element={<Reservation />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/report" element={<Report />} />
          <Route path="/setting" element={<Setting />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
