import React, { useState, useEffect } from "react";
import { fetchRoomById, fetchFirstRoomDetail } from "../API/roomAPI";

export default function RoomDetailDemoAdmin() {
  const [room, setRoom] = useState(null);
  const [autoRoom, setAutoRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  const demoId = "287a33c6-97ce-4958-9748-67b71c20cbfc";

  // Fungsi panggil manual UUID tapi dipanggil otomatis
  const fetchManualRoom = async () => {
    setLoading(true);
    try {
      const res = await fetchRoomById(demoId);
      setRoom(res);
    } catch (e) {
      setRoom(null);
    }
    setLoading(false);
  };

  // Fungsi fetch auto first room otomatis
  const fetchAutoRoom = async () => {
    setLoading(true);
    try {
      const res = await fetchFirstRoomDetail();
      setAutoRoom(res);
    } catch (e) {
      setAutoRoom(null);
    }
    setLoading(false);
  };

  // Panggil otomatis saat komponen mount (atau trigger sesuai kebutuhan)
  useEffect(() => {
    fetchManualRoom();
    fetchAutoRoom();
  }, []);

  return (
    <div className="max-w-xl mx-auto p-6 mt-8 rounded bg-white shadow space-y-6">
      <h2 className="text-xl font-bold mb-4">Demo Room Detail (Admin)</h2>
      {/* Hanya tampil data hasil fetch, tanpa tombol di UI */}
      {loading && <div>Loading...</div>}
      {room && <pre className="bg-gray-100 text-xs rounded p-3 overflow-x-auto">{JSON.stringify(room, null, 2)}</pre>}
      {autoRoom && <pre className="bg-gray-100 text-xs rounded p-3 overflow-x-auto">{JSON.stringify(autoRoom, null, 2)}</pre>}
    </div>
  );
}
