import React, { useEffect, useState } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { fetchRoomById } from "../API/userRoomAPI";

export default function ReservationDetailAdmin({ onBack, data, onSubmit }) {
  const safeData = data || {};
  const [room, setRoom] = useState(null);

  useEffect(() => {
    if (safeData.room_id) {
      fetchRoomById(safeData.room_id)
        .then((res) => setRoom(res))
        .catch(() => setRoom(null));
    } else {
      setRoom(null);
    }
  }, [safeData.room_id]);

  const toCurrency = (num) =>
    "Rp " + (num ? Number(num).toLocaleString("id-ID") : "0");

  const getDurationHours = () => {
    const [sh] = (safeData.start_time || safeData.startTime || "00:00")
      .split(":")
      .map(Number);
    const [eh] = (safeData.end_time || safeData.endTime || "00:00")
      .split(":")
      .map(Number);
    const diff = eh - sh;
    return diff > 0 ? diff : null;
  };

  const durationHours = getDurationHours();

  const getDurationLabel = () => {
    return durationHours ? `${durationHours} hours` : "-";
  };

  const roomInfo = {
    name:
      safeData.roomName ||
      safeData.room_name ||
      safeData.name ||
      room?.room_name ||
      room?.name ||
      "-",
    type: safeData.roomType || safeData.room_type || room?.room_type || "-",
    rawCapacity:
      safeData.roomCapacity ??
      safeData.capacity ??
      room?.capacity,
    rawPrice:
      safeData.price !== undefined
        ? Number(safeData.price)
        : room?.price !== undefined
        ? Number(room.price)
        : undefined,
  };

  const displayCapacity =
    roomInfo.rawCapacity !== undefined && roomInfo.rawCapacity !== null
      ? `${roomInfo.rawCapacity} people`
      : "-";

  const displayPrice =
    roomInfo.rawPrice !== undefined
      ? `Rp ${roomInfo.rawPrice.toLocaleString("id-ID")}`
      : "-";

  const numericRoomPrice =
    roomInfo.rawPrice !== undefined ? roomInfo.rawPrice : 0;

  // Reservation & End Date label (pakai tanggal + jam)
  const reservationDate =
    safeData.date_reservation ||
    safeData.dateReservation ||
    safeData.dateStart ||
    "-";

  const reservationDateLabel =
    reservationDate && (safeData.start_time || safeData.startTime)
      ? `${reservationDate} ${safeData.start_time || safeData.startTime}`
      : reservationDate;

  const endDateLabel =
    reservationDate && (safeData.end_time || safeData.endTime)
      ? `${reservationDate} ${safeData.end_time || safeData.endTime}`
      : "-";

  // Total berdasarkan durasi (price/hour * hours)
  const totalRoomPrice =
    numericRoomPrice && durationHours
      ? numericRoomPrice * durationHours
      : numericRoomPrice;

  if (!data) return null;

  return (
    <div className="fixed top-0 right-0 z-50 w-full sm:w-[456px] h-full max-h-screen bg-white shadow-2xl flex flex-col px-8 pt-5 pb-6 overflow-y-auto border">
      <div className="flex items-center mb-4">
        <button
          onClick={onBack}
          className="mr-2 p-1 text-gray-600 hover:text-orange-500"
        >
          <FiChevronLeft size={36} />
        </button>
        <h2 className="text-xl font-bold">Reservation Details</h2>
      </div>

      <div className="space-y-3">
        {/* Room Detail */}
        <div className="py-1 border-b">
          <p className="font-semibold mb-2">Room Detail</p>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Room Name</span>
            <span className="text-gray-900">{roomInfo.name}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Room Type</span>
            <span className="text-gray-900">{roomInfo.type}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Capacity</span>
            <span className="text-gray-900">{displayCapacity}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Price/hours</span>
            <span className="text-gray-900">{displayPrice}</span>
          </div>
        </div>

        {/* Book Detail */}
        <div className="py-1 border-b">
          <p className="font-semibold mb-2">Book Detail</p>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Name</span>
            <span className="text-gray-900">
              {safeData.pemesan || safeData.name || "-"}
            </span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>No.HP</span>
            <span className="text-gray-900">
              {safeData.no_hp || safeData.phone || "-"}
            </span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Company/Organization</span>
            <span className="text-gray-900">
              {safeData.company_name || safeData.company || "-"}
            </span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Reservation Date</span>
            <span className="text-gray-900">
              {reservationDateLabel}
            </span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>End Date</span>
            <span className="text-gray-900">
              {endDateLabel}
            </span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Duration</span>
            <span className="text-gray-900">{getDurationLabel()}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Total Participants</span>
            <span className="text-gray-900">
              {safeData.total_participant || safeData.participants
                ? `${
                    safeData.total_participant || safeData.participants
                  } participants`
                : "-"}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="py-1 border-b">
          <p className="font-semibold mb-2">Total</p>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>{roomInfo.name || "Room"}</span>
            <span className="text-gray-900">
              {durationHours
                ? `${durationHours} x ${numericRoomPrice.toLocaleString(
                    "id-ID"
                  )}`
                : `1 x ${numericRoomPrice.toLocaleString("id-ID")}`}
              <span className="ml-4">
                {totalRoomPrice
                  ? totalRoomPrice.toLocaleString("id-ID")
                  : 0}
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Grand Total */}
      <div className="flex justify-end items-center py-4">
        <span className="text-2xl font-bold text-orange-600">
          {toCurrency(totalRoomPrice)}
        </span>
      </div>

      {/* Note */}
      <div className="pb-6">
        <p className="font-semibold mb-1">Note</p>
        <p className="text-gray-700 text-xs">{safeData.note || "-"}</p>
      </div>

      <button
        className="mt-auto w-full h-[48px] bg-[#FF7316] text-white font-bold rounded-lg"
        onClick={() => onSubmit?.(safeData)}
      >
        Submit
      </button>
    </div>
  );
}
