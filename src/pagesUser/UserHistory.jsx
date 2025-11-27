import React, { useState, useEffect, forwardRef } from "react";
import DatePicker from "react-datepicker";
import {
  FiCornerUpRight,
  FiCalendar,
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";
import ModalReportDetail from "../components/ModalReportDetail";
import ModalConfirmCancel from "../components/ModalConfirmCancel";
import { fetchHistory, cancelReservation } from "../API/historyAPI";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomInput = forwardRef(
  ({ value, onClick, placeholder, id }, ref) => (
    <button
      id={id}
      type="button"
      onClick={onClick}
      ref={ref}
      className="flex items-center justify-between border !border-gray-300 rounded-[10px] w-full h-[48px] px-[14px] text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
    >
      <span className={value ? "text-gray-700" : "text-gray-400"}>
        {value || placeholder}
      </span>
      <FiCalendar className="ml-2 text-gray-400" size={12} />
    </button>
  )
);
CustomInput.displayName = "CustomInput";

function DateInput({ id, selectedDate, onChange, placeholder }) {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      customInput={<CustomInput id={id} placeholder={placeholder} />}
      dateFormat="dd/MM/yyyy"
      wrapperClassName="w-full"
      placeholderText={placeholder}
    />
  );
}

const DEFAULT_ROWS_PER_PAGE = 10;

export default function UserHistory() {
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    roomType: "",
    status: "",
  });
  const [roomTypeOptions] = useState(["Small", "Medium", "Large"]);
  const [statusOptions] = useState(["pending", "confirmed", "canceled"]);

  const [histories, setHistories] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(DEFAULT_ROWS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // ---- FETCH HISTORY DENGAN PAGING DARI BE ----
  const loadHistories = async (page = 1, pageSize = rowsPerPage) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
        room_type: filters.roomType || undefined,
        status: filters.status || undefined,
        startDate: filters.startDate
          ? filters.startDate.toISOString().split("T")[0]
          : undefined,
        endDate: filters.endDate
          ? filters.endDate.toISOString().split("T")[0]
          : undefined,
      };

      const { histories: rows, totalPages: apiTotalPages } =
        await fetchHistory(params);

      // Mapping supaya Room Name & Room Type keisi (mirip Report)
      const mapped = (rows || []).map((row) => {
        const roomName =
          row.room_name ||
          row.room ||
          row.rooms?.room_name ||
          "-";
        const roomType =
          row.room_type ||
          row.type ||
          row.rooms?.room_type ||
          "-";

        return {
          ...row,
          room: roomName,
          type: roomType,
          user_name:
            row.user_name || row.pemesan || row.user?.name || "-",
        };
      });

      setHistories(mapped);
      setCurrentPage(page);
      setTotalPages(apiTotalPages || 1);
    } catch (e) {
      setHistories([]);
      setCurrentPage(1);
      setTotalPages(1);
    }
    setLoading(false);
  };

  // load awal
  useEffect(() => {
    loadHistories(1, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // kalau filter berubah → reset ke page 1 dan refetch
  useEffect(() => {
    loadHistories(1, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // kalau rowsPerPage berubah → refetch page 1
  useEffect(() => {
    loadHistories(1, rowsPerPage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowsPerPage]);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage)
      return;
    loadHistories(newPage, rowsPerPage);
  };

  const handleRowsPerPageChange = (e) => {
    const newSize = Number(e.target.value);
    setRowsPerPage(newSize);
  };

  const handleFilters = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownload = () => {
    const header = "Date,Room,Type,Status\n";
    const content = histories
      .map(
        (row) =>
          `${row.date_reservation || row.date || ""},${row.room},${
            row.type
          },${row.status}`
      )
      .join("\n");
    const blob = new Blob([header + content], {
      type: "text/plain",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "UserHistory.txt";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const getStatusStyle = (status) => {
    switch ((status || "").toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold";
      case "canceled":
        return "bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs font-bold";
      case "pending":
        return "bg-yellow-100 text-yellow-600 px-3 py-1 rounded-full text-xs font-bold";
      default:
        return "bg-gray-100 text-gray-400 px-3 py-1 rounded-full text-xs font-bold";
    }
  };

  const openDetail = (row) => {
    setSelectedRow(row);
    setShowDetailModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!selectedRow) return;
    try {
      await cancelReservation(selectedRow.id);
      setShowCancelModal(false);
      setShowDetailModal(false);
      toast.success("Reservation Successfully Canceled");
      loadHistories(1, rowsPerPage);
    } catch (error) {
      toast.error(
        "Failed to cancel reservation. Please try again."
      );
    }
  };

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, i) => i + 1
  );

  return (
    <div className="p-2 sm:p-6 bg-[#F9FAFB] min-h-screen">
      <ToastContainer position="top-right" autoClose={2500} />

      {/* Filter bar (tetap sesuai mockup) */}
      <div className="bg-white rounded-xl shadow-md w-full max-w-[1320px] min-h-[68px] mx-auto p-4 mb-1 flex flex-col md:flex-row md:items-end md:gap-4 gap-4 justify-between">
        <div className="flex flex-col md:flex-row flex-1 gap-4">
          <div className="w-full md:w-[257px]">
            <label
              htmlFor="startDate"
              className="block text-sm text-gray-600 mb-1"
            >
              Start Date
            </label>
            <DateInput
              id="startDate"
              selectedDate={filters.startDate}
              onChange={(date) =>
                setFilters((f) => ({ ...f, startDate: date }))
              }
              placeholder="Start date"
            />
          </div>
          <div className="w-full md:w-[257px]">
            <label
              htmlFor="endDate"
              className="block text-sm text-gray-600 mb-1"
            >
              End Date
            </label>
            <DateInput
              id="endDate"
              selectedDate={filters.endDate}
              onChange={(date) =>
                setFilters((f) => ({ ...f, endDate: date }))
              }
              placeholder="End date"
            />
          </div>
          <div className="w-full md:w-[257px]">
            <label
              htmlFor="roomType"
              className="block text-sm text-gray-600 mb-1"
            >
              Room Type
            </label>
            <select
              id="roomType"
              name="roomType"
              value={filters.roomType}
              onChange={handleFilters}
              className="border border-gray-300 rounded-[10px] w-full h-[48px] px-[14px] text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
            >
              <option value="">Room Type</option>
              {roomTypeOptions.map((rt) => (
                <option value={rt.toLowerCase()} key={rt}>
                  {rt}
                </option>
              ))}
            </select>
          </div>
          <div className="w-full md:w-[257px]">
            <label
              htmlFor="status"
              className="block text-sm text-gray-600 mb-1"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilters}
              className="border border-gray-300 rounded-[10px] w-full h-[48px] px-[14px] text-gray-700 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-colors"
            >
              <option value="">Status</option>
              {statusOptions.map((st) => (
                <option value={st.toLowerCase()} key={st}>
                  {st.charAt(0).toUpperCase() + st.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex gap-2 mt-2 md:mt-0 md:mb-1">
          <button
            onClick={handleDownload}
            className="w-[48px] h-[48px] flex items-center justify-center border-2 !border-orange-500 rounded-xl bg-transparent transition group hover:border-orange-600 focus:outline-none"
            title="Download"
          >
            <FiDownload className="w-7 h-7 text-orange-500 transition group-hover:text-orange-600" />
          </button>
        </div>
      </div>

      {/* Table + pagination */}
      <div className="w-full max-w-[1320px] mx-auto bg-white rounded-xl shadow-md p-4 overflow-x-auto">
        <table className="min-w-[600px] w-full text-sm text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="p-3">Date Reservation</th>
              <th className="p-3">Room Name</th>
              <th className="p-3">Room Type</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-400 p-6"
                >
                  Loading...
                </td>
              </tr>
            ) : histories.length > 0 ? (
              histories.map((row) => (
                <tr
                  key={row.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3">
                    {row.date_reservation || row.date || "-"}
                  </td>
                  <td className="p-3">{row.room}</td>
                  <td className="p-3">{row.type}</td>
                  <td className="p-3">
                    <span className={getStatusStyle(row.status)}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <button
                      className="text-orange-500 hover:text-orange-600"
                      title="Detail"
                      onClick={() => openDetail(row)}
                    >
                      <FiCornerUpRight size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={5}
                  className="text-center text-gray-400 p-6"
                >
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Bottom bar: Show entries + pagination center */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex justify-start items-center text-xs sm:text-sm">
            <label
              htmlFor="rowsPerPageSelect"
              className="mr-2"
            >
              Show:
            </label>
            <select
              id="rowsPerPageSelect"
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border rounded px-2 py-1"
            >
              {[10, 25, 50, 100].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            <span className="ml-2">Entries</span>
          </div>

          <div className="flex justify-center items-center gap-2 text-xs sm:text-sm">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-md border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-orange-50 text-orange-600"
              }`}
            >
              <FiChevronLeft />
            </button>
            {pageNumbers.map((num) => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`p-2 rounded-md w-8 h-8 ${
                  currentPage === num
                    ? "bg-orange-400 text-white"
                    : "bg-white text-orange-500"
                }`}
                disabled={currentPage === num}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md border ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-orange-50 text-orange-600"
              }`}
            >
              <FiChevronRight />
            </button>
          </div>
        </div>
      </div>

      {showDetailModal && (
        <ModalReportDetail
          open={showDetailModal}
          data={selectedRow}
          onClose={() => setShowDetailModal(false)}
        />
      )}
      {showCancelModal && (
        <ModalConfirmCancel
          open={showCancelModal}
          onClose={() => setShowCancelModal(false)}
          onConfirm={handleConfirmCancel}
        />
      )}
    </div>
  );
}
