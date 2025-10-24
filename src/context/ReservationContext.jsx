import React, { createContext, useContext, useState, useMemo } from "react";
import PropTypes from "prop-types";

const ReservationContext = createContext();

export function ReservationProvider({ children }) {
  // State room + reservation global
  const [roomsData, setRoomsData] = useState([]);
  const [reservations, setReservations] = useState([]);

  // tambah reservasi baru
  const addReservation = (newReservation) => {
    setReservations((prev) => [...prev, newReservation]);
  };

  // update event dalam room tertentu
  const updateRoomEvents = (roomName, event) => {
    setRoomsData((prev) =>
      prev.map((room) =>
        room.name === roomName
          ? { ...room, events: [...(room.events || []), event] }
          : room
      )
    );
  };

  // Gunakan useMemo untuk value provider
  const value = useMemo(
    () => ({
      roomsData,
      setRoomsData,
      reservations,
      addReservation,
      updateRoomEvents,
    }),
    [roomsData, reservations]
  );

  return (
    <ReservationContext.Provider value={value}>
      {children}
    </ReservationContext.Provider>
  );
}

// Tambahkan props validation agar warning hilang
ReservationProvider.propTypes = {
  children: PropTypes.node,
};

export function useReservation() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservation must be used within a ReservationProvider");
  }
  return context;
}
