import React, { useState } from "react";
import { FiEdit2, FiCalendar, FiDownload } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ModalReportDetail from "@/components/ModalReportDetail";
import ModalConfirmCancel from "@/components/ModalConfirmCancel";
import PropTypes from "prop-types";

function DateInput({ selectedDate, onChange, placeholder }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative w-44">
      <DatePicker
        selected={selectedDate}
        onChange={onChange}
        onClickOutside={() => setOpen(false)}
        open={open}
        onInputClick={() => setOpen(true)}
        placeholderText={placeholder}
        dateFormat="yyyy-MM-dd"
        className="border rounded-lg px-3 py-2 text-sm w-full"
      />
      <button
        type="button"
        className="absolute top-1/2 right-2 -translate-y-1/2 text-gray-500"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle calendar"
      >
        <FiCalendar size={18} />
      </button>
    </div>
  );
}
DateInput.propTypes = {
  selectedDate: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

DateInput.defaultProps = {
  selectedDate: null,
  placeholder: "",
};

export default function Report() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [toast, setToast] = useState({ show: false, type: "", message: "" });

  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    roomType: "",
    status: "",
  });

  const DUMMY_DATA = [
    { date: "01/10/2024", room: "Aster Room", type: "Small", status: "Booked" },
    { date: "01/10/2024", room: "Aster Room", type: "Small", status: "Paid" },
    { date: "02/15/2024", room: "Bluebell", type: "Small", status: "Cancel" },
    { date: "03/20/2024", room: "Camellia", type: "Medium", status: "Paid" },
    { date: "03/21/2024", room: "Daisy", type: "Large", status: "Paid" },
  ];
  const [filteredData, setFilteredData] = useState(DUMMY_DATA);

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: "", message: "" }), 3000);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-600";
      case "Cancel":
        return "bg-red-100 text-red-500";
      default:
        return "bg-orange-100 text-orange-500";
    }
  };

  const getToastColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-600";
      case "error":
        return "bg-red-600";
      default:
        return "bg-gray-600";
    }
  };

  const handleConfirmYes = () => {
    setConfirmOpen(false);
    showToast("success", "Your reservation successfully canceled");
  };

  const openDetail = (row) => {
    setDetailData(row);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailData(null);
    setDetailOpen(false);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = () => {
    const filterStart = filters.startDate ? new Date(filters.startDate) : null;
    let filterEnd = filters.endDate ? new Date(filters.endDate) : null;

    if (filterEnd) {
      filterEnd.setHours(23, 59, 59, 999);
    }

    const results = DUMMY_DATA.filter((report) => {
      const [month, day, year] = report.date.split("/").map(Number);
      const reportDate = new Date(year, month - 1, day);

      const dateMatch =
        (!filterStart || reportDate >= filterStart) &&
        (!filterEnd || reportDate <= filterEnd);

      const typeMatch = !filters.roomType || report.type === filters.roomType;

      const statusMatch = !filters.status || report.status === filters.status;

      return dateMatch && typeMatch && statusMatch;
    });

    setFilteredData(results);
    showToast("success", "Filter applied successfully");
  };

  // Fungsi download data hasil filter sebagai file teks
  const downloadReport = () => {
    if (filteredData.length === 0) {
      showToast("error", "No data to download");
      return;
    }
    const header = "Date,Room,Type,Status\n";
    const content = filteredData
      .map(({ date, room, type, status }) => `${date},${room},${type},${status}`)
      .join("\n");
    const blob = new Blob([header + content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Report-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    URL.revokeObjectURL(url);
    showToast("success", "Download started");
  };

  return (
    <div className="p-6 bg-[#F9FAFB] min-h-screen">
      {/* FILTER BAR */}
      <div className="bg-white rounded-xl shadow-md w-[1320px] h-[114px] top-[100px] left-[100px] p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-4">
          <div>
            <label
              htmlFor="startDate"
              className="block text-sm text-gray-600 mb-1"
            >
              Start Date
            </label>
            <DateInput
              selectedDate={filters.startDate ? new Date(filters.startDate) : null}
              onChange={(date) =>
                setFilters((prev) => ({
                  ...prev,
                  startDate: date ? date.toISOString().slice(0, 10) : "",
                }))
              }
              placeholder="Select start date"
            />
          </div>

          <div>
            <label
              htmlFor="endDate"
              className="block text-sm text-gray-600 mb-1"
            >
              End Date
            </label>
            <DateInput
              selectedDate={filters.endDate ? new Date(filters.endDate) : null}
              onChange={(date) =>
                setFilters((prev) => ({
                  ...prev,
                  endDate: date ? date.toISOString().slice(0, 10) : "",
                }))
              }
              placeholder="Select end date"
            />
          </div>

          <div>
            <label
              htmlFor="roomType"
              className="block text-sm text-gray-600 mb-1"
            >
              Room Type
            </label>
            <select
              name="roomType"
              value={filters.roomType}
              onChange={handleFilterChange}
              className="border rounded-lg w-[257px] h-[48px] px-3 py- text-sm "
            >
              <option value="">Select Room Type</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm text-gray-600 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="border rounded-lg px-3 py-2 text-sm w-[257px] h-[48px]"
            >
              <option value="">Select Status</option>
              <option value="Booked">Booked</option>
              <option value="Paid">Paid</option>
              <option value="Cancel">Cancel</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={handleSearch}
            className="bg-[#FF7316] text-white w-[102px] h-[48px] px-6 py-2 rounded-lg hover:bg-[#e86810] transition text-sm font-medium"
          >
            Search
          </button>
          <button
            onClick={downloadReport}
            className="flex items-center gap-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition text-sm"
            aria-label="Download report"
          >
            <FiDownload size={18} />
            
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <table className="min-w-full text-sm text-left border-collapse">
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
            {filteredData.map((row, index) => (
              <tr
                key={`${row.date}-${row.room}-${index}`}
                className="border-b hover:bg-gray-50 transition"
              >
                <td className="p-3">{row.date}</td>
                <td className="p-3">{row.room}</td>
                <td className="p-3">{row.type}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      row.status
                    )}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => openDetail(row)}
                    className="text-[#FF7316] hover:text-[#e86610]"
                    aria-label="View Details"
                  >
                    <FiEdit2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="5" className="p-3 text-center text-gray-500">
                  No report data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* TOAST */}
      {toast.show && (
        <div
          className={`fixed top-6 right-6 z-[60] px-4 py-2 rounded-lg shadow-lg text-white ${getToastColor(
            toast.type
          )}`}
        >
          {toast.message}
        </div>
      )}

      {/* MODALS */}
      <ModalReportDetail open={detailOpen} onClose={closeDetail} data={detailData} />
      <ModalConfirmCancel
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmYes}
      />
    </div>
  );
}
