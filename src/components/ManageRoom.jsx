import React, { useState } from "react";
import RoomCard from "./RoomCard";
import ModalConfirmDeleteRoom from "./ModalConfirmDeleteRoom";
import { useAuth } from "../context/AuthContext";
import { deleteRoom } from "../API/deleteRoomAPI";

export default function ManageRoom({
  rooms = [],
  fetchRooms,
  onEditRoom,
  pagination = { currentPage: 1, totalPages: 1 },
  loading = false,
}) {
  const [modal, setModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const { profile } = useAuth();

  const currentPage = pagination.currentPage || 1;
  const totalPages = pagination.totalPages || 1;

  const handleDeleteRequest = (room) => {
    setSelectedRoom(room);
    setModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteRoom(selectedRoom?.id);
      alert("Room berhasil dihapus!");
      fetchRooms && fetchRooms(currentPage);
    } catch {
      alert("Gagal menghapus room!");
    }
    setModal(false);
    setSelectedRoom(null);
  };

  const handleEditRequest = (room) => {
    if (onEditRoom) onEditRoom(room);
  };

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    fetchRooms && fetchRooms(page);
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
        {loading ? (
          <div className="col-span-4 text-center text-gray-400 py-10">
            Loading rooms...
          </div>
        ) : rooms.length === 0 ? (
          <div className="col-span-4 text-center text-gray-400 py-10">
            No rooms available.
          </div>
        ) : (
          rooms.map(
            (room) =>
              room &&
              room.id && (
                <RoomCard
                  key={room.id}
                  room={room}
                  onEdit={handleEditRequest}
                  onDelete={handleDeleteRequest}
                  canEdit={profile?.role === "admin"}
                  canDelete={profile?.role === "admin"}
                />
              )
          )
        )}
      </div>

      {/* Pagination ala Reservation */}
      <div className="flex justify-center items-center my-8 text-sm gap-2">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1 || totalPages === 0}
          className={`px-2 text-[13px] ${
            currentPage === 1 || totalPages === 0
              ? "text-gray-300 cursor-default"
              : "text-gray-600 hover:text-orange-600"
          }`}
        >
          &larr; Prev
        </button>

        {totalPages === 0 ? (
          <span className="px-2 py-1 text-gray-400 border border-gray-200 rounded">
            1
          </span>
        ) : (
          Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`mx-1 min-w-[28px] h-[28px] rounded text-center border text-[13px] ${
                  page === currentPage
                    ? "bg-orange-500 text-white border-orange-500 font-semibold"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-orange-50"
                }`}
              >
                {page}
              </button>
            )
          )
        )}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className={`px-2 text-[13px] ${
            currentPage === totalPages || totalPages === 0
              ? "text-gray-300 cursor-default"
              : "text-gray-600 hover:text-orange-600"
          }`}
        >
          Next &rarr;
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
