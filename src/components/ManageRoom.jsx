import React, { useState } from "react";
import RoomCard from "./RoomCard";
import ModalConfirmDeleteRoom from "./ModalConfirmDeleteRoom";
import { deleteRoom } from "../API/deleteRoomAPI";

// Props onEditRoom dikirim dari parent Room.jsx
export default function ManageRoom({ rooms = [], fetchRooms, onEditRoom }) {
  const [modal, setModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

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
      <div className="grid md:grid-cols-3 gap-6">
        {(Array.isArray(rooms) ? rooms : []).map((room) =>
          room && room.id ? (
            <RoomCard
              key={room.id}
              room={room}
              onEdit={handleEditRequest}
              onDelete={handleDeleteRequest}
            />
          ) : null
        )}
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
