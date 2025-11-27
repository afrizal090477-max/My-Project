import React, { useState, useEffect, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiCornerUpRight, FiCalendar, FiDownload } from "react-icons/fi";
import ModalReportDetail from "../components/ModalReportDetail";
import { fetchReservations, downloadReport } from "../API/reportAPI";

const CustomInput = forwardRef(({ value, onClick, placeholder, id }, ref) => (
  <button
    id={id}
    type="button"
    onClick={onClick}
    ref={ref}
    className="flex items-center justify-between w-[257px] h-[48px] border !border-[#a1a2a5] rounded-[10px] px-[14px] bg-white text-left focus:ring-2 focus:ring-orange-400"
  >
    <span className={value ? "text-gray-700" : "text-gray-400"}>
      {value || placeholder}
    </span>
    <FiCalendar className="ml-2 text-gray-400" size={16} />
  </button>
));
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
      isClearable
    />
  );
}

// Status style helper
function getStatusStyle(status) {
  switch (status?.toLowerCase?.()) {
    case "booked":
    case "pending":
      return "bg-orange-100 text-orange-600 border border-orange-300 px-3 py-1 rounded-[16px] text-xs font-bold";
    case "confirmed":
      return "bg-green-100 text-green-600 border border-green-300 px-3 py-1 rounded-[16px] text-xs font-bold";
    case "cancel":
      return "bg-red-100 text-red-500 border border-red-300 px-3 py-1 rounded-[16px] text-xs font-bold";
    default:
      return "bg-gray-100 text-gray-500 px-3 py-1 rounded-[16px] text-xs";
  }
}

export default function Report() {
  // STATE
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    roomType: "",
    status: "",
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  });

  // FETCH DATA
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      setError(null);
      try {
        const queryParams = {
          page: currentPage,
          limit: rowsPerPage,
          room_type: filters.roomType,
          status: filters.status,
          startDate: filters.startDate?.toISOString().slice(0, 10),
          endDate: filters.endDate?.toISOString().slice(0, 10),
        };
        const res = await fetchReservations(queryParams);
        const unique = (res.data || []).filter(
          (v, i, arr) =>
            arr.findIndex(
              (x) =>
                x.id === v.id &&
                x.date_reservation === v.date_reservation &&
                x.start_time === v.start_time &&
                x.end_time === v.end_time &&
                x.pemesan === v.pemesan
            ) === i
        );

        // optional: pastikan urut A–Z by room name
        unique.sort((a, b) =>
          (a.rooms?.room_name || "")
            .toUpperCase()
            .localeCompare((b.rooms?.room_name || "").toUpperCase(), "id-ID")
        );

        setReportData(unique);

        setPagination({
          currentPage: res.pagination?.currentPage || 1,
          pageSize: res.pagination?.pageSize || rowsPerPage,
          totalItems: res.pagination?.totalItems || 0,
          totalPages: res.pagination?.totalPages || 1,
        });
      } catch {
        setError("Failed to fetch reports");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [filters, currentPage, rowsPerPage]);

  // HANDLER
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleFilters = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadReport({
        room_type: filters.roomType,
        status: filters.status,
        startDate: filters.startDate?.toISOString().slice(0, 10),
        endDate: filters.endDate?.toISOString().slice(0, 10),
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "report.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      const header = "Start Date,End Date,Room,User,Type,Status\n";
      const content = reportData
        .map(
          (row) =>
            `${row.date_reservation || "-"} ${row.start_time || ""},${
              row.date_reservation || "-"
            } ${row.end_time || ""},${row.rooms?.room_name || "-"},${
              row.pemesan || "-"
            },${row.rooms?.room_type || "-"},${row.status}`
        )
        .join("\n");
      const blob = new Blob([header + content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Report.txt";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    }
  };

  const openDetail = (row) => {
    setDetailData(row);
    setDetailOpen(true);
  };

  const closeDetail = (shouldRefresh) => {
    setDetailData(null);
    setDetailOpen(false);
    if (shouldRefresh) {
      setFilters((prev) => ({ ...prev })); // trigger refetch
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2200);
    }
  };

  // RENDER
  return (
    <div className="p-8 bg-[#F9FAFB] min-h-screen">
      {console.log("showToast state", showToast)}
      {showToast && (
        <div
          style={{
            position: "fixed",
            top: 40,
            right: 40,
            background: "lightgreen",
            padding: 16,
            zIndex: 9999,
          }}
        >
          Action success.
        </div>
      )}

      {/* FILTER BAR */}
      <div className="bg-white rounded-xl p-5 mb-6 flex flex-wrap gap-6 items-end shadow border border-[#828385]">
        <div className="flex flex-col gap-1 w-[257px]">
          <label className="font-semibold text-gray-700 text-[15px]">
            Start Date
          </label>
          <DateInput
            id="startDate"
            selectedDate={filters.startDate}
            onChange={(date) =>
              setFilters((prev) => ({ ...prev, startDate: date }))
            }
            placeholder="Select start date"
          />
        </div>
        <div className="flex flex-col gap-1 w-[257px]">
          <label className="font-semibold text-gray-700 text-[15px]">
            End Date
          </label>
          <DateInput
            id="endDate"
            selectedDate={filters.endDate}
            onChange={(date) =>
              setFilters((prev) => ({ ...prev, endDate: date }))
            }
            placeholder="Select end date"
          />
        </div>
        <div className="flex flex-col gap-1 w-[257px]">
          <label className="font-semibold text-gray-700 text-[15px]">
            Room Type
          </label>
          <select
            name="roomType"
            value={filters.roomType}
            onChange={handleFilters}
            className="w-full h-[48px] border border-[#CECECE] px-[14px] rounded-[10px] bg-white text-gray-700"
          >
            <option value="">All Types</option>
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 w-[257px]">
          <label className="font-semibold text-gray-700 text-[15px]">
            Status
          </label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilters}
            className="w-full h-[48px] border border-[#CECECE] px-[14px] rounded-[10px] bg-white text-gray-700"
          >
            <option value="">All Status</option>
            <option value="booked">Booked</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancel">Cancel</option>
          </select>
        </div>
        <button
          className="ml-auto flex items-center justify-center w-[48px] h-[48px] bg-orange-600 text-white rounded-lg shadow hover:bg-orange-700 transition"
          onClick={handleDownload}
          style={{ padding: 0 }}
        >
          <FiDownload size={22} />
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border border-[#E5E7EB]">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-[#F7F7FB]">
                <th className="p-4 text-[15px] font-bold text-gray-700 text-center">
                  Start Date
                </th>
                <th className="p-4 text-[15px] font-bold text-gray-700 text-center">
                  End Date
                </th>
                <th className="p-4 text-[15px] font-bold text-gray-700 text-center">
                  Room
                </th>
                <th className="p-4 text-[15px] font-bold text-gray-700 text-center">
                  User
                </th>
                <th className="p-4 text-[15px] font-bold text-gray-700 text-center">
                  Type
                </th>
                <th className="p-4 text-[15px] font-bold text-gray-700 text-center">
                  Status
                </th>
                <th className="p-4 text-[15px] font-bold text-gray-700 text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {reportData.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-6 text-center text-gray-400">
                    No data available.
                  </td>
                </tr>
              )}
              {reportData.map((row, idx) => (
                <tr key={row.id || idx} className="border-t hover:bg-[#F4F8FB]">
                  <td className="p-4 text-center whitespace-nowrap">
                    {row.date_reservation
                      ? `${row.date_reservation}${
                          row.start_time ? " " + row.start_time : ""
                        }`
                      : "-"}
                  </td>
                  <td className="p-4 text-center whitespace-nowrap">
                    {row.date_reservation
                      ? `${row.date_reservation}${
                          row.end_time ? " " + row.end_time : ""
                        }`
                      : "-"}
                  </td>
                  <td className="p-4 text-center">
                    {row.rooms?.room_name || "-"}
                  </td>
                  <td className="p-4 text-center">{row.pemesan || "-"}</td>
                  <td className="p-4 text-center">
                    {row.rooms?.room_type || "-"}
                  </td>
                  <td className="p-4 text-center">
                    <span className={getStatusStyle(row.status)}>
                      {row.status}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button
                      className="text-orange-600 hover:text-orange-800 flex gap-1 justify-center items-center font-semibold"
                      onClick={() => openDetail(row)}
                    >
                      <FiCornerUpRight size={17} /> Detail
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[#F1F1F3]">
          <div>
            <label>
              Rows/page:
              <select
                value={rowsPerPage}
                onChange={handleRowsPerPageChange}
                className="ml-2 border border-gray-400 rounded px-2 py-1"
              >
                {[5, 10, 20, 50].map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex gap-1 items-center">
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 rounded border disabled:text-gray-300 disabled:border-gray-200"
            >
              Prev
            </button>
            <span>
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 rounded border disabled:text-gray-300 disabled:border-gray-200"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Modal detail REPORT */}
      <ModalReportDetail
        open={detailOpen}
        onClose={closeDetail}
        data={detailData}
      />
    </div>
  );
}
