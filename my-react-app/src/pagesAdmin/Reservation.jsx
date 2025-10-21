import React, { useState } from "react";
import ReservationForm from "@/components/ReservationForm";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

const ROOMS = [
  {
    name: "Aster Room",
    events: [
      { company: "PT Maju Jaya", start: "13:00", end: "15:00", status: "Done" },
      {
        company: "Organisasi Muslim Pusat",
        start: "13:00",
        end: "15:00",
        status: "Up Coming",
      },
    ],
  },
  {
    name: "Bluebell Room",
    events: [
      {
        company: "PT XYZ Corp",
        start: "10:00",
        end: "11:00",
        status: "In Progress",
      },
    ],
  },
  {
    name: "Camellia Room",
    events: [
      {
        company: "Alisa Company",
        start: "14:00",
        end: "15:00",
        status: "Up Coming",
      },
    ],
  },
  // contoh tambahan room di luar jam default
  {
    name: "Daisy Room",
    events: [
      {
        company: "PT Lestari",
        start: "15:00",
        end: "18:00",
        status: "Up Coming",
      },
    ],
  },
];

const getEventClass = (status) => {
  const classes = {
    Done: "bg-gray-100 border border-gray-300",
    "In Progress": "bg-green-50 border border-green-400",
    "Up Coming": "bg-orange-50 border border-orange-400",
  };
  return classes[status] || "bg-white border border-gray-200";
};

const getBadgeClass = (status) => {
  const classes = {
    Done: "bg-gray-200 text-gray-600",
    "In Progress": "bg-green-100 text-green-700",
    "Up Coming": "bg-orange-100 text-orange-700",
  };
  return classes[status] || "bg-gray-50 text-gray-400";
};

export default function Reservation() {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [toast, setToast] = useState({ visible: false, type: "", message: "" });

  const handleSearch = () => {
    if (!startDate || !endDate) {
      setToast({
        visible: true,
        type: "error",
        message: "Pilih Start Date dan End Date terlebih dahulu!",
      });
      setTimeout(
        () => setToast({ visible: false, type: "", message: "" }),
        3000
      );
      return;
    }

    // Jika sukses
    setToast({
      visible: true,
      type: "success",
      message: "Data pencarian berhasil ditampilkan!",
    });
    setTimeout(() => setToast({ visible: false, type: "", message: "" }), 3000);
  };
  let toastBg = "bg-gray-500";

  if (toast.type === "success") {
    toastBg = "bg-green-500";
  } else if (toast.type === "error") {
    toastBg = "bg-red-500";
  }

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // === Hitung jam dinamis berdasarkan event ===
  const allTimes = ROOMS.flatMap((room) =>
    room.events.flatMap((ev) => [ev.start, ev.end])
  );

  const startMin =
    Math.min(
      ...allTimes.map((t) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      })
    ) || 480; // default 08:00

  const endMax =
    Math.max(
      ...allTimes.map((t) => {
        const [h, m] = t.split(":").map(Number);
        return h * 60 + m;
      })
    ) || 960; // default 16:00

  const times = [];
  for (let m = startMin; m <= endMax; m += 60) {
    const h = Math.floor(m / 60)
      .toString()
      .padStart(2, "0");
    times.push(`${h}.00`);
  }

  // Tentukan warna background toast

  return (
    <div className="flex flex-col mb-1">
      {/* Toast Notification */}
      {/* Toast Notification */}
      {toast.visible && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm transition-all duration-300 ${toastBg}`}
        >
          {toast.message}
        </div>
      )}

      {/* === Filter Section === */}
      <section className="w-full bg-white flex flex-wrap md:flex-nowrap justify-between items-center gap-4 border border-gray-200 rounded-xl px-5 py-4 shadow-sm mb-4px">
        <div className="flex flex-wrap md:flex-nowrap gap-20 items-center">
          <p className="font-semibold text-gray-900">{today}</p>

          {/* Start Date */}
          <div className="relative">
            <DatePicker
              id="start-date"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Select start date"
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 rounded-lg px-4 py-3 w-[200px] bg-white text-gray-900 cursor-pointer"
            />
            <FaCalendarAlt className="absolute right-3 top-4 text-gray-400" />
          </div>

          {/* End Date */}
          <div className="relative">
            <DatePicker
              id="end-date"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="Select end date"
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 rounded-lg px-4 py-3 w-[200px] bg-white text-gray-900 cursor-pointer"
            />
            <FaCalendarAlt className="absolute right-3 top-4 text-gray-400" />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="border !border-orange-600 text-orange-600 w-[140px] h-[45px] rounded-md font-medium bg-transparent hover:bg-orange-50 transition duration-300"
          >
            Search
          </button>
        </div>

        {/* Add Reservation */}
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#FF7316] text-white px-5 py-2 w-[200px] h-[48px] rounded-md font-medium hover:bg-[#e76712] transition"
        >
          + Add New Reservation
        </button>
      </section>

      {/* === Schedule Grid Container === */}
      <div
        className="relative bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden"
        style={{
          width: "1320px",
          height: "770px",
          position: "absolute",
          top: "188px",
          left: "100px",
        }}
      >
        {/* Rectangle Scrollbar Kanan */}
        <div
          className="absolute right-0 top-[20px] rounded-[10px] bg-gray-400"
          style={{ width: "8px", height: "75.7px", opacity: 1 }}
        />
        <div
          className="absolute right-0 top-[20px] rounded-[10px] bg-gray-200"
          style={{ width: "8px", height: "730px", opacity: 0.4 }}
        />

        {/* Rectangle Scrollbar Bawah */}
        <div
          className="absolute bottom-0 left-[120px] rounded-[10px] bg-gray-400"
          style={{ width: "75.7px", height: "8px", opacity: 1 }}
        />
        <div
          className="absolute bottom-0 left-[120px] rounded-[10px] bg-gray-200"
          style={{ width: "1600px", height: "8px", opacity: 0.4 }}
        />

        {/* === Scrollable Room Grid (4x3) === */}
        <div
          className="absolute overflow-x-auto overflow-y-auto"
          style={{
            top: 0,
            left: "80px",
            right: "16px",
            bottom: "16px",
          }}
        >
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: "repeat(4, 1fr)",
              gridAutoRows: "740px",
              width: "1600px",
              height: "2200px",
              padding: "20px",
            }}
          >
            {ROOMS.map((room, idx) => (
              <div
                key={room.name + idx}
                className="relative bg-white border border-gray-200 rounded-xl shadow-sm"
                style={{
                  width: "400px",
                  height: `${(times.length - 1) * 70 + 70}px`, // tinggi dinamis mengikuti jam
                }}
              >
                <h2 className="font-semibold text-lg mb-2 text-gray-800 text-center border-b border-dashed border-gray-200 py-3">
                  {room.name}
                </h2>

                <div className="relative w-full border-t border-dashed border-gray-200">
                  {room.events && room.events.length > 0 ? (
                    room.events.map((ev) => {
                      const [sh, sm] = ev.start.split(":").map(Number);
                      const [eh, em] = ev.end.split(":").map(Number);
                      const st = sh * 60 + sm;
                      const et = eh * 60 + em;
                      const top = ((st - startMin) / 60) * 70;
                      const height = ((et - st) / 60) * 70;

                      return (
                        <div
                          key={`${room.name}-${ev.company}-${ev.start}-${ev.end}`}
                          className={`absolute left-2 right-2 p-3 rounded-lg shadow-sm ${getEventClass(
                            ev.status
                          )}`}
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                          }}
                        >
                          <p className="font-medium">{ev.company}</p>
                          <p className="text-sm text-gray-500">
                            {ev.start} - {ev.end} WIB
                          </p>
                          <span
                            className={`absolute right-2 top-2 text-xs px-2 py-[2px] rounded-full ${getBadgeClass(
                              ev.status
                            )}`}
                          >
                            {ev.status}
                          </span>
                        </div>
                      );
                    })
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                      Available
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* === Sticky Time Labels (Kiri) === */}
        <div
          className="absolute z-10 bg-white"
          style={{
            top: 0,
            left: 0,
            width: "90px",
            height: "100%",
            borderRight: "1px dashed #ddd",
          }}
        >
          {times.map((time, i) => (
            <div
              key={time}
              style={{
                width: "36px",
                height: "20px",
                position: "absolute",
                top: `${150 + i * 70}px`,
                left: "34px",
                fontFamily: "Roboto",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "20px",
                textAlign: "right",
                opacity: 1,
              }}
            >
              {time}
            </div>
          ))}
        </div>
      </div>

      {/* === Reservation Form Modal === */}
      {showForm && <ReservationForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
