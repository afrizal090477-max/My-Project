import React, { useState } from "react";

const REPORT_DATA = [
  {
    id: 1,
    date: "01/10/2024",
    roomName: "Aster Room",
    roomType: "Small",
    status: "Booked",
  },
  {
    id: 2,
    date: "01/10/2024",
    roomName: "Aster Room",
    roomType: "Small",
    status: "Paid",
  },
  {
    id: 3,
    date: "01/10/2024",
    roomName: "Aster Room",
    roomType: "Small",
    status: "Cancel",
  },
  {
    id: 4,
    date: "01/10/2024",
    roomName: "Aster Room",
    roomType: "Small",
    status: "Paid",
  },
];

const getStatusClass = (status) => {
  switch (status) {
    case "Booked":
      return "bg-[#FFEFE1] text-[#FF7316]";
    case "Paid":
      return "bg-[#E7F9EE] text-[#00B23B]";
    case "Cancel":
      return "bg-[#FFE1E1] text-[#E70000]";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

export default function Report() {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const handleCancelClick = (report) => {
    setSelectedReport(report);
    setShowCancelModal(true);
  };

  const handleDetailClick = (report) => {
    setSelectedReport(report);
    setShowDetailModal(true);
  };

  const handleCancelConfirm = () => {
    setShowCancelModal(false);
    alert("Reservation canceled successfully!");
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold">Report</h1>
      </header>

      {/* Filter Section */}
      <div className="bg-white flex flex-wrap md:flex-nowrap justify-between items-center gap-4 border border-gray-200 rounded-xl px-5 py-4 shadow-sm">
        <div className="flex flex-wrap md:flex-nowrap gap-3 items-center w-full">
          {/* Start Date */}
          <div className="relative w-full md:w-48">
            <label
              htmlFor="startDate"
              className="block text-sm text-gray-600 mb-1"
            >
              Start Date
            </label>
            <input
              id="startDate"
              type="date"
              className="border border-gray-300 rounded-md pl-3 pr-3 py-2 text-gray-700 text-sm w-full focus:ring-1 focus:ring-[#FF7316] focus:outline-none"
            />
          </div>

          {/* End Date */}
          <div className="relative w-full md:w-48">
            <label htmlFor="endDate" className="block text-sm text-gray-600 mb-1">
              End Date
            </label>
            <input
              id="endDate"
              type="date"
              className="border border-gray-300 rounded-md pl-3 pr-3 py-2 text-gray-700 text-sm w-full focus:ring-1 focus:ring-[#FF7316] focus:outline-none"
            />
          </div>

          {/* Room Type */}
          <div className="relative w-full md:w-48">
            <label
              htmlFor="roomType"
              className="block text-sm text-gray-600 mb-1"
            >
              Room Type
            </label>
            <select
              id="roomType"
              className="border border-gray-300 rounded-md pl-3 pr-3 py-2 text-gray-700 text-sm w-full focus:ring-1 focus:ring-[#FF7316] focus:outline-none"
            >
              <option value="">Select Room Type</option>
              <option value="Small">Small</option>
              <option value="Medium">Medium</option>
              <option value="Large">Large</option>
            </select>
          </div>

          {/* Status */}
          <div className="relative w-full md:w-48">
            <label htmlFor="status" className="block text-sm text-gray-600 mb-1">
              Status
            </label>
            <select
              id="status"
              className="border border-gray-300 rounded-md pl-3 pr-3 py-2 text-gray-700 text-sm w-full focus:ring-1 focus:ring-[#FF7316] focus:outline-none"
            >
              <option value="">Select Status</option>
              <option value="Booked">Booked</option>
              <option value="Paid">Paid</option>
              <option value="Cancel">Cancel</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex items-end gap-3">
            <button className="bg-[#FF7316] text-white px-4 py-2 rounded-md hover:bg-[#e76712] transition">
              Search
            </button>
            <button className="border border-[#FF7316] text-[#FF7316] px-3 py-2 rounded-md hover:bg-[#FFF5EF] transition">
              ⬇ Export
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">
                Date Reservation
              </th>
              <th className="py-3 px-4 text-left font-semibold">Room Name</th>
              <th className="py-3 px-4 text-left font-semibold">Room Type</th>
              <th className="py-3 px-4 text-left font-semibold">Status</th>
              <th className="py-3 px-4 text-left font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {REPORT_DATA.map((item) => (
              <tr
                key={item.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition"
              >
                <td className="py-3 px-4">{item.date}</td>
                <td className="py-3 px-4 font-medium">{item.roomName}</td>
                <td className="py-3 px-4">{item.roomType}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-[3px] rounded-full text-xs font-medium ${getStatusClass(
                      item.status
                    )}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleDetailClick(item)}
                    className="text-[#FF7316] hover:text-[#e76712]"
                  >
                    <i className="ri-edit-box-line text-lg"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[380px] text-center">
            <div className="text-red-600 text-5xl mb-3">✖</div>
            <p className="text-gray-800 font-medium mb-5">
              Are you sure want to cancel reservation?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowCancelModal(false)}
                className="border border-gray-300 px-5 py-2 rounded-md hover:bg-gray-100 transition"
              >
                No
              </button>
              <button
                onClick={handleCancelConfirm}
                className="bg-red-600 text-white px-5 py-2 rounded-md hover:bg-red-700 transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedReport && (
        <div className="fixed inset-0 bg-black/30 flex justify-end items-center z-50">
          <div className="bg-white w-[400px] h-full shadow-xl overflow-y-auto p-6">
            <div className="flex justify-between items-center border-b pb-3 mb-4">
              <h2 className="font-semibold text-lg">Reservation Details</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 text-sm">
              <section>
                <h3 className="font-semibold mb-2 text-gray-700">
                  Room Details
                </h3>
                <p>Room Name: {selectedReport.roomName}</p>
                <p>Room Type: {selectedReport.roomType}</p>
                <p>Capacity: 10 people</p>
                <p>Price/hour: Rp 100.000</p>
              </section>

              <section>
                <h3 className="font-semibold mb-2 text-gray-700">
                  Personal Data
                </h3>
                <p>Name: Angela Thomas</p>
                <p>No.Hp: 085 123 456 789</p>
                <p>Company: PT Maju Jaya</p>
                <p>Reservation Date: {selectedReport.date}</p>
                <p>Participants: 8 people</p>
              </section>

              <section>
                <h3 className="font-semibold mb-2 text-gray-700">
                  Snack Details
                </h3>
                <p>Snack Category: Lunch</p>
                <p>Package: Lunch Package 1 - Rp 20.000/box</p>
              </section>

              <section>
                <h3 className="font-semibold mb-2 text-gray-700">Total</h3>
                <p>Room: Rp 200.000</p>
                <p>Snack: Rp 160.000</p>
                <p className="font-bold text-right text-lg">Rp 360.000</p>
              </section>

              <section className="flex justify-between mt-6">
                <button
                  onClick={() => handleCancelClick(selectedReport)}
                  className="border border-red-500 text-red-600 px-4 py-2 rounded-md hover:bg-red-50 transition"
                >
                  Cancel Reservation
                </button>
                <button className="bg-[#FF7316] text-white px-5 py-2 rounded-md hover:bg-[#e76712] transition">
                  Pay
                </button>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
