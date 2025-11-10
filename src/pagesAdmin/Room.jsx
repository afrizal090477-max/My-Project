import React, { useMemo, useState } from "react";
import { FiSearch, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import RoomCard from "../components/RoomCard";
import ModalEditRoom from "../components/ModalEditRoom";
import ModalConfirmDeleteRoom from "../components/ModalConfirmDeleteRoom";
import RoomsImage from "../assets/Rooms.png";

const DUMMY_ROOMS_BASE = [
  { id: 1, name: "Aster Room", type: "Small", capacity: 12, price: 200000 },
  { id: 2, name: "Bluebell Room", type: "Medium", capacity: 10, price: 350000 },
  { id: 3, name: "Camellia Room", type: "Large", capacity: 8, price: 250000 },
  { id: 4, name: "Daisy Room", type: "Small", capacity: 6, price: 180000 },
  { id: 5, name: "Edelweiss Room", type: "Medium", capacity: 10, price: 300000 },
  { id: 6, name: "Freesia Room", type: "Large", capacity: 5, price: 200000 },
  { id: 7, name: "Gardenia Room", type: "Small", capacity: 6, price: 180000 },
  { id: 8, name: "Hibiscus Room", type: "Medium", capacity: 8, price: 250000 },
  { id: 9, name: "Ivy Room", type: "Large", capacity: 12, price: 300000 },
  { id: 10, name: "Jasmine Room", type: "Small", capacity: 5, price: 180000 },
  { id: 11, name: "Lily Room", type: "Medium", capacity: 10, price: 250000 },
  { id: 12, name: "Magnolia Room", type: "Large", capacity: 8, price: 300000 },
  { id: 13, name: "Narcissus Room", type: "Small", capacity: 6, price: 180000 },
  { id: 14, name: "Orchid Room", type: "Medium", capacity: 10, price: 250000 },
  { id: 15, name: "Peony Room", type: "Large", capacity: 5, price: 180000 },
  { id: 16, name: "Rose Room", type: "Small", capacity: 6, price: 180000 },
  { id: 17, name: "Sunflower Room", type: "Medium", capacity: 8, price: 250000 },
  { id: 18, name: "Tulip Room", type: "Large", capacity: 12, price: 300000 },
  { id: 19, name: "Violet Room", type: "Small", capacity: 5, price: 180000 },
  { id: 20, name: "Willow Room", type: "Medium", capacity: 10, price: 250000 },
  { id: 21, name: "Xenia Room", type: "Large", capacity: 8, price: 300000 },
  { id: 22, name: "Yarrow Room", type: "Small", capacity: 6, price: 180000 },
  { id: 23, name: "Zinnia Room", type: "Medium", capacity: 10, price: 250000 },
  { id: 24, name: "Azalea Room", type: "Large", capacity: 5, price: 180000 },

];

const ITEMS_PER_PAGE = 12;

export default function Room() {
  const [rooms, setRooms] = useState(DUMMY_ROOMS_BASE);
  const [filters, setFilters] = useState({ search: "", type: "", capacity: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, room: null });
  const [currentPage, setCurrentPage] = useState(1);

  // TAMBAH STATE TOAST
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  function handleAddClick() {
    setSelectedRoom(null);
    setIsModalOpen(true);
  }
  function handleEditClick(room) {
    setSelectedRoom(room);
    setIsModalOpen(true);
  }
  function handleDeleteClick(room) {
    setDeleteModal({ open: true, room });
  }
  function handleFormSubmit(formData) {
    if (formData.id) {
      setRooms((prev) => prev.map((r) => (r.id === formData.id ? { ...formData } : r)));
    } else {
      const newRoom = {
        ...formData,
        id: Date.now(),
        image: formData.image || RoomsImage,
      };
      setRooms((prev) => [newRoom, ...prev]);
      // TAMPILKAN TOAST
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    }
    setIsModalOpen(false);
  }
  function handleDeleteConfirm() {
    setRooms((prev) => prev.filter((r) => r.id !== deleteModal.room.id));
    setDeleteModal({ open: false, room: null });
  }
  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }

  const filteredRooms = useMemo(() => {
    const search = filters.search.toLowerCase();
    const type = filters.type;
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

  function handlePrevPage() { setCurrentPage((prev) => Math.max(prev - 1, 1)); }
  function handleNextPage() { setCurrentPage((prev) => Math.min(prev + 1, totalPages)); }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* FILTER HEADER */}
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
            <option value="10">≥ 10 people</option>
            <option value="20">≥ 20 people</option>
            <option value="50">≥ 50 people</option>
          </select>
        </div>
        <button
          onClick={handleAddClick}
          className="flex items-center gap-2 bg-orange-600 text-white w-[156px] h-[48px] px-4 py-2 rounded-lg hover:bg-orange-700 transition"
        >
          <FiPlus size={18} /> Add New Room
        </button>
      </div>

      {/* GRID */}
      <div className="bg-white rounded-xl max-w-[1320px] mx-auto shadow-sm border border-gray-200 p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {roomsToDisplay.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-3">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md border ${currentPage === 1 ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-orange-50 text-orange-600"}`}
            >
              <FiChevronLeft />
            </button>
            <span className="text-gray-700 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md border ${currentPage === totalPages ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "hover:bg-orange-50 text-orange-600"}`}
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* MODAL EDIT/ADD */}
      <ModalEditRoom
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        roomData={selectedRoom}
      />
      {/* MODAL CONFIRM DELETE */}
      <ModalConfirmDeleteRoom
        isOpen={deleteModal.open}
        roomName={deleteModal.room?.name}
        onCancel={() => setDeleteModal({ open: false, room: null })}
        onConfirm={handleDeleteConfirm}
      />

      {/* TOAST SUCCESS */}
      {showSuccessToast && (
        <div className="fixed right-4 top-20 z-50">
          <div className="bg-white border border-green-400 text-green-600 px-6 py-3 rounded-md shadow-lg text-base font-semibold flex items-center gap-2">
            <svg width={22} height={22} viewBox="0 0 22 22" fill="none">
              <circle cx="11" cy="11" r="11" fill="#2ED477" />
              <path d="M6 11.8462L9.23077 15L16 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            New Room Successfully Added
            <button onClick={() => setShowSuccessToast(false)} className="ml-2 text-gray-400 hover:text-green-700">&times;</button>
          </div>
        </div>
      )}
    </div>
  );
}
