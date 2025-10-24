import React, { useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import { FiCornerUpRight, FiCalendar, FiDownload } from "react-icons/fi";
import "react-datepicker/dist/react-datepicker.css";
import PropTypes from "prop-types";

// === Custom Date Picker With Border ===
const CustomInput = forwardRef(({ value, onClick, placeholder, id }, ref) => (
  <button
    id={id}
    type="button"
    onClick={onClick}
    ref={ref}
    className="flex items-center justify-between w-[257px] h-[48px] border border-gray-300 rounded-[10px] px-[14px] bg-white text-left text-gray-700 placeholder:text-gray-400"
    style={{ opacity: 1 }}
  >
    <span className={value ? "" : "text-gray-400"}>{value || placeholder}</span>
    <FiCalendar className="ml-2 text-gray-400" size={20} />
  </button>
));
CustomInput.displayName = "CustomInput";
CustomInput.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  id: PropTypes.string,
};

function DateInput({ id, selectedDate, onChange, placeholder }) {
  return (
    <DatePicker
      selected={selectedDate}
      onChange={onChange}
      customInput={<CustomInput id={id} placeholder={placeholder} />}
      dateFormat="dd/MM/yyyy"
      wrapperClassName="w-[257px]"
    />
  );
}
DateInput.propTypes = {
  id: PropTypes.string,
  selectedDate: PropTypes.instanceOf(Date),
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default function UserHistory() {
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    roomType: "",
    status: "",
  });
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const DUMMY_DATA = [
    { date: "01/10/2024", room: "Aster Room", type: "Small", status: "Booked" },
    { date: "01/10/2024", room: "Aster Room", type: "Small", status: "Paid" },
    { date: "02/10/2024", room: "Tulip Room", type: "Medium", status: "Paid" },
    { date: "03/15/2024", room: "Daisy", type: "Large", status: "Cancel" },
    { date: "04/01/2024", room: "Bluebell", type: "Small", status: "Paid" },
    { date: "04/10/2024", room: "Camellia", type: "Medium", status: "Paid" },
    { date: "04/11/2024", room: "Bluebell", type: "Large", status: "Booked" },
    { date: "04/12/2024", room: "Bluebell", type: "Large", status: "Paid" },
    { date: "05/01/2024", room: "Tulip Room", type: "Small", status: "Paid" },
    { date: "05/02/2024", room: "Tulip Room", type: "Small", status: "Cancel" },
    { date: "05/03/2024", room: "Aster Room", type: "Small", status: "Paid" },
    { date: "05/04/2024", room: "Aster Room", type: "Small", status: "Paid" },
  ];

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
  const pagedData = filteredData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

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
    const content = filteredData.map(
      (row) => `${row.date},${row.room},${row.type},${row.status}`
    ).join("\n");
    const blob = new Blob([header + content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "UserHistory.txt";
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const getStatusStyle = (status) => {
    if (status === "Booked") return "bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-bold";
    if (status === "Paid") return "bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold";
    if (status === "Cancel") return "bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs font-bold";
    return "";
  };

  return (
    <div className="p-6 bg-[#F9FAFB] min-h-screen">
      {/* === FILTER BAR === */}
      <div className="bg-white rounded-xl shadow-md w-full max-w-[1320px] min-h-[114px] p-4 mb-6 flex gap-4 items-end justify-between">
        <div className="flex gap-4 flex-1 items-end">
          <div>
            <label htmlFor="startDate" className="block text-sm text-gray-600 mb-1">Start Date</label>
            <DateInput
              id="startDate"
              selectedDate={filters.startDate}
              onChange={(date) => setFilters(f => ({ ...f, startDate: date }))}
              placeholder="Start date"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm text-gray-600 mb-1">End Date</label>
            <DateInput
              id="endDate"
              selectedDate={filters.endDate}
              onChange={(date) => setFilters(f => ({ ...f, endDate: date }))}
              placeholder="End date"
            />
          </div>
          <div>
            <label htmlFor="roomType" className="block text-sm text-gray-600 mb-1">Room Type</label>
            <select
              id="roomType"
              name="roomType"
              value={filters.roomType}
              onChange={handleFilters}
              className="border border-gray-300 rounded-[10px] w-[257px] h-[48px] px-[14px] text-gray-700"
            >
              <option value="" className="text-gray-300">Room Type</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>
          <div>
            <label htmlFor="status" className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleFilters}
              className="border border-gray-300 rounded-[10px] w-[257px] h-[48px] px-[14px] text-gray-700"
            >
              <option value="" className="text-gray-300">Status</option>
              <option value="Booked">Booked</option>
              <option value="Paid">Paid</option>
              <option value="Cancel">Cancel</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSearch}
            className="w-[119px] h-[48px] rounded-lg bg-[#FF7316] text-white text-lg font-semibold shadow hover:bg-[#e86810] transition"
          >
            Search
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center justify-center w-[48px] h-[48px] bg-[#F71F1F] hover:bg-red-600 rounded-lg"
            title="Download"
          >
            <FiDownload size={22} className="text-white" />
          </button>
        </div>
      </div>
      {/* === TABEL === */}
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
            {pagedData.map((row, idx) => (
              <tr key={idx} className="border-b hover:bg-gray-50">
                <td className="p-3">{row.date}</td>
                <td className="p-3">{row.room}</td>
                <td className="p-3">{row.type}</td>
                <td className="p-3">
                  <span className={getStatusStyle(row.status)}>{row.status}</span>
                </td>
                <td className="p-3 text-center">
                  <button className="text-orange-500 hover:text-orange-600" title="Detail">
                    <FiCornerUpRight size={20} />
                  </button>
                </td>
              </tr>
            ))}
            {pagedData.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center text-gray-400 p-6">No data found.</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* PAGINATION & SHOW ENTRIES */}
        <div className="flex flex-col md:flex-row items-center justify-between mt-3">
          <div className="mb-2 md:mb-0">
            <label className="text-sm mr-2">Show:</label>
            <select
              value={rowsPerPage}
              onChange={handleRowsPerPageChange}
              className="border rounded px-2 py-1"
            >
              {[10, 25, 50, 100].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
            <span className="ml-2">Entries</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}
                    className={`p-2 rounded-full ${currentPage === 1 ? "bg-gray-200 text-gray-400" : "bg-white text-orange-500"}`}>{'<'}</button>
            {[...Array(totalPages)].map((_, i) => (
              <button key={i + 1} onClick={() => handlePageChange(i + 1)}
                      className={`p-2 rounded-full w-8 h-8 ${currentPage === i + 1 ? "bg-orange-400 text-white" : "bg-white text-orange-500"}`}>{i + 1}</button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}
                    className={`p-2 rounded-full ${currentPage === totalPages ? "bg-gray-200 text-gray-400" : "bg-white text-orange-500"}`}>{'>'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
