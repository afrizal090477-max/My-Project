import React, { useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../context/AuthContext";
import { fetchDashboardData } from "../API/dashboardAPI";

const Dashboard = () => {
  const { token } = useAuth();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [statSummary, setStatSummary] = useState({
    totalOmzet: 0,
    totalReservation: 0,
    totalVisitor: 0,
    totalRooms: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    if (!startDate || !endDate) {
      setError("Mohon pilih Start Date dan End Date terlebih dahulu!");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const apiData = await fetchDashboardData(
        startDate.toISOString().substring(0, 10),
        endDate.toISOString().substring(0, 10)
      );
      setRooms(apiData.rooms || []); // dari swagger: rooms/list data room
      setStatSummary({
        totalOmzet: apiData.total_omset || 0,
        totalReservation: apiData.total_reservation || 0,
        totalVisitor: apiData.total_visitor || 0,
        totalRooms: apiData.total_room || 0,
      });
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal fetch data dashboard / token expired");
      setRooms([]);
      setStatSummary({
        totalOmzet: 0,
        totalReservation: 0,
        totalVisitor: 0,
        totalRooms: 0,
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col w-[1320px] min-h-screen gap-[20px]">
      {/* FILTER */}
      <section className="w-full bg-white border border-gray-200 p-6 rounded-lg flex flex-wrap gap-6 items-end">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-gray-700 mb-1">
            Start Date
          </label>
          <div className="relative">
            <DatePicker
              id="start-date"
              selected={startDate}
              onChange={(date) => { setStartDate(date); setError(""); }}
              placeholderText="Select start date"
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 rounded-lg px-4 py-3 w-[515px] h-[48px] bg-white text-gray-900 cursor-pointer"
            />
            <FaCalendarAlt className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div>
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
            End Date
          </label>
          <div className="relative">
            <DatePicker
              id="end-date"
              selected={endDate}
              onChange={(date) => { setEndDate(date); setError(""); }}
              placeholderText="Select end date"
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 rounded-lg px-4 py-3 w-[515px] h-[48px] bg-white text-gray-900 cursor-pointer"
            />
            <FaCalendarAlt className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <button
          onClick={fetchDashboard}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white w-[170px] h-[48px] px-6 py-3 rounded-lg transition font-semibold"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </section>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-4">{error}</div>
      )}

      {/* STATISTIK */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Omzet", value: `Rp ${statSummary.totalOmzet.toLocaleString()}` },
          { label: "Total Reservation", value: statSummary.totalReservation },
          { label: "Total Visitor", value: statSummary.totalVisitor },
          { label: "Total Rooms", value: statSummary.totalRooms },
        ].map((stat) => (
          <div
            key={stat.label}
            className="w-full bg-white border border-gray-200 p-4 rounded-lg shadow-sm"
          >
            <p className="text-sm text-gray-700">{stat.label}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </section>

      {/* ROOMS & PERCENTAGE */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          <p className="text-center col-span-full py-10">Loading...</p>
        ) : rooms.length === 0 ? (
          <p className="text-gray-500 italic col-span-full text-center py-10">
            No rooms found for the selected date range.
          </p>
        ) : (
          rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white border border-gray-200 rounded-[10px] p-5 flex justify-between items-start shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col w-[145px] gap-[5px] mt-[20px] ml-[10px]">
                <p className="text-[16px] font-semibold text-gray-900">{room.name}</p>
                <p className="text-[12px] text-gray-400">Usage (%)</p>
                <p className="text-[16px] font-bold text-gray-900">{room.percentage}%</p>
                <p className="text-[12px] text-gray-400 mt-[4px]">Price per Hour</p>
                <p className="text-[16px] font-semibold text-gray-900">
                  {`Rp ${room.price_hour?.toLocaleString?.() ?? room.price_hour ?? 0}`}
                </p>
              </div>
              <div className="flex justify-center items-center mt-[40px] mr-[10px] w-[100px] h-[100px]">
                <CircularProgressbar
                  value={Number(room.percentage) || 0}
                  text={`${room.percentage || 0}%`}
                  styles={buildStyles({
                    textSize: "20px",
                    pathColor: "#F97316",
                    textColor: "#000000",
                    trailColor: "#f5f5f5",
                  })}
                />
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default Dashboard;
