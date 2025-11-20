import React, { useState } from "react";
import RoomCard from "./RoomCard";
import ModalConfirmDeleteRoom from "./ModalConfirmDeleteRoom";
import { deleteRoom } from "../API/deleteRoomAPI";

// rooms di bawah asumsikan props, fetch, atau mock data
export default function RoomTable({ rooms, fetchRooms }) {
  const [modal, setModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleDeleteRequest = (room) => {
    setSelectedRoom(room);
    setModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteRoom(selectedRoom.id);
      alert("Room berhasil dihapus!");
      fetchRooms && fetchRooms();  // refresh data jika perlu
    } catch {
      alert("Gagal menghapus room!");
    }
    setModal(false);
    setSelectedRoom(null);
  };

  return (
    <>
      <div className="grid md:grid-cols-3 gap-6">
        {rooms.map(room => (
          <RoomCard
            key={room.id}
            room={room}
            onEdit={() => {/* handler edit */}}
            onDelete={handleDeleteRequest}
          />
        ))}
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
