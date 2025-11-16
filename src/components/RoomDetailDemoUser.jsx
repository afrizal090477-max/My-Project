import React, { useState, useEffect } from "react";
import { fetchRoomById, fetchFirstRoomDetail } from "../API/roomAPI";

// Ganti demoId dengan contoh id paling valid dari backend
const DEFAULT_ROOM_ID = "cc15556a-9f9d-4a3d-9dc4-c53f08c470f7";

export default function RoomDetailDemoUser() {
  const [room, setRoom] = useState(null);
  const [autoRoom, setAutoRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fungsi fetch detail manual / demo room
  const fetchManualRoom = async () => {
    setLoading(true);
    setError("");
    try {
      if (!DEFAULT_ROOM_ID) throw new Error("Room ID demo tidak boleh kosong");
      const res = await fetchRoomById(DEFAULT_ROOM_ID);
      setRoom(res);
    } catch (e) {
      console.error("Error fetchRoomById:", e);
      setError(
        e?.response?.status === 400
          ? "Room ID tidak ditemukan (400 Bad Request)"
          : (e?.message || "Gagal mengambil data room manual")
      );
      setRoom(null);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi fetch detail automatic dari room pertama (demo list)
  const fetchAutoRoom = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchFirstRoomDetail();
      setAutoRoom(res);
    } catch (e) {
      console.error("Error fetchAutoRoom:", e);
      setError(e?.message || "Gagal mengambil data room auto");
      setAutoRoom(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManualRoom();
    fetchAutoRoom();
   
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 mt-8 rounded bg-white shadow space-y-6">
      <h2 className="text-xl font-bold mb-4">Demo Room Detail (User)</h2>
      {loading && <div>Loading...</div>}
      {error && (
        <div className="text-red-500 text-sm mb-2">{error}</div>
      )}
      {room && (
        <pre className="bg-gray-100 text-xs rounded p-3 overflow-x-auto">
          {JSON.stringify(room, null, 2)}
        </pre>
      )}
      {autoRoom && (
        <pre className="bg-gray-100 text-xs rounded p-3 overflow-x-auto">
          {JSON.stringify(autoRoom, null, 2)}
        </pre>
      )}
    </div>
  );
}
