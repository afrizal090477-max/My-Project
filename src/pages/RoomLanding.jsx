import React, { useEffect, useState } from "react";
import RoomCard from "../components/RoomCard"; // pastikan path ini benar
import { fetchRooms } from "../API/userRoomAPI";

export default function RoomLanding() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchRooms()
      .then(data => {
        setRooms(data.rooms || []); // Sesuaikan dengan struktur respons API-mu
        setError(null);
      })
      .catch(() => {
        setError("Failed to load rooms");
        setRooms([]);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center">
        Loading rooms...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gray-50 min-h-screen flex justify-center items-center text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-[1320px] mx-auto">
        <h1 className="text-3xl font-bold mb-8">Rooms</h1>
        {rooms.length === 0 ? (
          <div className="text-center text-gray-500">No rooms found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
