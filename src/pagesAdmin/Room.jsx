import React, { useEffect, useState } from "react";
import { FiSearch, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import RoomCard from "../components/RoomCard";
import ModalEditRoom from "../components/ModalEditRoom";
import ModalConfirmDeleteRoom from "../components/ModalConfirmDeleteRoom";
import RoomsImage from "../assets/Rooms.png";
import { fetchRooms, addRoom, updateRoom, deleteRoom } from "../API/roomAPI";
import RoomDetailDemoAdmin from "../components/RoomDetailDemoAdmin";

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
  { value: "20", label: "20 People" },
  { value: "30", label: "30 People" },
];

export default function Room() {
  const [rooms, setRooms] = useState([]);
  const [filters, setFilters] = useState({ search: "", type: "", capacity: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ open: false, room: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRooms = async () => {
      setLoading(true);
      try {
        const params = {
          room_type: filters.type,
          capacity: filters.capacity,
          page: currentPage - 1,
          limit: ITEMS_PER_PAGE,
        };
        const data = await fetchRooms(params);
        let apiRooms = data.data || [];
        apiRooms = apiRooms.map((room) => ({
          ...room,
          id: room.id,
          // -------------- PERBAIKAN DISINI: mapping nama dari "room_name"
          name: room.room_name || room.name || "-",
          type: room.room_type || room.type || "",
          image: room.image || RoomsImage,
          capacity: typeof room.capacity === "undefined" ? "-" : room.capacity,
          price: room.price || 0,
        }));

        if (filters.search) {
          const src = filters.search.toLowerCase();
          apiRooms = apiRooms.filter((room) =>
            room.name.toLowerCase().includes(src)
          );
        }
        setRooms(apiRooms);
        setTotalPages(Math.ceil((data.total || apiRooms.length) / ITEMS_PER_PAGE) || 1);
      } catch (error) {
        console.error("Failed to load rooms", error);
      }
      setLoading(false);
    };
    loadRooms();
  }, [filters, currentPage]);

  function handleAddClick() {
    setSelectedRoom(null);
    setIsModalOpen(true);
  }

  function handleEditClick(room) {
    setSelectedRoom(room);
    setIsModalOpen(true);
  }

  async function handleFormSubmit(formData) {
    setLoading(true);
    try {
      if (formData.id) {
        await updateRoom(formData.id, formData);
        setRooms((prev) =>
          prev.map((r) => (r.id === formData.id ? { ...formData } : r))
        );
      } else {
        const roomToAdd = { ...formData, image: formData.image || RoomsImage };
        const newRoom = await addRoom(roomToAdd);
        setRooms((prev) => [newRoom, ...prev]);
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
      }
    } catch (error) {
      console.error("Failed to save room", error);
    }
    setIsModalOpen(false);
    setLoading(false);
  }

  async function handleDeleteConfirm() {
    setLoading(true);
    try {
      if (deleteModal.room?.id) {
        await deleteRoom(deleteModal.room.id);
        setRooms((prev) => prev.filter((r) => r.id !== deleteModal.room.id));
      }
    } catch (error) {
      console.error("Failed to delete room", error);
    }
    setDeleteModal({ open: false, room: null });
    setLoading(false);
  }

  function handleDeleteClick(room) {
    setDeleteModal({ open: true, room });
  }

  function handleFilterChange(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }

  function handlePrevPage() {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  }

  function handleNextPage() {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  }

  const roomsToDisplay = rooms;

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <RoomDetailDemoAdmin />
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
            {STATIC_ROOM_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          <select
            value={filters.capacity}
            onChange={(e) => handleFilterChange("capacity", e.target.value)}
            className="border border-gray-300 rounded-lg w-[280px] h-[48px] px-4 py-2 bg-white text-gray-700 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          >
            <option value="">Capacity</option>
            {STATIC_CAPACITIES.map((cap) => (
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
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-6 gap-3">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md border ${
                currentPage === 1
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-orange-50 text-orange-600"
              }`}
            >
              <FiChevronLeft />
            </button>
            <span className="text-gray-700 text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md border ${
                currentPage === totalPages
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "hover:bg-orange-50 text-orange-600"
              }`}
            >
              <FiChevronRight />
            </button>
          </div>
        )}
      </div>
      <ModalEditRoom
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        roomData={selectedRoom}
        roomTypes={STATIC_ROOM_TYPES}
        capacities={STATIC_CAPACITIES}
      />
      <ModalConfirmDeleteRoom
        isOpen={deleteModal.open}
        roomName={deleteModal.room?.name}
        onCancel={() => setDeleteModal({ open: false, room: null })}
        onConfirm={handleDeleteConfirm}
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
