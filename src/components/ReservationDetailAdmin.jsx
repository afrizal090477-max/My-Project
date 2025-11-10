import { FiChevronLeft } from "react-icons/fi";

export default function ReservationDetailAdmin({ onBack, data, onSubmit }) {
  // Helper currency
  const toCurrency = (num) => "Rp " + num.toLocaleString("id-ID");

  // Hitung duration otomatis dari start-end time
  const getDuration = () => {
    const [sh, sm] = (data?.startTime || "00:00").split(":").map(Number);
    const [eh, em] = (data?.endTime || "00:00").split(":").map(Number);
    const diff = eh * 60 + em - (sh * 60 + sm);
    return diff > 0 ? `${Math.floor(diff/60)} hours` : "-";
  };

  // Hitung snack total
  const snackQty = data?.participants || 0;
  // Jika snackCategory format: "Lunch Package 1 - Rp 20.000/people", parse harga
  const snackPrice = data?.snackCategory ? Number(String(data.snackCategory).replace(/[^\d]/g, "")) : 0;
  const snackTotal = snackQty * snackPrice;

  // Room price raw sudah di-mapping dari ROOM_LIST (lewat stepper handleNext)
  const roomTotal = data?.roomPriceRaw ?? 0;
  const grandTotal = roomTotal + snackTotal;

  return (
    <div className="fixed top-0 right-0 z-50 w-[456px] h-full max-h-screen bg-white shadow-2xl flex flex-col px-8 pt-5 pb-6 overflow-y-auto border">
      {/* Header */}
      <div className="flex items-center mb-4">
        <button onClick={onBack} className="mr-2 p-1 text-gray-600 hover:text-orange-500">
          <FiChevronLeft size={28} />
        </button>
        <h2 className="text-xl font-bold">Detail Reservation</h2>
      </div>
      
      {/* Room Detail */}
      <div className="py-1 border-b mb-1">
        <p className="font-semibold mb-2">Room Detail</p>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Room Name</span>
          <span className="text-gray-900">{data?.room || "-"}</span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Room Type</span>
          <span className="text-gray-900">{data?.roomType || "-"}</span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Capacity</span>
          <span className="text-gray-900">{data?.capacity || "-"}</span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Price/hours</span>
          <span className="text-gray-900">{data?.roomPrice || "-"}</span>
        </div>
      </div>

      {/* Book Detail */}
      <div className="py-1 border-b mb-1">
        <p className="font-semibold mb-2">Book Detail</p>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Name</span>
          <span className="text-gray-900">{data?.name || "-"}</span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>No.Hp</span>
          <span className="text-gray-900">{data?.phone || "-"}</span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Company/Organization</span>
          <span className="text-gray-900">{data?.company || "-"}</span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Date Reservation</span>
          <span className="text-gray-900">
            {data?.dateReservation
              ? new Date(data.dateReservation).toLocaleDateString("id-ID")
              : "-"}
          </span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Duration</span>
          <span className="text-gray-900">{data?.duration || getDuration()}</span>
        </div>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>Total Participants</span>
          <span className="text-gray-900">
            {data?.participants ? `${data.participants} participants` : "-"}
          </span>
        </div>
      </div>

      {/* Konsumsi Detail */}
      {data?.addSnack && (
        <div className="py-1 border-b mb-1">
          <p className="font-semibold mb-2">Konsumsi Detail</p>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Snack</span>
            <span className="text-gray-900">
              {(data.snackCategory || "-").split("-")[0].trim()}
            </span>
          </div>
          <div className="flex justify-between text-gray-500 text-sm">
            <span>Packages</span>
            <span className="text-gray-900">{data.snackCategory || "-"}</span>
          </div>
        </div>
      )}

      {/* Total */}
      <div className="py-1 border-b mb-1">
        <p className="font-semibold mb-2">Total</p>
        <div className="flex justify-between text-gray-500 text-sm">
          <span>{data?.room || "Room"}</span>
          <span className="text-gray-900">
            1 x {roomTotal.toLocaleString("id-ID")}
            <span className="ml-4">{roomTotal ? roomTotal.toLocaleString("id-ID") : '-'}</span>
          </span>
        </div>
        {data?.addSnack && (
          <div className="flex justify-between text-gray-500 text-sm">
            <span>{data?.snackCategory || "Packages"}</span>
            <span className="text-gray-900">
              {snackQty} x {snackPrice.toLocaleString("id-ID")}
              <span className="ml-4">
                {snackTotal ? snackTotal.toLocaleString("id-ID") : '-'}
              </span>
            </span>
          </div>
        )}
      </div>

      {/* Grand Total */}
      <div className="flex justify-end items-center py-4">
        <span className="text-2xl font-bold text-orange-600">{toCurrency(grandTotal)}</span>
      </div>

      {/* Note */}
      <div className="pb-6">
        <p className="font-semibold mb-1">Note</p>
        <p className="text-gray-700 text-xs">{data?.note || "-"}</p>
      </div>

      <button
        className="mt-auto w-full h-12 bg-[#FF7316] text-white font-bold rounded-lg"
        onClick={onSubmit}
      >
        Submit
      </button>
    </div>
  );
}
