import React, { useState, useEffect, useCallback, useRef } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import "react-datepicker/dist/react-datepicker.css";
import ReservationFormAdmin from "../components/ReservationFormAdmin";
import ReservationDetailAdmin from "../components/ReservationDetailAdmin";
import ReservationSchedule from "../components/ReservationSchedule";
import { fetchRooms } from "../API/roomAPI";
import { fetchSnacks } from "../API/snackAPI";
import {
  fetchAdminReservations,
  createAdminReservation,
  filterAdminReservations,
} from "../API/ReservationScheduleAdminAPI";

const SLOT_START = 6;
const SLOT_END = 18;
const SLOT_ROW_HEIGHT = 56;
const ROOM_COL_WIDTH = 389;
const TIME_COL_WIDTH = 70;
const ROOMS_PER_PAGE = 3;

export default function Reservation() {
  const [roomsData, setRoomsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [toast, setToast] = useState({ visible: false, type: "", message: "" });
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(null);
  const [snacks, setSnacks] = useState([]);
  const [loadingSnacks, setLoadingSnacks] = useState(false);
  const [errorSnacks, setErrorSnacks] = useState(null);
  const [selectedRoomName, setSelectedRoomName] = useState("");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleRoom, setScheduleRoom] = useState("");
  const [page, setPage] = useState(0);
  const dragRef = useRef(null);

  useEffect(() => {
    setLoadingSnacks(true);
    fetchSnacks()
      .then((data) => setSnacks(data))
      .catch(() => setErrorSnacks("Failed to load snacks"))
      .finally(() => setLoadingSnacks(false));
  }, []);

  const mapRoomEvents = useCallback(
    (reservations, roomId) =>
      Array.isArray(reservations)
        ? reservations
            .filter(ev => `${ev.room_id}` === `${roomId}`)
            .sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""))
            .map(ev => ({
              ...ev,
              company: ev.company_name || ev.pemesan || "-",
              status: ev.status || ((ev.date_reservation >= (new Date().toISOString().slice(0, 10))) ? "Pending" : "Done"),
            }))
        : [],
    []
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const roomsRaw = await fetchRooms();
      const rooms = Array.isArray(roomsRaw) ? roomsRaw : roomsRaw?.data ?? [];
      const reservations = await fetchAdminReservations();
      const mappedRooms = rooms.map(room => ({
        ...room,
        room_name: room.room_name || room.name || room.id || "-",
        events: mapRoomEvents(reservations, room.id || room.room_id),
      }));
      setRoomsData(mappedRooms);
    } catch {
      setToast({ visible: true, type: "error", message: "Failed to load rooms or reservations" });
      setTimeout(() => setToast({ visible: false, type: "", message: "" }), 3500);
    }
    setLoading(false);
  }, [mapRoomEvents]);

  useEffect(() => { loadData(); }, [loadData]);

  const totalPage = Math.max(1, Math.ceil(roomsData.length / ROOMS_PER_PAGE));
  const startIdx = page * ROOMS_PER_PAGE;
  const roomsPage = roomsData.slice(startIdx, startIdx + ROOMS_PER_PAGE);

  const times = Array.from({ length: SLOT_END - SLOT_START + 1 }, (_, i) =>
    `${(SLOT_START + i).toString().padStart(2, "0")}:00`
  );

  // ===== FIX: Blok box presisi sesuai jam dan menit pesanan =====
  function getSlotPosition(ev) {
  const [startH, startM] = (ev.start_time || "06:00").split(":").map(Number);
  const [endH, endM] = (ev.end_time || "07:00").split(":").map(Number);
  const startMinutes = (startH * 60 + startM) - (SLOT_START * 60);
  const endMinutes = (endH * 60 + endM) - (SLOT_START * 60);
  const top = 58 + (startMinutes / 60) * SLOT_ROW_HEIGHT;
  const height = Math.max(28, ((endMinutes - startMinutes) / 60) * SLOT_ROW_HEIGHT) - 10;
  return { top, height };
}


  const barWidth = ROOM_COL_WIDTH * ROOMS_PER_PAGE;
  const sliderWidth = barWidth / totalPage;
  const handleRectDrag = e => {
    const bar = dragRef.current.getBoundingClientRect();
    const onMove = me => {
      const x = (me.type === "touchmove" ? me.touches[0].clientX : me.clientX) - bar.left;
      let percent = (x - sliderWidth/2) / (bar.width - sliderWidth);
      percent = Math.max(0, Math.min(1, percent));
      setPage(Math.round(percent * (totalPage - 1)));
    };
    const up = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchend", up);
    e.preventDefault();
  };
  const handleRectClick = e => {
    const bar = dragRef.current.getBoundingClientRect();
    const x = (e.type === "touchstart" ? e.touches[0].clientX : e.clientX) - bar.left;
    let percent = (x - sliderWidth/2) / (bar.width - sliderWidth);
    percent = Math.max(0, Math.min(1, percent));
    setPage(Math.round(percent * (totalPage - 1)));
  };

  return (
    <>
      {/* FILTER BAR */}
      <section className="bg-white border border-gray-200 rounded-xl py-4 shadow-sm mb-3 w-full px-0" style={{ position: "relative", zIndex: 1 }}>
        <div className="flex flex-row flex-wrap items-center gap-10 px-4 w-full">
          <p className="font-semibold text-gray-900 min-w-max mr-1" style={{whiteSpace:"nowrap"}}>
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long", day: "numeric", month: "long", year: "numeric"
            })}
          </p>
          {/* Start Date */}
          <div className="relative flex items-center"
            style={{
              minWidth: "164px",
              width: "274px",
              height: "48px",
              border: "1px solid #D0D5DD",
              borderRadius: "8px",
              background: "#fff",
              zIndex: 10
            }}>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              placeholderText="Select start date"
              dateFormat="yyyy-MM-dd"
              portalId="root"
              autoComplete="off"
              showPopperArrow={false}
              popperPlacement="bottom"
              className="w-full h-full pl-4 pr-10 outline-none border-none bg-transparent text-[#344054] text-[16px] font-medium placeholder-[#98A2B3] focus:ring-0"
            />
            <FaCalendarAlt
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
              style={{ zIndex: 10 }}
            />
          </div>
          {/* End Date */}
          <div className="relative flex items-center"
            style={{
              minWidth: "164px",
              width: "274px",
              height: "48px",
              border: "1px solid #D0D5DD",
              borderRadius: "8px",
              background: "#fff",
              zIndex: 10
            }}>
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              placeholderText="Select end date"
              dateFormat="yyyy-MM-dd"
              portalId="root"
              autoComplete="off"
              showPopperArrow={false}
              popperPlacement="bottom"
              className="w-full h-full pl-4 pr-10 outline-none border-none bg-transparent text-[#344054] text-[16px] font-medium placeholder-[#98A2B3] focus:ring-0"
            />
            <FaCalendarAlt
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
              style={{ zIndex: 10 }}
            />
          </div>
          <button
            onClick={async () => {
              if (!startDate || !endDate) {
                setToast({
                  visible: true,
                  type: "error",
                  message: "Pilih Start Date dan End Date terlebih dahulu!"
                });
                setTimeout(() => setToast({ visible: false, type: "", message: "" }), 2500);
                return;
              }
              setLoading(true);
              try {
                const reservations = await filterAdminReservations(startDate, endDate);
                const roomsRaw = await fetchRooms();
                const rooms = Array.isArray(roomsRaw) ? roomsRaw : roomsRaw?.data ?? [];
                const mappedRooms = rooms.map(room => ({
                  ...room,
                  room_name: room.room_name || room.name || room.id || "-",
                  events: mapRoomEvents(reservations, room.id || room.room_id)
                }));
                setRoomsData(mappedRooms);
                setToast({
                  visible: true,
                  type: "success",
                  message: "Data berhasil difilter!"
                });
                setTimeout(() => setToast({ visible: false, type: "", message: "" }), 2000);
              } catch {
                setToast({
                  visible: true,
                  type: "error",
                  message: "Filter gagal!"
                });
                setTimeout(() => setToast({ visible: false, type: "", message: "" }), 2000);
              }
              setLoading(false);
            }}
            disabled={loading}
            className="h-[48px] w-[155px] border-2 !border-[#FF7316] text-[#FF7316] rounded-lg font-semibold bg-white hover:bg-[#FFF5EC] transition-all duration-200 flex items-center justify-center"
          >
            {loading ? "Loading..." : "Search"}
          </button>
          <div className="flex-1" />
          <button
            onClick={() => {
              setShowForm(true);
              setStep(1);
              setFormData(null);
              setSelectedRoomName("");
            }}
            className="h-[48px] min-w-[188px] bg-[#FF7316] text-white rounded-lg font-semibold text-lg hover:bg-[#e76712] transition flex items-center justify-center ml-3"
          >
            + Add New Reservation
          </button>
        </div>
      </section>

      {/* JADWAL GRID */}
      <div className="w-full px-0" style={{ position: "relative", zIndex: 0 }}>
        <div
          className="overflow-x-auto"
          style={{ width: "100%" }}
        >
          <div
            className="relative"
            style={{
              minWidth: TIME_COL_WIDTH + ROOM_COL_WIDTH * roomsPage.length,
              overflow: "visible",
              backgroundColor: "#FFF"
            }}
          >
            {/* Header Rooms */}
            <div className="flex bg-white"
              style={{ height: 58, borderBottom: "1px solid #EBEBEB", position: "sticky", top: 0, zIndex: 2 }}>
              <div style={{ width: TIME_COL_WIDTH }} />
              {roomsPage.map((room, i) => (
                <div key={i} style={{
                  width: ROOM_COL_WIDTH,
                  borderRight: "1px solid #EBEBEB",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "#12203A",
                  textAlign: "center"
                }}>
                  {room.room_name}
                </div>
              ))}
            </div>
            {/* Time Slots */}
            {times.map((h, i) => (
              <div key={h} className="flex border-b border-dashed border-[#EBEBEB]" style={{ height: SLOT_ROW_HEIGHT, background: "#FFF" }}>
                <div style={{
                  width: TIME_COL_WIDTH, fontWeight: 600, color: "#888", fontSize: 15, display: "flex", alignItems: "center",
                  justifyContent: "flex-end", paddingRight: 8, borderRight: '1px solid #EBEBEB',
                }}>{h}</div>
                {roomsPage.map((_, j) => (
                  <div key={j} style={{ width: ROOM_COL_WIDTH, borderRight: "1px solid #EBEBEB", height: "100%" }} />
                ))}
              </div>
            ))}
            {/* Event Slots */}
            {roomsPage.map((room, cidx) =>
              Array.isArray(room.events) &&
              room.events.map(ev => {
                const { top, height } = getSlotPosition(ev);
                return (
                  <div key={ev.id}
                    className="absolute rounded-xl bg-[#FFF5EC] border-2 border-[#FF9D3A] shadow flex flex-row items-start"
                    style={{
                      left: TIME_COL_WIDTH + cidx * ROOM_COL_WIDTH + 6,
                      top, width: ROOM_COL_WIDTH - 17, height,
                      zIndex: 3
                    }}>
                    <div style={{
                      width: 4, height: "100%",
                      background: "#FF7316", borderRadius: "12px 0 0 12px"
                    }} />
                    <div style={{ marginLeft: 14, padding: "9px 13px 9px 0", flex: 1, minWidth: 0, height: "100%" }}>
                      <div style={{ fontWeight: 700, fontSize: 15, color: "#111827", marginBottom: 2 }}>{ev.company}</div>
                      <div style={{ fontSize: 12, color: "#909090" }}>{ev.start_time} - {ev.end_time} WIB</div>
                      <span style={{
                        marginTop: 10, fontSize: 13, alignSelf: "flex-end", padding: "2px 10px",
                        borderRadius: 8, background: "#FFE0BF", color: "#FF7316", fontWeight: 600, display: "inline-block"
                      }}>{ev.status}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        {/* Pagination Slider */}
        <div className="w-full flex justify-start items-center mt-3" style={{ height: 18 }}>
          <div
            ref={dragRef}
            className="bg-[#C4C4C4] rounded-full"
            style={{
              width: barWidth,
              height: 8,
              position: "relative",
              cursor: "pointer",
              marginLeft: 0
            }}
            onMouseDown={handleRectDrag}
            onTouchStart={handleRectDrag}
            onClick={handleRectClick}
            onTouchEnd={e => e.stopPropagation()}
          >
            <div style={{
              position: "absolute",
              left: `${page * sliderWidth}px`,
              top: 0,
              width: sliderWidth,
              height: 8,
              borderRadius: 8,
              background: "#FF7316",
              transition: "left 0.23s cubic-bezier(.62,0,.51,1)"
            }} />
          </div>
        </div>
      </div>

      {/* Modals & Forms */}
      {showForm && (
        <>
          {step === 1 && (
            <ReservationFormAdmin
              isOpen={showForm}
              onClose={() => { setShowForm(false); setStep(1); setFormData(null); setSelectedRoomName(""); }}
              onSubmit={data => {
                const foundRoom = roomsData.find(room =>
                  room.room_name === data.room ||
                  room.name === data.room ||
                  room.id === data.room ||
                  room.room_id === data.room
                );
                if (!foundRoom?.id && !foundRoom?.room_id) {
                  setToast({ visible: true, type: "error", message: "Room ID tidak valid/tidak ditemukan." });
                  setTimeout(() => setToast({ visible: false, type: "", message: "" }), 2500);
                  return;
                }
                setFormData({ ...data, room_id: foundRoom.id || foundRoom.room_id });
                setStep(2);
                setShowForm(true);
              }}
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
              onSubmit={async (finalData) => {
                try {
                  await createAdminReservation(finalData);
                  setToast({ visible: true, type: "success", message: "Reservation added" });
                  setTimeout(() => setToast({ visible: false, type: "", message: "" }), 2500);
                  await loadData();
                } catch (e) {
                  setToast({ visible: true, type: "error", message: "Failed to add reservation" });
                  setTimeout(() => setToast({ visible: false, type: "", message: "" }), 2500);
                }
                setStep(1); setFormData(null); setShowForm(false); setSelectedRoomName("");
              }}
              rooms={roomsData}
            />
          )}
        </>
      )}
      <ReservationSchedule
        isOpen={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        roomName={scheduleRoom}
        bookedTimes={{}}
        onNext={data => {
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
      {/* Toast Notification */}
      {toast.visible && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg text-white text-sm transition-all duration-300 ${
          toast.type === "success" ? "bg-green-500"
            : toast.type === "error" ? "bg-red-500"
            : "bg-gray-500"
        }`}>
          {toast.message}
        </div>
      )}
    </>
  );
}
