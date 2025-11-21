import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { FiX, FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

/**
 * ReservationFormAdmin.jsx FINAL — REVISI TERBENAR!
 */
export default function ReservationFormAdmin({
  isOpen,
  onClose,
  onSubmit,
  data,
  rooms = [],
  snacks = [],
  loadingSnacks = false,
  errorSnacks = null,
  selectedRoomName = "",
}) {
  // State utamanya UUID untuk room
  const [participants, setParticipants] = useState(data?.participants ? String(data.participants) : "1");
  // Ambil UUID dari prop data/selectedRoomName jika ada
  const [roomId, setRoomId] = useState(() => {
    if (data?.room_id) return data.room_id;
    if (selectedRoomName) {
      const found = rooms.find(
        r => r.room_name === selectedRoomName || r.code === selectedRoomName || r.name === selectedRoomName
      );
      return found?.id || found?.room_id || "";
    }
    return "";
  });

  const [name, setName] = useState(data?.name || "");
  const [phone, setPhone] = useState(data?.phone || "");
  const [company, setCompany] = useState(data?.company || "");
  const [dateRange, setDateRange] = useState([
    data?.dateStart ? new Date(data.dateStart) : null,
    null,
  ]);
  const [startTime, setStartTime] = useState(data?.startTime || "");
  const [endTime, setEndTime] = useState(data?.endTime || "");
  const [addSnack, setAddSnack] = useState(data?.addSnack || false);
  const [snackCategory, setSnackCategory] = useState(data?.snackCategory || "");
  const [note, setNote] = useState(data?.note || "");
  const [formError, setFormError] = useState("");

  useEffect(() => {
    // Jika user klik room di luar form/reservation autocomplete, syncron langsung roomId dengan UUID rooms master
    if (selectedRoomName && rooms.length > 0) {
      const found = rooms.find(
        r =>
          r.room_name === selectedRoomName ||
          r.code === selectedRoomName ||
          r.name === selectedRoomName
      );
      if (found?.id) setRoomId(found.id);
    }
  }, [selectedRoomName, rooms]);

  const [startDate] = dateRange;
  const hourOptions = [...Array(24).keys()].map(i => `${i.toString().padStart(2, "0")}:00`);

  // Submit handler
  const handleNext = () => {
    setFormError("");
    if (!roomId || !name || !phone || !company || !startDate || !startTime || !endTime) {
      setFormError("Field wajib harus diisi semua.");
      return;
    }
    // Cek benar-benar UUID dari room master
    const foundRoom = rooms.find(
      r => String(r.id) === String(roomId) || String(r.room_id) === String(roomId)
    );
    if (!foundRoom?.id && !foundRoom?.room_id) {
      setFormError("Room ID tidak valid/tidak ditemukan. Periksa master ruangan!");
      return;
    }
    // DEBUG waktu development:
    // console.log("DEBUG UUID:", roomId, "foundRoom:", foundRoom);
    // Submit field untuk backend:
    const reservationData = {
      room_id: foundRoom.id || foundRoom.room_id,
      pemesan: name,
      no_hp: phone,
      company_name: company,
      date_reservation: startDate?.toISOString()?.slice(0, 10) || "",
      start_time: startTime,
      end_time: endTime,
      total_participant: Number(participants || 1),
      snack: addSnack ? snackCategory : "",
      note: note,
      status: "pending",
    };
    if (typeof onSubmit === "function") onSubmit(reservationData);
  };

  if (!isOpen) return null;
  const inputStyle = "h-[48px] border border-gray-300 rounded-lg px-4 text-[15px]";
  const labelStyle = "text-[15px] font-medium text-gray-700";
console.log("ROOMS MASTER:", rooms);

  return (
    <div className="fixed top-0 right-0 z-50 w-[456px] h-full max-h-screen bg-white shadow-2xl flex flex-col px-8 pt-5 pb-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-xl text-gray-800">Reservation Form</h2>
        <button onClick={onClose} className="p-1 text-gray-500 hover:text-orange-600">
          <FiX size={25} />
        </button>
      </div>
      <div className="flex flex-col gap-3 mb-6">
        {formError && (
          <div className="py-2 px-3 bg-red-100 text-red-600 text-sm rounded mb-2">{formError}</div>
        )}
        <label className={labelStyle}>Room Name</label>
        <select
          className={inputStyle}
          value={roomId}
          onChange={e => setRoomId(e.target.value)}
        >
          <option value="">Choose Room</option>
          {rooms.map(r => (
            <option key={r.id || r.room_id} value={r.id || r.room_id}>
              {r.room_name || r.code || r.name || r.id}
            </option>
          ))}
        </select>
        <label className={labelStyle}>Name</label>
        <input type="text" className={inputStyle} value={name} onChange={e => setName(e.target.value)} />
        <label className={labelStyle}>No.Hp</label>
        <input type="text" className={inputStyle} value={phone} onChange={e => setPhone(e.target.value)} />
        <label className={labelStyle}>Company/Organization</label>
        <input type="text" className={inputStyle} value={company} onChange={e => setCompany(e.target.value)} />
        <label className={labelStyle}>Date Reservation</label>
        <div className="relative">
          <DatePicker
            selectsStart
            selected={startDate}
            onChange={date => setDateRange([date, null])}
            dateFormat="dd/MM/yyyy"
            className={inputStyle + " bg-white"}
            placeholderText="Select date"
          />
          <FiCalendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={22} />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className={labelStyle}>Start Time</label>
            <select className={inputStyle + " w-full"} value={startTime} onChange={e => setStartTime(e.target.value)}>
              <option value="">Select time</option>
              {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className={labelStyle}>End Time</label>
            <select className={inputStyle + " w-full"} value={endTime} onChange={e => setEndTime(e.target.value)}>
              <option value="">Select time</option>
              {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>
        <label className={labelStyle}>Total Participants</label>
        <input
          type="number"
          min={1}
          className={inputStyle}
          value={participants}
          onChange={e => { const val = e.target.value; if (/^\d*$/.test(val)) setParticipants(val); }}
        />
        <div className="flex items-center gap-2 min-h-[48px]">
          <input type="checkbox" className="w-5 h-5 accent-[#FF7316] rounded-md" checked={addSnack} onChange={() => setAddSnack(!addSnack)} id="snackbox" />
          <label htmlFor="snackbox" className="select-none text-[15px]">Add Snack</label>
        </div>
        {addSnack && (
          <>
            <label className={labelStyle}>Snack Category</label>
            {loadingSnacks ? (
              <div className="py-3 text-center text-gray-500">Loading snacks...</div>
            ) : errorSnacks ? (
              <div className="py-3 text-center text-red-500">{errorSnacks}</div>
            ) : (
              <select className={inputStyle} value={snackCategory} onChange={e => setSnackCategory(e.target.value)}>
                <option value="">Choose snack</option>
                {snacks.map(opt =>
                  <option key={opt.id || opt.value || opt.name} value={opt.value || opt.name}>{opt.label || opt.name}</option>
                )}
              </select>
            )}
          </>
        )}
        <label className={labelStyle}>Note</label>
        <textarea
          className="border border-gray-300 rounded-lg px-4 py-3 text-[15px] h-[80px] resize-none"
          value={note}
          style={{ resize: "none" }}
          onChange={e => setNote(e.target.value)}
        />
      </div>
      <button
        className="h-[48px] w-full bg-[#FF7316] text-white font-semibold rounded-lg text-[16px] mt-1"
        type="button"
        style={{ minHeight: "48px", padding: 0, lineHeight: "48px" }}
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
}

ReservationFormAdmin.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  data: PropTypes.object,
  rooms: PropTypes.array,
  snacks: PropTypes.array,
  loadingSnacks: PropTypes.bool,
  errorSnacks: PropTypes.string,
  selectedRoomName: PropTypes.string,
};
