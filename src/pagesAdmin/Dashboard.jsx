import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

// Dummy room + field date (yyyy-mm-dd)
const rooms = [
  { name: "Aster Room", usage: 100, omzet: 2000000, date: "2025-11-01" },
  { name: "Bluebell Room", usage: 80, omzet: 2000000, date: "2025-11-03" },
  { name: "Camellia Room", usage: 70, omzet: 1500000, date: "2025-11-06" },
  { name: "Daisy Room", usage: 60, omzet: 1200000, date: "2025-11-06" },
  { name: "Ivy Room", usage: 90, omzet: 2300000, date: "2025-11-05" },
  { name: "Lily Room", usage: 75, omzet: 1900000, date: "2025-11-04" },
  { name: "Magnolia Room", usage: 85, omzet: 2100000, date: "2025-11-07" },
  { name: "Orchid Room", usage: 95, omzet: 2500000, date: "2025-11-08" },
  { name: "Peony Room", usage: 88, omzet: 2200000, date: "2025-11-07" },
  { name: "Rose Room", usage: 92, omzet: 2400000, date: "2025-11-01" },
  { name: "Tulip Room", usage: 78, omzet: 1800000, date: "2025-11-02" },
  { name: "Violet Room", usage: 83, omzet: 2000000, date: "2025-11-05" },
];

const Dashboard = () => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [statSummary, setStatSummary] = useState({
    totalOmzet: rooms.reduce((a, b) => a + b.omzet, 0),
    totalReservation: rooms.length * 10,
    totalVisitor: rooms.length * 40,
    totalRooms: rooms.length,
  });

  // Dummy alur filter date
  const handleSearch = () => {
    if (!startDate || !endDate) {
      alert("Pilih Start Date dan End Date terlebih dahulu!");
      return;
    }
    // Ubah ke format tanggal string untuk banding
    const start = new Date(startDate).toISOString().substring(0, 10);
    const end = new Date(endDate).toISOString().substring(0, 10);
    // Filter rooms by date
    const filtered = rooms.filter((room) => room.date >= start && room.date <= end);

    // Hitung summary dari rooms terfilter
    const totalOmzet = filtered.reduce((a, b) => a + b.omzet, 0);
    const totalReservation = filtered.length * 10; // Dummy
    const totalVisitor = filtered.length * 40;     // Dummy
    const totalRooms = filtered.length;

    setFilteredRooms(filtered);
    setStatSummary({ totalOmzet, totalReservation, totalVisitor, totalRooms });
  };

  const displayedRooms = filteredRooms.length > 0 ? filteredRooms : rooms;

  return (
    <div className="flex flex-col w-[1320px] h-[1003px] top-[100px] left-[100px] gap-[20px]">
      <section className="w-[1320px] h-[114px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-6 rounded-lg flex flex-wrap gap-6 items-end">
        <div>
          <label
            htmlFor="start-date"
            className="block text-sm font-medium text-black-700 dark:text-black-700 mb-1"
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
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 w-[500px] h-[48px]  bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
            />
            <FaCalendarAlt className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <div>
          <label
            htmlFor="end-date"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
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
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 w-[500px] h-[48px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white cursor-pointer"
            />
            <FaCalendarAlt className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <button
          onClick={handleSearch}
          className="bg-orange-500 hover:bg-orange-600 text-white w-[210px] h-[48px] px-8 py-3 rounded-lg transition"
        >
          Search
        </button>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Omzet", value: `Rp ${statSummary.totalOmzet.toLocaleString()}` },
          { label: "Total Reservation", value: statSummary.totalReservation },
          { label: "Total Visitor", value: statSummary.totalVisitor },
          { label: "Total Rooms", value: statSummary.totalRooms },
        ].map((stat) => (
          <div
            key={stat.label}
            className="w-[315px] h-[128px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-lg shadow-sm"
          >
            <p className="text-sm text-black-700 dark:text-black-700">
              {stat.label}
            </p>
            <p className="text-2xl font-bold mt-2">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedRooms.length === 0 ? (
          <p className="text-gray-500 italic col-span-full text-center py-10">
            No rooms found for the selected date range.
          </p>
        ) : (
          displayedRooms.map((room) => (
            <div
              key={room.name}
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-[10px] p-5 flex justify-between items-start shadow-sm hover:shadow-md transition-all duration-300 w-[315px] h-[227px]"
            >
              <div className="flex flex-col w-[145px] h-[57px] gap-[5px] mt-[20px] ml-[10px]">
                <p className="text-[16px] font-semibold text-gray-900 dark:text-white">
                  {room.name}
                </p>
                <p className="text-[12px] text-gray-400 dark:text-gray-500">
                  Percentage of Usage
                </p>
                <p className="text-[16px] font-bold text-gray-900 dark:text-white">
                  {room.usage}%
                </p>
                <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-[4px]">
                  Omzet
                </p>
                <p className="text-[16px] font-semibold text-gray-900 dark:text-white">
                  {`Rp ${room.omzet.toLocaleString()}`}
                </p>
                <p className="text-[12px] text-gray-400 dark:text-gray-500 mt-[2px]">
                  Date: {room.date}
                </p>
              </div>
              <div className="flex justify-center items-center mt-[40px] mr-[10px] w-[100px] h-[100px]">
                <CircularProgressbar
                  value={Number(room.usage)}
                  text={`${room.usage}%`}
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
