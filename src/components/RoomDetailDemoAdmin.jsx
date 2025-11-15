import React, { useEffect, useState, useCallback } from "react";
import { fetchRoomById, fetchFirstRoomDetail } from "../API/roomAPI";

export default function RoomDetailDemoAdmin({ onRoomData }) {
  const [room, setRoom] = useState(null);
  const [autoRoom, setAutoRoom] = useState(null);

  const demoId = "287a33c6-97ce-4958-9748-67b71c20cbfc";

  // Bungkus dengan useCallback agar referensi stabil
  const fetchManualRoom = useCallback(async () => {
    try {
      const res = await fetchRoomById(demoId);
      setRoom(res);
      if (onRoomData) onRoomData(res);
    } catch {
      setRoom(null);
    }
  }, [onRoomData]);

  const fetchAutoRoom = useCallback(async () => {
    try {
      const res = await fetchFirstRoomDetail();
      setAutoRoom(res);
      if (onRoomData) onRoomData(res);
    } catch {
      setAutoRoom(null);
    }
  }, [onRoomData]);

  useEffect(() => {
    fetchManualRoom();
    fetchAutoRoom();
  }, [fetchManualRoom, fetchAutoRoom]); // Warning hilang

  // Tidak merender UI apapun
  return null;
}
