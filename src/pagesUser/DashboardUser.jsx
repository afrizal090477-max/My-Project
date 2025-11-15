import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { fetchDashboardUserData } from "../API/dashboardUserAPI"; // panggil API
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function DashboardUser() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [stats, setStats] = useState({
    totalOmzet: 0,
    totalReservation: 0,
    totalVisitor: 0,
    totalRooms: 0,
  });
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      toast.warning("Pilih Start Date dan End Date terlebih dahulu!");
      return;
    }
    setLoading(true);
    try {
      const apiData = await fetchDashboardUserData(
        new Date(startDate).toISOString().substring(0, 10),
        new Date(endDate).toISOString().substring(0, 10)
      );
      const apiRooms = apiData.rooms || [];
      const apiStats = apiData.summary || {};
      setRooms(apiRooms);
      setStats({
        totalOmzet: apiStats.totalOmzet || 0,
        totalReservation: apiStats.totalReservation || 0,
        totalVisitor: apiStats.totalVisitor || 0,
        totalRooms: apiStats.totalRooms || 0,
      });
      toast.success("Data dashboard berhasil dimuat");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Gagal fetch data dashboard / token expired"
      );
      setRooms([]);
      setStats({
        totalOmzet: 0,
        totalReservation: 0,
        totalVisitor: 0,
        totalRooms: 0,
      });
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <ToastContainer position="top-right" autoClose={3000} />

      <section className="bg-white border border-gray-200 p-6 rounded-lg flex flex-wrap gap-6 items-end">
        <div>
          <label
            htmlFor="start-date"
            className="block text-sm font-medium text-black-700 mb-1"
          >
            Start Date
          </label>
          <div className="relative">
            <DatePicker
              id="start-date"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Select start date"
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 rounded-lg px-4 py-3 w-[170px] bg-white text-gray-900 cursor-pointer"
            />
            <FaCalendarAlt className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label
            htmlFor="end-date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            End Date
          </label>
          <div className="relative">
            <DatePicker
              id="end-date"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="Select end date"
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 rounded-lg px-4 py-3 w-[170px] bg-white text-gray-900 cursor-pointer"
            />
            <FaCalendarAlt className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="bg-orange-500 hover:bg-orange-600 text-white w-[140px] h-[48px] px-8 py-3 rounded-lg transition"
          disabled={loading}
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Omzet",
            value: `Rp ${stats.totalOmzet.toLocaleString()}`,
          },
          { label: "Total Reservation", value: stats.totalReservation },
          { label: "Total Visitor", value: stats.totalVisitor },
          { label: "Total Rooms", value: stats.totalRooms },
        ].map((stat) => (
          <div
            key={stat.label}
            className="w-[200px] h-[110px] bg-white border border-gray-200 p-4 rounded-lg shadow-sm"
          >
            <p className="text-sm text-black-700">{stat.label}</p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {rooms.length === 0 && !loading ? (
          <p className="text-gray-500 italic col-span-full text-center py-10">
            No rooms found for the selected date range.
          </p>
        ) : (
          rooms.map((room) => (
            <div
              key={room.name}
              className="bg-white border border-gray-200 rounded-[10px] p-5 flex justify-between items-start shadow-sm hover:shadow-md transition-all duration-300 w-[215px] h-[210px]"
            >
              <div className="flex flex-col gap-[5px] mt-[10px] ml-[10px]">
                <p className="text-[16px] font-semibold text-gray-900">
                  {room.name}
                </p>
                <p className="text-[12px] text-gray-400">Percentage of Usage</p>
                <p className="text-[16px] font-bold text-gray-900">
                  {room.usage}%
                </p>
                <p className="text-[12px] text-gray-400 mt-[4px]">Omzet</p>
                <p className="text-[16px] font-semibold text-gray-900">{`Rp ${room.omzet.toLocaleString()}`}</p>
              </div>
              <div className="flex justify-center items-center mt-[20px] mr-[10px] w-[70px] h-[70px]">
                <CircularProgressbar
                  value={Number(room.usage)}
                  text={`${room.usage}%`}
                  styles={buildStyles({
                    textSize: "16px",
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
}
