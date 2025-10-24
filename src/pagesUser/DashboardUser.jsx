import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCalendarAlt } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

export default function DashboardUser() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [filteredRooms, setFilteredRooms] = useState([]);

  const rooms = [
    { name: "Aster Room", usage: 100, omzet: "Rp 2.000.000" },
    { name: "Bluebell Room", usage: 80, omzet: "Rp 2.000.000" },
    { name: "Camellia Room", usage: 70, omzet: "Rp 1.500.000" },
    { name: "Daisy Room", usage: 60, omzet: "Rp 1.200.000" },
    { name: "Ivy Room", usage: 90, omzet: "Rp 2.300.000" },
    { name: "Lily Room", usage: 75, omzet: "Rp 1.900.000" },
    { name: "Magnolia Room", usage: 85, omzet: "Rp 2.100.000" },
    { name: "Orchid Room", usage: 95, omzet: "Rp 2.500.000" },
    { name: "Peony Room", usage: 88, omzet: "Rp 2.200.000" },
    { name: "Rose Room", usage: 92, omzet: "Rp 2.400.000" },
    { name: "Tulip Room", usage: 78, omzet: "Rp 1.800.000" },
    { name: "Violet Room", usage: 83, omzet: "Rp 2.000.000" },
  ];

  const handleSearch = () => {
    if (!startDate || !endDate) {
      alert("Pilih Start Date dan End Date terlebih dahulu!");
      return;
    }
    // Dummy filter, karena rooms tidak punya field date asli
    setFilteredRooms([]); // Pakai penyesuaian nanti saat ada backend
  };

  const displayedRooms = filteredRooms.length > 0 ? filteredRooms : rooms;

  return (
    <div className="flex flex-col gap-6">
      <section className="bg-white border border-gray-200 p-6 rounded-lg flex flex-wrap gap-6 items-end">
        <div>
          <label htmlFor="start-date" className="block text-sm font-medium text-black-700 mb-1">
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
          <label htmlFor="end-date" className="block text-sm font-medium text-gray-700 mb-1">
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
        >
          Search
        </button>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Omzet", value: "Rp 8.000.000" },
          { label: "Total Reservation", value: "100" },
          { label: "Total Visitor", value: "500" },
          { label: "Total Rooms", value: "12" },
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
        {displayedRooms.length === 0 ? (
          <p className="text-gray-500 italic col-span-full text-center py-10">
            No rooms found for the selected date range.
          </p>
        ) : (
          displayedRooms.map((room) => (
            <div
              key={room.name}
              className="bg-white border border-gray-200 rounded-[10px] p-5 flex justify-between items-start shadow-sm hover:shadow-md transition-all duration-300 w-[215px] h-[210px]"
            >
              <div className="flex flex-col gap-[5px] mt-[10px] ml-[10px]">
                <p className="text-[16px] font-semibold text-gray-900">{room.name}</p>
                <p className="text-[12px] text-gray-400">Percentage of Usage</p>
                <p className="text-[16px] font-bold text-gray-900">{room.usage}%</p>
                <p className="text-[12px] text-gray-400 mt-[4px]">Omzet</p>
                <p className="text-[16px] font-semibold text-gray-900">{room.omzet}</p>
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
