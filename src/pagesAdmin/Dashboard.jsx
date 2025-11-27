import React, { useEffect, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAuth } from "../context/AuthContext";
import { fetchDashboardData } from "../API/dashboardAPI";

const ITEMS_PER_PAGE = 12;

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
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(
    1,
    Math.ceil((rooms.length || 0) / ITEMS_PER_PAGE)
  );
  const pagedRooms = rooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const loadDashboard = async (opts = {}) => {
    const { useFilter = false } = opts;

    if (useFilter && (!startDate || !endDate)) {
      setError("Mohon pilih Start Date dan End Date terlebih dahulu!");
      return;
    }

    setLoading(true);
    setError("");

    try {
      let startStr = null;
      let endStr = null;

      if (useFilter && startDate && endDate) {
        startStr = startDate.toISOString().substring(0, 10);
        endStr = endDate.toISOString().substring(0, 10);
      }

      const apiData = await fetchDashboardData(startStr, endStr);

      setStatSummary({
        totalOmzet: apiData.totalMoney || 0,
        totalReservation: apiData.totalReservations || 0,
        totalVisitor: apiData.totalVisitors || 0,
        totalRooms:
          apiData.totalRooms ||
          (apiData.masterRooms || apiData.rooms || []).length ||
          0,
      });

      // Gabungkan master rooms + hasil agregasi usage/omzet
      const mappedRooms = (() => {
        const usageMap = new Map();

        // isi map dari rooms hasil agregasi (fetchDashboardData)
        (apiData.rooms || []).forEach((r) => {
          const id = r.id || r.room_id;
          if (!id) return;
          usageMap.set(id, {
            percentage: Number(r.percentage || 0),
            omzet: Number(r.omzet || r.totalOmzet || 0),
          });
        });

        // sumber utama card = masterRooms (semua room di menu Room)
        const base = apiData.masterRooms || apiData.rooms || [];
        return base.map((mr) => {
          const id = mr.id || mr.room_id;
          const agg = usageMap.get(id) || { percentage: 0, omzet: 0 };

          return {
            id,
            name: mr.room_name || mr.name || mr.room || "-",
            percentage: agg.percentage,
            omzet: agg.omzet,
          };
        });
      })();

      setRooms(mappedRooms);
      setCurrentPage(1);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Gagal fetch data dashboard / token expired"
      );
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

  useEffect(() => {
    if (!token) return;
    loadDashboard({ useFilter: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSearch = () => {
    if (!startDate && !endDate) {
      loadDashboard({ useFilter: false });
    } else {
      loadDashboard({ useFilter: true });
    }
  };

  const handlePrevPage = () =>
    setCurrentPage((p) => Math.max(1, p - 1));
  const handleNextPage = () =>
    setCurrentPage((p) => Math.min(totalPages, p + 1));
  const handlePageNumber = (num) => setCurrentPage(num);

  return (
    <div className="flex flex-col w-full max-w-[1320px] mx-auto min-h-screen gap-[20px]">
      {/* FILTER */}
      <section className="w-full bg-white border border-gray-200 p-6 rounded-lg flex flex-wrap gap-6 items-end">
        <div>
          <label
            htmlFor="start-date"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Start Date
          </label>
          <div className="relative">
            <DatePicker
              id="start-date"
              selected={startDate}
              onChange={(date) => {
                setStartDate(date);
                setError("");
              }}
              placeholderText="Select start date"
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 rounded-lg px-4 py-3 w-[260px] sm:w-[300px] md:w-[515px] h-[48px] bg-white text-gray-900 cursor-pointer"
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
              onChange={(date) => {
                setEndDate(date);
                setError("");
              }}
              placeholderText="Select end date"
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 rounded-lg px-4 py-3 w-[260px] sm:w-[300px] md:w-[515px] h-[48px] bg-white text-gray-900 cursor-pointer"
            />
            <FaCalendarAlt className="absolute right-3 top-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white w-[170px] h-[48px] px-6 py-3 rounded-lg transition font-semibold"
        >
          {loading ? "Loading..." : "Search"}
        </button>
      </section>

      {error && (
        <div className="bg-red-100 text-red-700 px-4 py-3 rounded mb-2">
          {error}
        </div>
      )}

      {/* STATISTIK */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Omzet",
            value: `Rp ${statSummary.totalOmzet.toLocaleString("id-ID")}`,
          },
          {
            label: "Total Reservation",
            value: statSummary.totalReservation,
          },
          {
            label: "Total Visitor",
            value: statSummary.totalVisitor,
          },
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
      <section className="bg-transparent">
        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : rooms.length === 0 ? (
          <p className="text-gray-500 italic text-center py-10">
            No rooms found for the selected date range.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {pagedRooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white border border-gray-200 rounded-[10px] p-5 flex justify-between items-start shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col w-[145px] gap-[5px] mt-[20px] ml-[10px]">
                    <p className="text-[16px] font-semibold text-gray-900">
                      {room.name}
                    </p>
                    <p className="text-[12px] text-gray-400">
                      Usage (%)
                    </p>
                    <p className="text-[16px] font-bold text-gray-900">
                      {room.percentage}%
                    </p>
                    <p className="text-[12px] text-gray-400 mt-[4px]">
                      Omzet
                    </p>
                    <p className="text-[16px] font-semibold text-gray-900">
                      {`Rp ${Number(room.omzet || 0).toLocaleString("id-ID")}`}
                    </p>
                  </div>
                  <div className="flex justify-center items-center mt-[40px] mr-[10px] w-[100px] h-[100px]">
                    <CircularProgressbar
                      value={room.percentage || 0}
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
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-6 flex justify-center items-center gap-2 text-xs sm:text-sm">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-md border ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "hover:bg-orange-50 text-orange-600"
                  }`}
                >
                  &larr;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (num) => (
                    <button
                      key={num}
                      onClick={() => handlePageNumber(num)}
                      className={`p-2 rounded-md w-8 h-8 ${
                        currentPage === num
                          ? "bg-orange-500 text-white"
                          : "bg-white text-orange-500"
                      }`}
                      disabled={currentPage === num}
                    >
                      {num}
                    </button>
                  )
                )}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-md border ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "hover:bg-orange-50 text-orange-600"
                  }`}
                >
                  &rarr;
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
