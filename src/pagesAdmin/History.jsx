import React, { useState, useEffect } from "react";
import { FaRegEdit } from "react-icons/fa";
import instance from "../API/http"; // Pastikan import instance sesuai setup-mu
// import { useAuth } from "../context/AuthContext"; // Jika perlu token

const statusColors = {
  Booked: "bg-orange-400",
  Paid: "bg-green-500",
  Cancel: "bg-red-500",
};

const roomTypeOptions = ["Small", "Medium", "Large"];
const statusOptions = ["Booked", "Paid", "Cancel"];

export default function History() {
  // const { token } = useAuth(); // Jika pakai auth context
  const [history, setHistory] = useState([]);
  const [filters, setFilters] = useState({
    roomType: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch data dari API
  const fetchHistory = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await instance.get("/history", {
        params: {
          roomType: filters.roomType,
          status: filters.status,
        },
        // headers: { Authorization: `Bearer ${token}` }, // Jika protected
      });
      setHistory(res.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal fetch data history");
      setHistory([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchHistory();
    // eslint-disable-next-line
  }, [filters.roomType, filters.status]); // Fetch setiap filter berubah

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">History</h1>
      <div className="flex items-center gap-3 mb-6">
        <select
          className="border rounded p-2"
          value={filters.roomType}
          onChange={(e) =>
            setFilters((f) => ({ ...f, roomType: e.target.value }))
          }
        >
          <option value="">Select Room Type</option>
          {roomTypeOptions.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <select
          className="border rounded p-2"
          value={filters.status}
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value }))
          }
        >
          <option value="">Select Status</option>
          {statusOptions.map((st) => (
            <option key={st}>{st}</option>
          ))}
        </select>
        <button
          className="bg-[#FF7316] text-white px-4 py-2 rounded font-semibold hover:bg-orange-500"
          onClick={fetchHistory}
          disabled={loading}
        >
          Search
        </button>
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
      )}
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
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center py-10 text-gray-500">
                Loading...
              </td>
            </tr>
          ) : history.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-10 text-gray-400">
                No history data found.
              </td>
            </tr>
          ) : (
            history.map((item) => (
              <tr key={item.id} className="even:bg-gray-50">
                <td className="py-2 px-3">{item.date}</td>
                <td className="py-2 px-3">{item.roomName}</td>
                <td className="py-2 px-3">{item.roomType}</td>
                <td className="py-2 px-3">
                  <span
                    className={`px-3 py-1 rounded-full font-bold text-white ${
                      statusColors[item.status]
                    }`}
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
            ))
          )}
        </tbody>
      </table>
      <div className="mt-6 flex gap-1 justify-end">
        <button className="px-3 py-1 rounded bg-gray-200 mx-1 hover:bg-gray-300">
          1
        </button>
        <button className="px-3 py-1 rounded bg-gray-200 mx-1 hover:bg-gray-300">
          2
        </button>
      </div>
    </div>
  );
}
