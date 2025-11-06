// src/pagesAdmin/Room.jsx
import React, { useMemo, useState } from "react";
import { FiSearch, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import RoomCard from "../components/RoomCard";
import ModalRoomForm from "../components/ModalRoomForm";
import RoomsImage from "../assets/Rooms.png";

const DUMMY_ROOMS_BASE = [
  { id: 1, name: "Aster Room", type: "Small", capacity: 12, price: 200000, status: "Available" },
  { id: 2, name: "Bluebell Room", type: "Medium", capacity: 10, price: 350000, status: "Booked" },
  { id: 3, name: "Camellia Room", type: "Small", capacity: 18, price: 250000, status: "Available" },
  { id: 4, name: "Daisy Room", type: "Medium", capacity: 22, price: 300000, status: "Available" },
  { id: 5, name: "Edelweiss Room", type: "Large", capacity: 20, price: 450000, status: "Booked" },
  { id: 6, name: "Freesia Room", type: "Small", capacity: 15, price: 180000, status: "Available" },
  { id: 7, name: "Gardenia Room", type: "Medium", capacity: 15, price: 320000, status: "Booked" },
  { id: 8, name: "Hibiscus Room", type: "Large", capacity: 25, price: 500000, status: "Available" },
  { id: 9, name: "Ivy Room", type: "Small", capacity: 6, price: 200000, status: "Booked" },
  { id: 10, name: "Jasmine Room", type: "Medium", capacity: 12, price: 350000, status: "Available" },
  { id: 11, name: "Lily Room", type: "Large", capacity: 38, price: 400000, status: "Available" },
  { id: 12, name: "Magnolia Room", type: "Small", capacity: 7, price: 220000, status: "Booked" },
  { id: 13, name: "Narcissus Room", type: "Medium", capacity: 20, price: 330000, status: "Available" },
  { id: 14, name: "Orchid Room", type: "Large", capacity: 32, price: 480000, status: "Available" },
  { id: 15, name: "Peony Room", type: "Small", capacity: 6, price: 210000, status: "Booked" },
  { id: 16, name: "Rose Room", type: "Medium", capacity: 24, price: 340000, status: "Available" },
  { id: 17, name: "Sunflower Room", type: "Large", capacity: 30, price: 550000, status: "Booked" },
  { id: 18, name: "Tulip Room", type: "Small", capacity: 11, price: 240000, status: "Available" },
  { id: 19, name: "Violet Room", type: "Medium", capacity: 12, price: 350000, status: "Available" },
  { id: 20, name: "Willow Room", type: "Large", capacity: 25, price: 480000, status: "Booked" },
  { id: 21, name: "Xenia Room", type: "Small", capacity: 11, price: 200000, status: "Available" },
  { id: 22, name: "Yarrow Room", type: "Medium", capacity: 12, price: 340000, status: "Booked" },
  { id: 23, name: "Zinnia Room", type: "Large", capacity: 30, price: 470000, status: "Available" },
  { id: 24, name: "Azalea Room", type: "Small", capacity: 13, price: 230000, status: "Available" },
];

const ITEMS_PER_PAGE = 12;

export default function Rooms() {
  const [rooms, setRooms] = useState(DUMMY_ROOMS_BASE);
  const [filters, setFilters] = useState({ search: "", type: "", capacity: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleAddClick = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (room) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (formData) => {
    if (formData.id) {
      setRooms((prev) => prev.map((r) => (r.id === formData.id ? { ...formData } : r)));
    } else {
      const newRoom = {
        ...formData,
        id: Date.now(),
        status: "Available",
        image: formData.image || RoomsImage,
      };
      setRooms((prev) => [newRoom, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleFilterChange = (key, value) => {
    // Normalisasi capacity ke number string tetap ok, tapi kita reset page
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredRooms = useMemo(() => {
    const search = filters.search.toLowerCase();
    const type = filters.type; // bisa di-lowercase jika tipe akan non-standar
    const minCapacity = filters.capacity ? parseInt(filters.capacity, 10) : null;

    return rooms.filter((room) => {
      const matchSearch = room.name.toLowerCase().includes(search);
      const matchType = type ? room.type === type : true;
      const matchCapacity = minCapacity !== null ? room.capacity >= minCapacity : true;
      return matchSearch && matchType && matchCapacity;
    });
  }, [rooms, filters]);

  const totalPages = Math.ceil(filteredRooms.length / ITEMS_PER_PAGE) || 1;
  const roomsToDisplay = filteredRooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePrevPage = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 max-w-[1320px] mx-auto p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-4 items-center flex-1">
          <div className="relative flex-1 min-w-[280px] max-w-[362px]">
            <input
              type="text"
              placeholder="Search room..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full h-[48px] pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
            <FiSearch className="absolute left-3 top-3 text-gray-400" size={18} />
          </div>

          <select
            value={filters.type}
            onChange={(e) => handleFilterChange("type", e.target.value)}
            className="border border-gray-300 rounded-lg w-[280px] h-[48px] px-4 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          >
            <option value="">Room Type</option>
            <option value="Small">Small</option>
            <option value="Medium">Medium</option>
            <option value="Large">Large</option>
          </select>

          <select
            value={filters.capacity}
            onChange={(e) => handleFilterChange("capacity", e.target.value)}
            className="border border-gray-300 rounded-lg w-[280px] h-[48px] px-4 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          >
            <option value="">Capacity</option>
            <option value="10">≤ 10 people</option>
            <option value="20">≤ 20 people</option>
            <option value="50">≤ 50 people</option>
          </select>

          
        </div>

        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-orange-600 text-white w-[156px] h-[48px] px-4 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          <FiPlus size={18} /> Add New Room
        </button>
      </div>

      <div className="bg-white rounded-xl max-w-[1320px] mx-auto shadow-sm border border-gray-200 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {roomsToDisplay.map((room) => (
            <RoomCard key={room.id} room={room} onEdit={handleEditClick} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-3">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md border ${
                currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-orange-50 text-orange-600"
              }`}
            >
              <FiChevronLeft />
            </button>
            <span className="text-gray-700 text-sm">Page {currentPage} of {totalPages}</span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md border ${
                currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-orange-50 text-orange-600"
              }`}
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>

      {isModalOpen && (
        <ModalRoomForm
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
          roomData={selectedRoom}
        />
      )}
    </div>
  );
}
