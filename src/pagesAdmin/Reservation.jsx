// src/pagesAdmin/Reservation.jsx

import React, { useMemo, useState } from "react";
import { ROOM_LIST } from "../data/roomData";
import ReservationFormAdmin from "../components/ReservationFormAdmin";
import ReservationDetailAdmin from "../components/ReservationDetailAdmin";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";

export default function Reservation() {
  const DEFAULT_ROOMS = useMemo(() => [
    {
      name: "Aster Room",
      events: [
        { company: "PT Maju Jaya", start: "13:00", end: "15:00", status: "Done" },
        { company: "Organisasi Muslim Pusat", start: "13:00", end: "15:00", status: "Up Coming" },
      ],
    },
    {
      name: "Bluebell Room",
      events: [{ company: "PT XYZ Corp", start: "10:00", end: "11:00", status: "In Progress" }],
    },
    {
      name: "Camellia Room",
      events: [{ company: "Alisa Company", start: "14:00", end: "15:00", status: "Up Coming" }],
    },
    {
      name: "Daisy Room",
      events: [{ company: "PT Lestari", start: "15:00", end: "18:00", status: "Up Coming" }],
    },
  ], []);

  const [roomsData, setRoomsData] = useState(DEFAULT_ROOMS);
  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [toast, setToast] = useState({ visible: false, type: "", message: "" });

  // Stepper state
  const [step, setStep] = useState(1); // 1: form, 2: detail
  const [formData, setFormData] = useState(null);

  // Step 1: Ambil detail room dari ROOM_LIST (master)
  const handleNext = (data) => {
    const foundRoom = ROOM_LIST.find(room => room.name === data.room);
    setFormData({
      ...data,
      roomType: foundRoom?.type || "-",
      capacity: foundRoom ? `${foundRoom.capacity} people` : "-",
      roomPrice: foundRoom ? `Rp ${foundRoom.price.toLocaleString("id-ID")}` : "-",
      roomPriceRaw: foundRoom?.price || 0,
    });
    setStep(2);
  };

  // Submit reservation success (step 2)
  const handleReservationSubmit = (finalData) => {
    setRoomsData((prev) =>
      prev.map((room) =>
        room.name === finalData.room
          ? {
              ...room,
              events: [
                ...room.events,
                {
                  company: finalData.company || finalData.name,
                  start: finalData.startTime,
                  end: finalData.endTime,
                  status: finalData.status || "Up Coming",
                },
              ],
            }
          : room
      )
    );

    setToast({
      visible: true,
      type: "success",
      message: "New Reservation Successfully added",
    });
    setTimeout(() => setToast({ visible: false, type: "", message: "" }), 3000);

    setStep(1);
    setFormData(null);
    setShowForm(false);
  };

  const handleSearch = () => {
    if (!startDate || !endDate) {
      setToast({
        visible: true,
        type: "error",
        message: "Pilih Start Date dan End Date terlebih dahulu!",
      });
      setTimeout(() => setToast({ visible: false, type: "", message: "" }), 3000);
      return;
    }
    setToast({
      visible: true,
      type: "success",
      message: "Data pencarian berhasil ditampilkan!",
    });
    setTimeout(() => setToast({ visible: false, type: "", message: "" }), 3000);
  };

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const times = useMemo(
    () => Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`),
    []
  );

  const getEventClass = (status) =>
    ({
      Done: "bg-gray-100 border border-gray-300",
      "In Progress": "bg-green-50 border border-green-400",
      "Up Coming": "bg-orange-50 border border-orange-400",
    }[status] || "bg-white border border-gray-200");

  const getBadgeClass = (status) =>
    ({
      Done: "bg-gray-200 text-gray-600",
      "In Progress": "bg-green-100 text-green-700",
      "Up Coming": "bg-orange-100 text-orange-700",
    }[status] || "bg-gray-50 text-gray-400");

  const toastBg =
    toast.type === "success" ? "bg-green-500" : toast.type === "error" ? "bg-red-500" : "bg-gray-500";

  return (
    <div className="flex flex-col mb-1">
      {toast.visible && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm transition-all duration-300 ${toastBg}`}
        >
          {toast.message}
        </div>
      )}

      {/* Filter bar */}
      <section className="w-[1320px] bg-white flex justify-between items-center gap-2 border border-gray-200 rounded-xl px-5 py-4 shadow-sm mb-1">
        <div className="flex flex-wrap md:flex-nowrap gap-10 items-center">
          <p className="font-semibold text-gray-900">{today}</p>
          <div className="relative">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Select start date"
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 rounded-lg px-4 py-3 w-[274px] h-[48px] bg-white text-gray-900 cursor-pointer"
            />
            <FaCalendarAlt className="absolute right-3 top-4 text-gray-400" />
          </div>
          <div className="relative">
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="Select end date"
              dateFormat="yyyy-MM-dd"
              className="border border-gray-300 rounded-lg px-4 py-3 w-[274px] h-[48px] bg-white text-gray-900 cursor-pointer"
            />
            <FaCalendarAlt className="absolute right-3 top-4 text-gray-400" />
          </div>
          <button
            onClick={handleSearch}
            className="border !border-orange-600 text-orange-600 w-[140px] h-[45px] rounded-md font-medium bg-transparent hover:bg-orange-50 transition duration-300"
          >
            Search
          </button>
        </div>
        <button
          onClick={() => { setShowForm(true); setStep(1); setFormData(null); }}
          className="bg-[#FF7316] text-white px-5 py-2 w-[198px] h-[48px] rounded-md font-medium hover:bg-[#e76712] transition"
        >
          + Add New Reservation
        </button>
      </section>

      {/* Timeline grid */}
      <div
        className="relative bg-white border border-gray-200 shadow-sm rounded-xl overflow-auto"
        style={{ width: "1320px", height: "770px", position: "relative" }}
      >
        {/* Time rail */}
        <div
          className="absolute z-10 bg-white border-r border-dashed border-gray-200"
          style={{ top: 0, left: 0, width: "90px", height: "1440px" }}
        >
          {times.map((time, i) => (
            <div
              key={time}
              style={{
                position: "absolute",
                top: `${i * 60 + 40}px`,
                left: "34px",
                fontSize: "14px",
                color: "#5E5E5E",
                textAlign: "right",
              }}
            >
              {time}
            </div>
          ))}
        </div>

        {/* Rooms grid */}
        <div
          className="absolute left-[90px] top-0 border-l border-gray-200"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${roomsData.length}, 1fr)`,
            width: `${roomsData.length * 300}px`,
            height: "1440px",
          }}
        >
          {roomsData.map((room) => (
            <div key={room.name} className="relative border-r border-dashed border-gray-200">
              <h2 className="font-semibold text-center py-3 border-b border-gray-200 text-gray-800">
                {room.name}
              </h2>
              {Array.isArray(room.events) &&
                room.events.map((ev, idx) => {
                  const [sh, sm] = ev.start.split(":").map(Number);
                  const [eh, em] = ev.end.split(":").map(Number);
                  const st = sh * 60 + sm;
                  const et = eh * 60 + em;
                  return (
                    <div
                      key={`${room.name}-${ev.company}-${ev.start}-${idx}`}
                      className={`absolute left-2 right-2 p-3 rounded-lg shadow-sm ${getEventClass(
                        ev.status
                      )}`}
                      style={{
                        top: `${(st / 60) * 60 + 40}px`,
                        height: `${((et - st) / 60) * 60}px`,
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
                })}
            </div>
          ))}
        </div>
      </div>

      {/* Modal form: stepper */}
      {showForm && (
        <>
          {step === 1 && (
            <ReservationFormAdmin
              isOpen={showForm}
              onClose={() => { setShowForm(false); setStep(1); setFormData(null); }}
              onSubmit={handleNext}
              data={formData}
            />
          )}
          {step === 2 && (
            <ReservationDetailAdmin
              data={formData}
              onBack={() => setStep(1)}
              onSubmit={handleReservationSubmit}
            />
          )}
        </>
      )}
    </div>
  );
}
