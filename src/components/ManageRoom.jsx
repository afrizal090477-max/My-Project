import React, { useState } from "react";
import RoomCard from "./RoomCard";
import ModalConfirmDeleteRoom from "./ModalConfirmDeleteRoom";
import { useAuth } from "../context/AuthContext";
import { deleteRoom } from "../API/deleteRoomAPI";

// Konstan jumlah card per halaman
const ITEMS_PER_PAGE = 12;

export default function ManageRoom({ rooms = [], fetchRooms, onEditRoom }) {
  const [modal, setModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { profile } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);

  // Paging
  const totalPages = Math.ceil((rooms.length || 1) / ITEMS_PER_PAGE);
  const paginatedRooms = rooms.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handler delete room
  const handleDeleteRequest = (room) => {
    setSelectedRoom(room);
    setModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteRoom(selectedRoom?.id);
      alert("Room berhasil dihapus!");
      fetchRooms && fetchRooms();
    } catch {
      alert("Gagal menghapus room!");
    }
    setModal(false);
    setSelectedRoom(null);
  };

  // Handler edit: panggil parent modal edit
  const handleEditRequest = (room) => {
    if (onEditRoom) onEditRoom(room);
  };

  return (
    <>
      {/* Grid 4x3 */}
      <div
        className="
          grid gap-[18px]
          grid-cols-4
          w-full max-w-[1320px] mx-auto pt-2
        "
      >
        {paginatedRooms.map((room) =>
          room && room.id ? (
            <RoomCard
              key={room.id}
              room={room}
              onEdit={handleEditRequest}
              onDelete={handleDeleteRequest}
              canEdit={profile?.role === "admin"}
              canDelete={profile?.role === "admin"}
            />
          ) : null
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center my-8 gap-2">
        <button
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          className={`w-9 h-9 rounded-full flex items-center justify-center border text-lg font-bold
            ${currentPage === 1 ? "text-gray-400 border-gray-200" : "text-orange-500 border-orange-300 hover:bg-orange-50"}`}
        >
          &lt;
        </button>
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-9 h-9 rounded-full mx-1 border flex items-center justify-center text-base transition
              ${currentPage === i + 1
                ? "bg-orange-600 text-white border-orange-600 font-bold"
                : "bg-white text-gray-700 border-gray-200 hover:bg-orange-50"}`}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          className={`w-9 h-9 rounded-full flex items-center justify-center border text-lg font-bold
            ${currentPage === totalPages ? "text-gray-400 border-gray-200" : "text-orange-500 border-orange-300 hover:bg-orange-50"}`}
        >
          &gt;
        </button>
      </div>

      <ModalConfirmDeleteRoom
        isOpen={modal}
        onCancel={() => setModal(false)}
        onConfirm={handleConfirmDelete}
        roomName={selectedRoom?.name}
      />
    </>
  );
}
