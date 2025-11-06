import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import { FiCornerUpRight, FiCalendar, FiDownload } from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";
import ModalReportDetail from "../components/ModalReportDetail";

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

const DUMMY_DATA = [
  {
    id: 1,
    date: "01/10/2024",
    room: "Aster Room",
    type: "Small",
    status: "Booked",
  },
  {
    id: 2,
    date: "01/10/2024",
    room: "Aster Room",
    type: "Small",
    status: "Paid",
  },
  {
    id: 3,
    date: "01/10/2024",
    room: "Aster Room",
    type: "Small",
    status: "Cancel",
  },
  {
    id: 4,
    date: "01/10/2024",
    room: "Aster Room",
    type: "Small",
    status: "Paid",
  },
  {
    id: 5,
    date: "02/10/2024",
    room: "Tulip Room",
    type: "Medium",
    status: "Booked",
  },
  { id: 6, date: "03/15/2024", room: "Daisy", type: "Large", status: "Cancel" },
  {
    id: 7,
    date: "04/01/2024",
    room: "Bluebell",
    type: "Small",
    status: "Paid",
  },
  {
    id: 8,
    date: "04/10/2024",
    room: "Camellia",
    type: "Medium",
    status: "Paid",
  },
  {
    id: 9,
    date: "05/01/2024",
    room: "Tulip Room",
    type: "Small",
    status: "Paid",
  },
];

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

  const filteredData = DUMMY_DATA.filter((item) => {
    let valid = true;
    if (filters.startDate) {
      const start = new Date(filters.startDate);
      const d = new Date(item.date.split("/").reverse().join("-"));
      valid = valid && d >= start;
    }
    if (filters.endDate) {
      const end = new Date(filters.endDate);
      const d = new Date(item.date.split("/").reverse().join("-"));
      valid = valid && d <= end;
    }
    if (filters.roomType) valid = valid && item.type === filters.roomType;
    if (filters.status) valid = valid && item.status === filters.status;
    return valid;
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const pagedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
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

  const handleSearch = () => setCurrentPage(1);

  const handleDownload = () => {
    const header = "Date,Room,Type,Status\n";
    const content = filteredData
      .map((row) => `${row.date},${row.room},${row.type},${row.status}`)
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

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const openDetail = (row) => {
    setDetailData(row);
    setDetailOpen(true);
  };

  const closeDetail = () => {
    setDetailData(null);
    setDetailOpen(false);
  };

  return (
    <div className="p-8 bg-[#F9FAFB] min-h-screen">
      <div className="bg-white rounded-xl shadow-md max-w-[1320px] min-h-[114px] mx-auto p-6 mb-6">
        <div className="flex gap-6 items-end">
          <div className="flex flex-col w-[257px]">
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
          <div className="flex flex-col w-[257px]">
            <label
              htmlFor="endDate"
              className="block text-sm text-gray-600 mb-1"
            >
              End Date
            </label>
            <DateInput
              id="endDate"
              selectedDate={filters.endDate}
              onChange={(date) => setFilters((f) => ({ ...f, endDate: date }))}
              placeholder="End date"
            />
          </div>
          <div className="flex flex-col w-[257px]">
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
              className="border border-gray-300 rounded-[10px] w-full h-[48px] px-[14px] text-gray-700"
            >
              <option value="">Type</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>
          <div className="flex flex-col w-[257px]">
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
              className="border border-gray-300 rounded-[10px] w-full h-[48px] px-[14px] text-gray-700"
            >
              <option value="">Status</option>
              <option value="Booked">Booked</option>
              <option value="Paid">Paid</option>
              <option value="Cancel">Cancel</option>
            </select>
          </div>
          <div className="flex gap-2 items-end ml-2">
            
            <button
              onClick={handleDownload}
              className="
              w-[48px] h-[48px] flex items-center justify-center
              border-2 !border-orange-500 rounded-xl
              bg-transparent
              transition
              group
              hover:border-orange-600
              focus:outline-none"
              title="Download"
            >
              <FiDownload className="w-7 h-7 text-orange-500 transition group-hover:text-orange-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 max-w-[1320px] mx-auto">
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
            {pagedData.map((row) => (
              <tr key={row.id} className="border-b hover:bg-gray-50">
                <td className="p-3">{row.date}</td>
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
            ))}
            {pagedData.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center text-gray-400 p-6">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex flex-col md:flex-row items-center justify-between mt-4">
          <div className="mb-2 md:mb-0">
            <label htmlFor="rowsPerPageSelect" className="text-sm mr-2">
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
          {/* Page Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-full ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400"
                  : "bg-white text-orange-500"
              }`}
            >
              {"<"}
            </button>
            {pageNumbers.map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`p-2 rounded-full w-8 h-8 ${
                  currentPage === pageNum
                    ? "bg-orange-400 text-white"
                    : "bg-white text-orange-500"
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-full ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400"
                  : "bg-white text-orange-500"
              }`}
            >
              {">"}
            </button>
          </div>
        </div>
      </div>
      <ModalReportDetail
        open={detailOpen}
        onClose={closeDetail}
        data={detailData}
      />
    </div>
  );
}
