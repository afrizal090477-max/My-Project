import React, { useEffect, useState } from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import ManageRoom from "../components/ManageRoom";
import ModalEditRoom from "../components/ModalEditRoom";
import RoomDetailDemoAdmin from "../components/RoomDetailDemoAdmin";
import RoomsImage from "../assets/Rooms.png";
import { fetchRooms, addRoom, updateRoom } from "../API/roomAPI";

const ITEMS_PER_PAGE = 12;
const STATIC_ROOM_TYPES = [
  { value: "small", label: "Small" },
  { value: "medium", label: "Medium" },
  { value: "large", label: "Large" },
];
const STATIC_CAPACITIES = [
  { value: "4", label: "4 People" },
  { value: "8", label: "8 People" },
  { value: "12", label: "12 People" },
  { value: "14", label: "14 People" },
  { value: "20", label: "20 People" },
  { value: "30", label: "30 People" },
];

export default function Room() {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    capacity: "",
  });
  const [capacities, setCapacities] = useState(STATIC_CAPACITIES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setCapacities(STATIC_CAPACITIES);
  }, []);

  // Fungsi loadRooms sekarang menerima page dan membaca pagination dari BE
  const loadRooms = async (page = 1) => {
    setLoading(true);
    try {
      const params = {
        room_type: filters.type,
        page,
        limit: ITEMS_PER_PAGE,
      };
      const data = await fetchRooms(params);

      let apiRooms = data.data || data.data?.data || [];
      apiRooms = apiRooms.map((room) => ({
        ...room,
        id: room.id,
        name: room.room_name || room.name || "-",
        type: room.room_type || room.type || "",
        image: room.image || RoomsImage,
        capacity:
          typeof room.capacity === "undefined" ? "-" : room.capacity,
        price: room.price || 0,
      }));

      // Filter capacity di FE
      if (filters.capacity) {
        apiRooms = apiRooms.filter(
          (room) => String(room.capacity) === String(filters.capacity)
        );
      }

      // Filter search di FE
      if (filters.search) {
        const src = filters.search.toLowerCase();
        apiRooms = apiRooms.filter((room) =>
          room.name.toLowerCase().includes(src)
        );
      }

      setRooms(apiRooms);

      const totalFromApi =
        data.total ||
        data.pagination?.totalItems ||
        data.pagination?.total ||
        apiRooms.length;

      const totalPages =
        Math.ceil(totalFromApi / ITEMS_PER_PAGE) || 1;

      setPagination({
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      console.error("Failed to load rooms", error);
      setRooms([]);
      setPagination({ currentPage: 1, totalPages: 1 });
    }
    setLoading(false);
  };

  // Load awal & setiap filter berubah → reset ke page 1
  useEffect(() => {
    loadRooms(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  function handleAddClick() {
    setSelectedRoom(null);
    setIsModalOpen(true);
  }

  function handleEditRoom(room) {
    setSelectedRoom(room);
    setIsModalOpen(true);
  }

  async function handleFormSubmit(formData) {
    setLoading(true);
    try {
      const dataToSend = new FormData();
      dataToSend.append("room_name", formData.name);
      dataToSend.append("room_type", formData.type);
      dataToSend.append("price", formData.price);
      dataToSend.append("capacity", formData.capacity);
      if (formData.file) {
        dataToSend.append("image", formData.file);
      }

      if (formData.id) {
        await updateRoom(formData.id, dataToSend, true);
        // setelah edit, reload page aktif supaya data konsisten dengan BE
        await loadRooms(pagination.currentPage);
      } else {
        await addRoom(dataToSend, true);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
        // setelah tambah, idealnya pindah ke page 1 atau reload page aktif
        await loadRooms(1);
      }
    } catch (error) {
      console.error("Failed to save room", error);
      alert("Failed to save room!");
    }
    setIsModalOpen(false);
    setLoading(false);
  }

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <RoomDetailDemoAdmin />

      {/* Filter & Add */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-[1320px] mx-auto p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4 items-center flex-1">
          <div className="relative flex-1 min-w-[280px] max-w-[362px]">
            <input
              type="text"
              placeholder="Search room..."
              value={filters.search}
              onChange={(e) =>
                handleFilterChange("search", e.target.value)
              }
              className="w-full h-[48px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <FiSearch
              className="absolute left-3 top-3 text-gray-400"
              size={18}
            />
          </div>
          <select
            value={filters.type}
            onChange={(e) =>
              handleFilterChange("type", e.target.value)
            }
            className="border border-gray-300 rounded-lg w-[280px] h-[48px] px-4 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          >
            <option value="">Room Type</option>
            {STATIC_ROOM_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <select
            value={filters.capacity}
            onChange={(e) =>
              handleFilterChange("capacity", e.target.value)
            }
            className="border border-gray-300 rounded-lg w-[280px] h-[48px] px-4 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          >
            <option value="">Capacity</option>
            {capacities.map((cap) => (
              <option key={cap.value} value={cap.value}>
                {cap.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-orange-600 text-white w-[156px] h-[48px] px-4 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          <FiPlus size={18} /> Add New Room
        </button>
      </div>

      {/* ManageRoom sekarang pakai pagination dari BE */}
      <ManageRoom
        rooms={rooms}
        fetchRooms={loadRooms}
        onEditRoom={handleEditRoom}
        pagination={pagination}
        loading={loading}
      />

      <ModalEditRoom
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        roomData={selectedRoom}
        afterSubmit={handleFormSubmit}
      />

      {showSuccessToast && (
        <div className="fixed right-4 top-20 z-50">
          <div className="bg-white border border-green-400 text-green-600 px-6 py-3 rounded-md shadow-lg text-base font-semibold flex items-center gap-2">
            <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="11" fill="#2ED477" />
              <path
                d="M6 11.8462L9.23077 15L16 8"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            New Room Successfully Added
            <button
              onClick={() => setShowSuccessToast(false)}
              className="ml-2 text-gray-400 hover:text-green-700"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
