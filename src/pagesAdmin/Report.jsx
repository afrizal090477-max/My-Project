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
    className="flex items-center justify-between w-full h-[48px] border !border-gray-500 rounded-[10px] px-[14px] bg-white text-left focus:ring-2 focus:ring-orange-400"
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

export default function Report() {
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
  const [showPayToast, setShowPayToast] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  });

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
          startDate: filters.startDate
            ? filters.startDate.toISOString().slice(0, 10)
            : undefined,
          endDate: filters.endDate
            ? filters.endDate.toISOString().slice(0, 10)
            : undefined,
        };
        const res = await fetchReservations(queryParams);

        // ===== Filter Data Unik Berdasarkan Beberapa Field Penting ====
        setReportData(
          (res.data || []).filter(
            (v, i, arr) =>
              arr.findIndex(x =>
                x.id === v.id &&
                x.date_reservation === v.date_reservation &&
                x.start_time === v.start_time &&
                x.end_time === v.end_time &&
                x.pemesan === v.pemesan
              ) === i
          )
        );

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
        startDate: filters.startDate
          ? filters.startDate.toISOString().slice(0, 10)
          : undefined,
        endDate: filters.endDate
          ? filters.endDate.toISOString().slice(0, 10)
          : undefined,
      });
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "report.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch {
      const header = "Start Date,End Date,Room,User,Type,Status\n";
      const content = reportData
        .map(
          (row) =>
            `${row.date_reservation || "-"} ${row.start_time || ""},${row.date_reservation || "-"} ${row.end_time || ""},${row.rooms?.room_name || "-"},${row.pemesan || "-"},${row.rooms?.room_type || "-"},${row.status}`
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

  const getStatusStyle = (status) => {
    switch (status) {
      case "Booked":
        return "bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold";
      case "Paid":
        return "bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold";
      case "Cancel":
        return "bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs font-bold";
      default:
        return "";
    }
  };

  const openDetail = (row) => {
    setDetailData(row);
    setDetailOpen(true);
  };
  const closeDetail = () => {
    setDetailData(null);
    setDetailOpen(false);
  };
  const handlePay = () => {
    setDetailOpen(false);
    setShowPayToast(true);
    setTimeout(() => setShowPayToast(false), 2200);
  };

  return (
    <div className="p-8 bg-[#F9FAFB] min-h-screen">
      {showPayToast && (
        <div className="fixed w-[456px] h-[82px] top-[100px] left-[964px] right-4 bg-green-500 text-white px-20 py-4 rounded shadow z-50 flex items-center gap-2">
          <span className="text-xl">✔</span>
          <span>Your Payment Successfully made</span>
        </div>
      )}
      {/* Filter bar */}
      <div className="bg-white rounded-xl p-5 mb-6 flex flex-wrap gap-5 items-center shadow border border-gray-200">
        <div className="flex flex-col gap-2 w-[220px]">
          <label className="font-medium text-gray-700 text-xs">Start Date</label>
          <DateInput
            id="startDate"
            selectedDate={filters.startDate}
            onChange={(date) => setFilters((prev) => ({ ...prev, startDate: date }))}
            placeholder="Select start date"
          />
        </div>
        <div className="flex flex-col gap-2 w-[220px]">
          <label className="font-medium text-gray-700 text-xs">End Date</label>
          <DateInput
            id="endDate"
            selectedDate={filters.endDate}
            onChange={(date) => setFilters((prev) => ({ ...prev, endDate: date }))}
            placeholder="Select end date"
          />
        </div>
        <div className="flex flex-col gap-2 w-[220px]">
          <label className="font-medium text-gray-700 text-xs">Room Type</label>
          <select
            name="roomType"
            value={filters.roomType}
            onChange={handleFilters}
            className="w-full h-[48px] border border-gray-500 px-[14px] rounded-[10px] bg-white text-gray-700"
          >
            <option value="">All Types</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>
        </div>
        <div className="flex flex-col gap-2 w-[220px]">
          <label className="font-medium text-gray-700 text-xs">Status</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilters}
            className="w-full h-[48px] border border-gray-500 px-[14px] rounded-[10px] bg-white text-gray-700"
          >
            <option value="">All Status</option>
            <option value="Booked">Booked</option>
            <option value="Paid">Paid</option>
            <option value="Cancel">Cancel</option>
          </select>
        </div>
        <button
          className="ml-auto bg-orange-600 text-white px-5 py-3 h-[48px] rounded-lg flex items-center gap-2 shadow hover:bg-orange-700"
          onClick={handleDownload}
        >
          <FiDownload size={18} /> Download Report
        </button>
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl shadow border border-gray-200">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-500">{error}</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-4 text-xs font-bold text-gray-600 text-left">Start Date</th>
                <th className="p-4 text-xs font-bold text-gray-600 text-left">End Date</th>
                <th className="p-4 text-xs font-bold text-gray-600 text-left">Room</th>
                <th className="p-4 text-xs font-bold text-gray-600 text-left">User</th>
                <th className="p-4 text-xs font-bold text-gray-600 text-left">Type</th>
                <th className="p-4 text-xs font-bold text-gray-600 text-left">Status</th>
                <th className="p-4 text-xs font-bold text-gray-600 text-left"></th>
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
                <tr key={row.id || idx} className="border-t">
                  <td className="p-4">
                    {row.date_reservation
                      ? `${row.date_reservation}${row.start_time ? " " + row.start_time : ""}`
                      : "-"}
                  </td>
                  <td className="p-4">
                    {row.date_reservation
                      ? `${row.date_reservation}${row.end_time ? " " + row.end_time : ""}`
                      : "-"}
                  </td>
                  <td className="p-4">{row.rooms?.room_name || "-"}</td>
                  <td className="p-4">{row.pemesan || "-"}</td>
                  <td className="p-4">{row.rooms?.room_type || "-"}</td>
                  <td className="p-4">
                    <span className={getStatusStyle(row.status)}>{row.status}</span>
                  </td>
                  <td className="p-4">
                    <button
                      className="text-orange-600 hover:text-orange-800 flex gap-1 items-center"
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
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <label>
              Rows per page:
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
      <ModalReportDetail
        open={detailOpen}
        onClose={closeDetail}
        data={detailData}
        onPay={handlePay}
      />
    </div>
  );
}
