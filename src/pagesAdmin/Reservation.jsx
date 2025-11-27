import React, { useState, useEffect, useCallback } from "react";
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
const SLOT_ROW_HEIGHT = 70;
const ROOM_COL_WIDTH = 400;
const TIME_COL_WIDTH = 74;
const ROOMS_PER_PAGE = 3;
const GRID_CONTAINER_WIDTH = TIME_COL_WIDTH + (ROOM_COL_WIDTH * ROOMS_PER_PAGE);
const GRID_MAX_WIDTH = 1320;
const GRID_SIDE_PAD = (GRID_MAX_WIDTH - GRID_CONTAINER_WIDTH) / 2;
const GRID_HEADER_HEIGHT = 70;

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
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [scheduleRoom, setScheduleRoom] = useState("");
  const [page, setPage] = useState(0);

  useEffect(() => {
    setLoadingSnacks(true);
    fetchSnacks()
      .then((data) => setSnacks(data))
      .catch(() => setErrorSnacks("Failed to load snacks"))
      .finally(() => setLoadingSnacks(false));
  }, []);

  const mapRoomEvents = useCallback(
    (reservations, room) =>
      reservations
        .filter(ev => String(ev.room_id) === String(room.id))
        .sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""))
        .map(ev => ({
          ...ev,
          company: ev.company_name || ev.pemesan || "-",
          status: ev.status ||
            ((ev.date_reservation >= (new Date().toISOString().slice(0, 10))) ? "Pending" : "Done"),
        })),
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
        room_name: room.code || room.room_name || room.name || room.id || "-",
        events: mapRoomEvents(reservations, room)
      }));
      setRoomsData(mappedRooms);
      setPage(0);
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

  function getSlotPosition(ev) {
    const startIdx = times.findIndex(h => h === (ev.start_time || "06:00").slice(0, 5));
    const endIdx = times.findIndex(h => h === (ev.end_time || "07:00").slice(0, 5));
    const [startH, startM] = (ev.start_time || "06:00").split(":").map(Number);
    const [endH, endM] = (ev.end_time || "07:00").split(":").map(Number);

    const startOffset = (startM / 60) * SLOT_ROW_HEIGHT;
    const endOffset = (endM / 60) * SLOT_ROW_HEIGHT;
    const top = GRID_HEADER_HEIGHT + (startIdx * SLOT_ROW_HEIGHT) + startOffset;
    const height = Math.max(28, ((endIdx - startIdx) * SLOT_ROW_HEIGHT) + endOffset - startOffset - 10);
    return { top, height };
  }

  return (
    <>
      {/* Action Bar */}
      <section
        style={{
          maxWidth: `${GRID_MAX_WIDTH}px`,
          minWidth: `${GRID_MAX_WIDTH}px`,
          margin: "0 auto 22px auto",
          padding: `0 ${GRID_SIDE_PAD}px`,
          boxSizing: "border-box",
          background: "#FFF",
          borderRadius: 24,
          height: "88px",
          display: "flex", alignItems: "center"
        }}>
        <div className="flex flex-row items-center gap-10 w-full" style={{ minWidth: `${GRID_CONTAINER_WIDTH}px` }}>
          <p className="font-semibold text-gray-900 min-w-max mr-2" style={{ whiteSpace: "nowrap" }}>
            {new Date().toLocaleDateString("en-GB", {
              weekday: "long", day: "numeric", month: "long", year: "numeric"
            })}
          </p>
          <div className="relative flex items-center"
            style={{
              width: "252px",
              height: "48px",
              border: "1px solid #D0D5DD",
              borderRadius: "8px",
              background: "#fff"
            }}>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              placeholderText="Select start date"
              dateFormat="yyyy-MM-dd"
              portalId="root"
              autoComplete="off"
              showPopperArrow={false}
              popperClassName="datepicker-popper-small"
              calendarClassName="datepicker-small"
              popperPlacement="bottom-start"
              className="w-full h-full pl-4 pr-10 outline-none border-none bg-transparent text-[#344054] text-[16px] font-medium placeholder-[#98A2B3] focus:ring-0"
            />
            <FaCalendarAlt
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              size={20}
              style={{ zIndex: 10 }}
            />
          </div>
          <div className="relative flex items-center"
            style={{
              width: "252px",
              height: "48px",
              border: "1px solid #D0D5DD",
              borderRadius: "8px",
              background: "#fff",
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
                  message: "[translate:Pilih Start Date dan End Date terlebih dahulu!]"
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
                  room_name: room.code || room.room_name || room.name || room.id || "-",
                  events: mapRoomEvents(reservations, room)
                }));
                setRoomsData(mappedRooms);
                setPage(0);
                setToast({
                  visible: true,
                  type: "success",
                  message: "[translate:Data berhasil difilter!]"
                });
                setTimeout(() => setToast({ visible: false, type: "", message: "" }), 2000);
              } catch {
                setToast({
                  visible: true,
                  type: "error",
                  message: "[translate:Filter gagal!]"
                });
                setTimeout(() => setToast({ visible: false, type: "", message: "" }), 2000);
              }
              setLoading(false);
            }}
            disabled={loading}
            className="h-[48px] w-[150px] border-2 !border-[#FF7316] text-[#FF7316] rounded-lg font-semibold bg-white hover:bg-[#FFF5EC] transition-all duration-200 flex items-center justify-center "
          >
            {loading ? "[translate:Loading...]" : "Search"}
          </button>
          <div className="flex-1" />
          <button
            onClick={() => {
              setShowForm(true);
              setStep(1);
              setFormData(null);
            }}
            className="h-[48px] min-w-[200px] bg-[#FF7316] text-white rounded-lg font-semibold text-lg hover:bg-[#e76712] transition flex items-center justify-center ml-3"
          >
            + Add New Reservation
          </button>
        </div>
      </section>

      {/* GRID SCHEDULE - Full Figma Style */}
      <div
        style={{
          maxWidth: `${GRID_MAX_WIDTH}px`,
          minWidth: `${GRID_MAX_WIDTH}px`,
          margin: "0 auto",
          padding: `0 ${GRID_SIDE_PAD}px 36px ${GRID_SIDE_PAD}px`,
          background: "#FFF",
          borderRadius: 24,
          overflowX: "auto"
        }}>
        <div
          style={{
            width: `${GRID_CONTAINER_WIDTH}px`,
            minWidth: `${GRID_CONTAINER_WIDTH}px`,
            position: "relative",
            margin: "0 auto"
          }}>
          {/* HEADER */}
          <div
            style={{
              height: GRID_HEADER_HEIGHT,
              display: "flex",
              minWidth: `${GRID_CONTAINER_WIDTH}px`,
              borderBottom: "1px solid #EBEBEB"
            }}>
            <div style={{ width: TIME_COL_WIDTH, borderRight: "1px solid #EBEBEB" }} />
            {roomsPage.map((room, i) => (
              <div key={i} style={{
                width: ROOM_COL_WIDTH,
                borderRight: i < ROOMS_PER_PAGE - 1 ? "1px solid #EBEBEB" : "none",
                fontWeight: 700,
                fontSize: 18,
                color: "#12203A",
                textAlign: "center",
                display: "flex", alignItems: "center", justifyContent: "center",
                height: "100%",
                background: "#fff"
              }}>{room.room_name}</div>
            ))}
          </div>
          {/* VERTICAL GRIDLINES */}
          {Array.from({ length: ROOMS_PER_PAGE + 1 }).map((_, i) => (
            <div
              key={`vgridline${i}`}
              style={{
                position: "absolute",
                left: `${TIME_COL_WIDTH + i * ROOM_COL_WIDTH}px`,
                top: GRID_HEADER_HEIGHT,
                bottom: 0,
                width: 0,
                borderLeft: "1px dashed #EBEBEB",
                zIndex: 1,
                pointerEvents: "none"
              }}
            />
          ))}
          {/* ROWS JAMS + Horizontal GRIDLINE */}
          {times.map((h, i) => (
            <div key={h}
              style={{
                display: "flex", position: "relative",
                height: SLOT_ROW_HEIGHT,
                borderBottom: "1px dashed #EBEBEB",
                background: "#FFF",
                minWidth: `${GRID_CONTAINER_WIDTH}px`,
                alignItems: "center"
              }}>
              <div style={{
                width: TIME_COL_WIDTH,
                borderRight: "1px solid #EBEBEB",
                fontWeight: 600,
                color: "#888",
                fontSize: 16,
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingRight: 8,
                height: "100%"
              }}>{h}</div>
              {roomsPage.map((room, j) => (
                <div key={j}
                  style={{
                    width: ROOM_COL_WIDTH,
                    height: "100%",
                    borderRight: j < ROOMS_PER_PAGE - 1 ? "1px solid #EBEBEB" : "none"
                  }} />
              ))}
            </div>
          ))}
          {/* EVENTS BLOK */}
          {roomsPage.map((room, cidx) =>
            Array.isArray(room.events) &&
            room.events.map(ev => {
              const { top, height } = getSlotPosition(ev);
              return (
                <div
                  key={ev.id}
                  className="absolute rounded-xl bg-[#FFF5EC] border-2 border-[#FF9D3A] shadow flex flex-row items-start"
                  style={{
                    left: TIME_COL_WIDTH + cidx * ROOM_COL_WIDTH + 7,
                    top,
                    width: ROOM_COL_WIDTH - 18,
                    height,
                    zIndex: 3,
                    boxShadow: "0 4px 20px 0 rgba(83, 54, 32, 0.07)"
                  }}>
                  <div style={{
                    width: 4, height: "100%",
                    background: "#FF7316", borderRadius: "12px 0 0 12px"
                  }} />
                  <div style={{
                    marginLeft: 14,
                    padding: "9px 13px 9px 0",
                    flex: 1, minWidth: 0, height: "100%"
                  }}>
                    <div style={{
                      fontWeight: 700,
                      fontSize: 15,
                      color: "#111827",
                      marginBottom: 2
                    }}>{ev.company}</div>
                    <div style={{ fontSize: 13, color: "#909090" }}>
                      {ev.start_time} - {ev.end_time} WIB
                    </div>
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

        {/* Pagination - Professional Style like Figma */}
        {totalPage > 1 && (
          <div className="w-full flex justify-center items-center mt-8 gap-2 select-none" style={{ minHeight: 40 }}>
            {/* Prev Button */}
            <button
              onClick={() => setPage(page > 0 ? page - 1 : 0)}
              disabled={page === 0}
              className="px-4 py-2 rounded-l-lg bg-white border border-[#D0D5DD] text-[#344054] font-semibold text-sm hover:bg-[#FFF5EC] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{ marginRight: 4 }}
            >
              ← [translate:Prev]
            </button>

            {/* Page Numbers */}
            {Array.from({ length: totalPage }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx)}
                className={`px-3 py-2 border border-[#D0D5DD] font-semibold text-sm transition-all
                  ${page === idx
                    ? "bg-[#FF7316] text-white border-[#FF7316]"
                    : "bg-white text-[#344054] hover:bg-[#FFF5EC]"
                  }`}
                style={{
                  borderLeftWidth: idx > 0 ? "1px" : "1px",
                  borderRadius: 0
                }}
              >
                {idx + 1}
              </button>
            ))}

            {/* Next Button */}
            <button
              onClick={() => setPage(page < totalPage - 1 ? page + 1 : page)}
              disabled={page >= totalPage - 1}
              className="px-4 py-2 rounded-r-lg bg-white border border-[#D0D5DD] text-[#344054] font-semibold text-sm hover:bg-[#FFF5EC] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              style={{ marginLeft: 4 }}
            >
              [translate:Next] →
            </button>
          </div>
        )}
      </div>

      {/* Modal, toast, dsb */}
      {showForm && (
        <>
          {step === 1 && (
            <ReservationFormAdmin
              isOpen={showForm}
              onClose={() => {
                setShowForm(false);
                setStep(1);
                setFormData(null);
              }}
              onSubmit={data => {
                setFormData(data);
                setStep(2);
                setShowForm(true);
              }}
              data={formData}
              rooms={roomsData}
              snacks={snacks}
              loadingSnacks={loadingSnacks}
              errorSnacks={errorSnacks}
              selectedRoomId={formData?.room_id || ""}
              onRoomChange={(newRoomId) => {
                setFormData(prev => ({ ...prev, room_id: newRoomId }));
              }}
            />
          )}
          {step === 2 && (
            <ReservationDetailAdmin
              data={formData}
              onBack={() => setStep(1)}
              onSubmit={async (finalData) => {
                try {
                  const response = await createAdminReservation(finalData);
                  setToast({ visible: true, type: "success", message: "[translate:Reservation added]" });
                  let dateBooking = finalData.date_reservation || response?.data?.date_reservation;
                  if (dateBooking) {
                    const bookingDate = new Date(dateBooking);
                    setStartDate(bookingDate);
                    setEndDate(bookingDate);
                  }
                  await loadData();
                } catch (e) {
                  setToast({ visible: true, type: "error", message: "[translate:Failed to add reservation]" });
                }
                setStep(1);
                setFormData(null);
                setShowForm(false);
                setTimeout(() => setToast({ visible: false, type: "", message: "" }), 2500);
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
          setStep(1);
          setShowForm(true);
          setScheduleOpen(false);
        }}
      />
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
