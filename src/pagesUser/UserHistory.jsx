import React, { useState } from "react";
import { FaRegEdit } from "react-icons/fa";

const dummyData = [
  { id: 1, date: "01/10/2024", roomName: "Aster Room", roomType: "Small", status: "Booked" },
  { id: 2, date: "01/10/2024", roomName: "Aster Room", roomType: "Small", status: "Paid" },
  { id: 3, date: "01/10/2024", roomName: "Aster Room", roomType: "Small", status: "Cancel" },
  // Tambahkan data dummy sesuai kebutuhan
];

const statusColors = {
  Booked: "bg-orange-400",
  Paid: "bg-green-500",
  Cancel: "bg-red-500",
};

const roomTypeOptions = ["Small", "Medium", "Large"];
const statusOptions = ["Booked", "Paid", "Cancel"];

export default function HistoryUser() {
  const [history] = useState(dummyData);
  const [filters, setFilters] = useState({
    roomType: "",
    status: "",
  });

  const filteredData = history.filter((item) => {
    const { roomType, status } = filters;
    const matchRoomType = !roomType || item.roomType === roomType;
    const matchStatus = !status || item.status === status;
    return matchRoomType && matchStatus;
  });

  return (
    <div className="p-8">
      
      <div className="flex items-center gap-3 mb-6">
        <select
          className="border rounded p-2"
          value={filters.roomType}
          onChange={(e) => setFilters((f) => ({ ...f, roomType: e.target.value }))}
        >
          <option value="">Select Room Type</option>
          {roomTypeOptions.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <select
          className="border rounded p-2"
          value={filters.status}
          onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
        >
          <option value="">Select Status</option>
          {statusOptions.map((st) => (
            <option key={st}>{st}</option>
          ))}
        </select>
        <button className="bg-[#FF7316] text-white px-4 py-2 rounded font-semibold hover:bg-orange-500">
          Search
        </button>
      </div>
      <table className="min-w-full bg-white rounded shadow">
        <thead>
          <tr>
            <th className="py-2 px-3 border-b">Date Reservation</th>
            <th className="py-2 px-3 border-b">Room Name</th>
            <th className="py-2 px-3 border-b">Room Type</th>
            <th className="py-2 px-3 border-b">Status</th>
            <th className="py-2 px-3 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item) => (
            <tr key={item.id} className="even:bg-gray-50">
              <td className="py-2 px-3">{item.date}</td>
              <td className="py-2 px-3">{item.roomName}</td>
              <td className="py-2 px-3">{item.roomType}</td>
              <td className="py-2 px-3">
                <span
                  className={
                    "px-3 py-1 rounded-full font-bold text-white " +
                    statusColors[item.status]
                  }
                >
                  {item.status}
                </span>
              </td>
              <td className="py-2 px-3">
                <button
                  className="text-[#FF7316] hover:scale-110 transition"
                  title="View/Detail/Modify"
                >
                  <FaRegEdit size={20} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-6 flex gap-1 justify-end">
        <button className="px-3 py-1 rounded bg-gray-200 mx-1 hover:bg-gray-300">1</button>
        <button className="px-3 py-1 rounded bg-gray-200 mx-1 hover:bg-gray-300">2</button>
      </div>
    </div>
  );
}
