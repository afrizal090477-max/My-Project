import React, { useMemo, useState, useEffect, useCallback } from "react";
import ReservationFormAdmin from "../components/ReservationFormAdmin";
import ReservationDetailAdmin from "../components/ReservationDetailAdmin";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import ReservationSchedule from "../components/ReservationSchedule";
import { fetchRooms } from "../API/roomAPI";
import { fetchSnacks } from "../API/snackAPI";
import {
  fetchAdminReservations,
  createAdminReservation,
  filterAdminReservations,
} from "../API/ReservationScheduleAdminAPI";


export default function Reservation() {
  const [roomsData, setRoomsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [toast, setToast] = useState({ visible: false, type: "", message: "" });
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(null);

  // Snack integration
  const [snacks, setSnacks] = useState([]);
  const [loadingSnacks, setLoadingSnacks] = useState(false);
  const [errorSnacks, setErrorSnacks] = useState(null);

  const [selectedRoomName, setSelectedRoomName] = useState("");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleRoom, setScheduleRoom] = useState("");
  const [selectedScheduleDate, setSelectedScheduleDate] = useState("");

  useEffect(() => {
    setLoadingSnacks(true);
    fetchSnacks()
      .then((data) => setSnacks(data))
      .catch(() => setErrorSnacks("Failed to load snacks"))
      .finally(() => setLoadingSnacks(false));
  }, []);

  // Mapping events—matching room name lebih toleran case dan spasi!
  const mapRoomEvents = useCallback(
    (reservations, room_name) =>
      reservations
        .filter(ev =>
          ((ev.room_name || "").replace(/\s+/g, "").toLowerCase() ===
            (room_name || "").replace(/\s+/g, "").toLowerCase())
        )
        .sort((a, b) => {
          if ((a.date_reservation || "") !== (b.date_reservation || ""))
            return (a.date_reservation || "").localeCompare(b.date_reservation || "");
          return (a.start_time || "").localeCompare(b.start_time || "");
        })
        .map(ev => ({
          id: ev.id,
          company: ev.company || ev.pemesan || ev.bookerName || ev.booker_name || "-",
          startTime: ev.start_time,
          endTime: ev.end_time,
          status: ev.status,
          date: ev.date_reservation || ev.dateReservation,
        })),
    []
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const roomsRaw = await fetchRooms();
      const rooms = Array.isArray(roomsRaw) ? roomsRaw : roomsRaw.data;
      const reservations = await fetchAdminReservations();
      const mappedRooms = rooms.map(room => ({
        ...room,
        events: mapRoomEvents(reservations, room.room_name),
      }));
      setRoomsData(mappedRooms);
    } catch {
      setToast({ visible: true, type: "error", message: "Failed to load rooms or reservations" });
      setTimeout(() => setToast({ visible: false, type: "", message: "" }), 3500);
    }
    setLoading(false);
  }, [mapRoomEvents]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleNext = (data) => {
    const foundRoom = roomsData.find(room => room.room_name === data.room);
    setFormData({
      ...data,
      roomType: foundRoom?.room_type || "-",
      capacity: foundRoom ? `${foundRoom.capacity} people` : "-",
      roomPrice: foundRoom ? `Rp ${foundRoom.price?.toLocaleString("id-ID")}` : "-",
      roomPriceRaw: foundRoom?.price || 0,
    });
    setStep(2);
    setShowForm(true);
  };

  const handleReservationSubmit = async (finalData) => {
    try {
      await createAdminReservation(finalData);
      setToast({ visible: true, type: "success", message: "Reservation added" });
      setTimeout(() => setToast({ visible: false, type: "", message: "" }), 2500);
      loadData();
    } catch {
      setToast({ visible: true, type: "error", message: "Failed to add reservation" });
      setTimeout(() => setToast({ visible: false, type: "", message: "" }), 2500);
    }
    setStep(1); setFormData(null); setShowForm(false); setSelectedRoomName("");
  };

  const handleSearch = async () => {
    if (!startDate || !endDate) {
      setToast({ visible: true, type: "error", message: "Pilih Start Date dan End Date terlebih dahulu!" });
      setTimeout(() => setToast({ visible: false, type: "", message: "" }), 2500);
      return;
    }
    setLoading(true);
    try {
      const reservations = await filterAdminReservations(startDate, endDate);
      const roomsRaw = await fetchRooms();
      const rooms = Array.isArray(roomsRaw) ? roomsRaw : roomsRaw.data;
      const mappedRooms = rooms.map(room => ({
        ...room,
        events: mapRoomEvents(reservations, room.room_name),
      }));
      setRoomsData(mappedRooms);
      setToast({ visible: true, type: "success", message: "Data berhasil difilter!" });
      setTimeout(() => setToast({ visible: false, type: "", message: "" }), 2000);
    } catch {
      setToast({ visible: true, type: "error", message: "Filter gagal!" });
      setTimeout(() => setToast({ visible: false, type: "", message: "" }), 2000);
    }
    setLoading(false);
  };

  const today = new Date().toLocaleDateString("en-GB", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  });

  const times = useMemo(
    () => Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, "0")}:00`), []
  );

  const getEventClass = (status) =>
    ({
      Done: "bg-gray-100 border border-gray-300",
      "In Progress": "bg-green-50 border border-green-400",
      "Up Coming": "bg-orange-50 border border-orange-400",
      Booked: "bg-orange-50 border border-orange-400"
    }[status] || "bg-white border border-gray-200");

  const getBadgeClass = (status) =>
    ({
      Done: "bg-gray-200 text-gray-600",
      "In Progress": "bg-green-100 text-green-700",
      "Up Coming": "bg-orange-100 text-orange-700",
      Booked: "bg-orange-100 text-orange-700"
    }[status] || "bg-gray-50 text-gray-400");

  const handleRoomNameClick = (roomName) => {
    setSelectedRoomName(roomName); setShowForm(true); setStep(1); setFormData(null);
  };

  const getBookedTimesForRoom = (roomName) => {
    const bookedTimes = {};
    const room = roomsData.find(r => r.room_name === roomName);
    if (!room || !room.events) return bookedTimes;
    room.events.forEach(event => {
      if (!event.date) return;
      if (!bookedTimes[event.date]) bookedTimes[event.date] = [];
      bookedTimes[event.date].push([event.startTime, event.endTime]);
    });
    return bookedTimes;
  };

  return (
    <div className="flex flex-col mb-1">
      {toast.visible && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm transition-all duration-300 ${
          toast.type === "success" ? "bg-green-500"
            : toast.type === "error" ? "bg-red-500"
            : "bg-gray-500"
        }`}>
          {toast.message}
        </div>
      )}

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
            disabled={loading}
            className="border !border-orange-600 text-orange-600 w-[140px] h-[45px] rounded-md font-medium bg-transparent hover:bg-orange-50 transition duration-300"
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>
        <button
          onClick={() => {
            setShowForm(true); setStep(1); setFormData(null); setSelectedRoomName("");
          }}
          className="bg-[#FF7316] text-white px-5 py-2 w-[198px] h-[48px] rounded-md font-medium hover:bg-[#e76712] transition"
        >
          + Add New Reservation
        </button>
      </section>

      <div
        className="relative bg-white border border-gray-200 shadow-sm rounded-xl overflow-auto"
        style={{ width: "1320px", height: "770px", position: "relative" }}
      >
        {/* Time row */}
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

        {/* Schedule grid */}
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
            <div
              key={room.room_name}
              className="relative border-r border-dashed border-gray-200"
            >
              <button
                onClick={() => handleRoomNameClick(room.room_name)}
                className="w-full text-center font-semibold text-orange-700 py-3 border-b border-gray-200 hover:bg-orange-50 rounded-t-xl"
                style={{ fontSize: "18px", letterSpacing: "0.5px" }}
              >
                {room.room_name}
              </button>
              {Array.isArray(room.events) &&
                room.events.map((ev, idx) => {
                  const startTime = typeof ev.startTime === "string" ? ev.startTime : "";
                  const endTime = typeof ev.endTime === "string" ? ev.endTime : "";
                  const [sh, sm] = startTime.includes(":")
                    ? startTime.split(":").map(Number)
                    : [0, 0];
                  const [eh, em] = endTime.includes(":")
                    ? endTime.split(":").map(Number)
                    : [0, 0];
                  const st = sh * 60 + sm;
                  const et = eh * 60 + em;
                  const keyUnique = `${room.room_name}-${ev.company}-${startTime}-${endTime}-${ev.status}-${ev.id ?? idx}`;
                  return (
                    <div
                      key={keyUnique}
                      className={`absolute left-2 right-2 p-3 rounded-lg shadow-sm ${getEventClass(ev.status)}`}
                      style={{
                        top: `${(st / 60) * 60 + 40}px`,
                        height: `${Math.max(30, ((et - st) / 60) * 60)}px`,
                        minHeight: "28px"
                      }}
                    >
                      <p className="font-medium mb-1">{ev.company}</p>
                      <p className="text-xs mb-1 text-gray-500">
                        {startTime} - {endTime} WIB
                      </p>
                      <span
                        className={`absolute right-2 top-2 text-xs px-2 py-[2px] rounded-full ${getBadgeClass(ev.status)}`}
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

      {showForm && (
        <>
          {step === 1 && (
            <ReservationFormAdmin
              isOpen={showForm}
              onClose={() => { setShowForm(false); setStep(1); setFormData(null); setSelectedRoomName(""); }}
              onSubmit={handleNext}
              data={formData}
              rooms={roomsData}
              snacks={snacks}
              loadingSnacks={loadingSnacks}
              errorSnacks={errorSnacks}
              selectedRoomName={selectedRoomName}
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

      <ReservationSchedule
        isOpen={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        roomName={scheduleRoom}
        bookedTimes={getBookedTimesForRoom(scheduleRoom)}
        onNext={(data) => {
          setFormData((prev) => ({
            ...prev,
            reservationDate: data.reservationDate,
            startTime: data.startTime,
            endTime: data.endTime,
            room: scheduleRoom,
          }));
          setSelectedRoomName(scheduleRoom);
          setStep(1);
          setShowForm(true);
          setScheduleOpen(false);
        }}
      />
    </div>
  );
}
