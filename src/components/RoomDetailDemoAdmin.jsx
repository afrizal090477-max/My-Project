import React, { useEffect, useState } from "react";
// Import API-nya dikondisikan, jangan dipakai jika endpoint belum siap
// import { fetchRoomById, fetchFirstRoomDetail } from "../API/roomAPI";

export default function RoomDetailDemoAdmin({ auto = false, onRoomData }) {
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(false);

  // Demo hanya UI placeholder untuk masa depan. Nanti aktifkan kode bawah jika endpoint tersedia.
  /*
  useEffect(() => {
    if (!auto) return;
    setLoading(true);
    fetchFirstRoomDetail()
      .then((res) => {
        setRoom(res);
        if (onRoomData) onRoomData(res);
      })
      .catch(() => setRoom(null))
      .finally(() => setLoading(false));
  }, [auto, onRoomData]);

  useEffect(() => {
    if (auto) return;
    setLoading(true);
    fetchRoomById(demoId)
      .then((res) => {
        setRoom(res);
        if (onRoomData) onRoomData(res);
      })
      .catch(() => setRoom(null))
      .finally(() => setLoading(false));
  }, [auto, onRoomData]);
  */

  // Tidak render apa-apa untuk sekarang
  return null;
}
