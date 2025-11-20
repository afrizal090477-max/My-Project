import { FiChevronLeft } from "react-icons/fi";

export default function ReservationDetailAdmin({ onBack, data, onSubmit, rooms }) {
  // Cari objek room yang cocok dari room_id
  const selectedRoom =
    Array.isArray(rooms) && data?.room_id
      ? rooms.find(
          (r) => String(r.id) === String(data.room_id) || String(r.room_id) === String(data.room_id)
        )
      : undefined;

  const toCurrency = (num) => "Rp " + (num ? num.toLocaleString("id-ID") : "0");

  // Waktu (hours label)
  const getDuration = () => {
    const [sh] = (data?.start_time || data?.startTime || "00:00").split(":").map(Number);
    const [eh] = (data?.end_time || data?.endTime || "00:00").split(":").map(Number);
    const diff = eh - sh;
    return diff > 0 ? `${diff} hours` : "-";
  };

  return (
    <div className="fixed top-0 right-0 z-50 w-full sm:w-[456px] h-full max-h-screen bg-white shadow-2xl flex flex-col px-8 pt-5 pb-6 overflow-y-auto border">
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="mr-2 p-1 text-gray-600 hover:text-orange-500">
          <FiChevronLeft size={28} />
        </button>
        <h2 className="text-xl font-bold">Detail Reservation</h2>
      </div>

      <div className="space-y-3">
        {/* Room Detail */}
        <div className="py-1 border-b">
          <p className="font-semibold mb-2">Room Detail</p>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Room Name</span>
            <span className="text-gray-900">{selectedRoom?.room_name || "-"}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Room Type</span>
            <span className="text-gray-900">{selectedRoom?.room_type || "-"}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Capacity</span>
            <span className="text-gray-900">
              {selectedRoom?.capacity ? `${selectedRoom.capacity} people` : "-"}
            </span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Price/hours</span>
            <span className="text-gray-900">
              {selectedRoom?.price ? "Rp " + selectedRoom.price.toLocaleString("id-ID") : "-"}
            </span>
          </div>
        </div>

        {/* Book Detail */}
        <div className="py-1 border-b">
          <p className="font-semibold mb-2">Book Detail</p>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Name</span>
            <span className="text-gray-900">{data?.pemesan || data?.name || "-"}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>No.Hp</span>
            <span className="text-gray-900">{data?.no_hp || data?.phone || "-"}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Company/Organization</span>
            <span className="text-gray-900">{data?.company_name || data?.company || "-"}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Date Reservation</span>
            <span className="text-gray-900">
              {(data?.date_reservation || data?.dateReservation || data?.dateStart)
                ? new Date(data?.date_reservation || data?.dateReservation || data?.dateStart)
                  .toLocaleDateString("id-ID")
                : "-"}
            </span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Duration</span>
            <span className="text-gray-900">{getDuration()}</span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Total Participants</span>
            <span className="text-gray-900">
              {(data?.total_participant || data?.participants) ? `${data.total_participant || data.participants} participants` : "-"}
            </span>
          </div>
        </div>

        {/* Total */}
        <div className="py-1 border-b">
          <p className="font-semibold mb-2">Total</p>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>{selectedRoom?.room_name || "Room"}</span>
            <span className="text-gray-900">
              1 x {selectedRoom?.price?.toLocaleString("id-ID") || 0}
              <span className="ml-4">{selectedRoom?.price?.toLocaleString("id-ID") || 0}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Grand Total */}
      <div className="flex justify-end items-center py-4">
        <span className="text-2xl font-bold text-orange-600">{toCurrency(selectedRoom?.price)}</span>
      </div>

      {/* Note */}
      <div className="pb-6">
        <p className="font-semibold mb-1">Note</p>
        <p className="text-gray-700 text-xs">{data?.note || "-"}</p>
      </div>

      <button
        className="mt-auto w-full h-[48px] bg-[#FF7316] text-white font-bold rounded-lg"
        onClick={() => onSubmit?.(data)}
      >
        Submit
      </button>
    </div>
  );
}
