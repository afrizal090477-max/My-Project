import React, { useState } from "react";
import PropTypes from "prop-types";
import { FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ROOM_LIST = [
  "Aster Room",
  "Tulip Room",
  "Bluebell",
  "Camellia",
  "Daisy",
  "Edelweiss",
  "Freesia",
  "Gardenia",
  "Hibiscus",
  "Ivy",
  "Jasmine",
  "Lily",
];

const SNACK_OPTIONS = [
  { value: "coffee1", label: "Coffee Break Package 1 - Rp 20.000/people" },
  { value: "coffee2", label: "Coffee Break Package 2 - Rp 50.000/people" },
  { value: "lunch1", label: "Lunch Package 1 - Rp 20.000/people" },
  { value: "lunch2", label: "Lunch Package 2 - Rp 50.000/people" },
];

const generateTimeOptions = () => {
  const arr = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 15) {
      arr.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return arr;
};
const TIME_OPTIONS = generateTimeOptions();

const DateCustomInput = React.forwardRef(function DateCustomInput(
  { value, onClick, placeholder },
  ref
) {
  return (
    <div
      className="flex w-full items-center justify-between h-12 px-4 rounded-lg border border-gray-300 bg-white cursor-pointer"
      onClick={onClick}
      ref={ref}
      tabIndex={0}
      onKeyDown={e => (e.key === "Enter" || e.key === " ") && onClick(e)}
    >
      <span className={value ? "text-gray-900" : "text-gray-400"}>
        {value || placeholder}
      </span>
      <FiCalendar className="text-2xl text-gray-400" />
    </div>
  );
});
DateCustomInput.displayName = "DateCustomInput";

function ReservationForm({
  isOpen = true,
  onClose,
  onSubmit,
  onAddReservation,
  data = {},
  mode = "user"
}) {
  const [form, setForm] = useState({
    room: data?.room || "",
    name: data?.name || "",
    phone: data?.phone || "",
    company: data?.company || "",
    date: data?.date || null,
    startTime: data?.startTime || "",
    endTime: data?.endTime || "",
    participants: data?.participants || "",
    addSnack: data?.addSnack || false,
    snackCategory: data?.snackCategory || "",
    note: data?.note || ""
  });

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const mandatory =
      mode === "admin"
        ? [
            "room", "name", "phone", "company", "date", "startTime", "endTime", "participants"
          ]
        : [
            "room", "name", "phone", "company", "date", "startTime", "endTime", "participants"
          ];
    for (let f of mandatory)
      if (!form[f]) {
        alert("Please fill all required fields!");
        return;
      }
    if (form.addSnack && !form.snackCategory) {
      alert("Please select a snack category!");
      return;
    }
    if (typeof onSubmit === "function") onSubmit(form);
    if (typeof onAddReservation === "function") onAddReservation(form);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* BACKDROP TRANSPARAN */}
      <div
        className="fixed inset-0 z-40 bg-[rgba(255,255,255,0.01)] pointer-events-auto"
        onClick={onClose}
      />
      <div className="fixed top-0 right-0 w-[456px] h-full max-h-screen z-50 bg-white shadow-2xl flex flex-col px-8 pt-3 pb-6 overflow-y-auto transition-all">
        <div className="flex items-center h-[56px] mb-2 sticky top-0 bg-white z-10">
          <button
            onClick={onClose}
            className="mr-3 p-0"
            aria-label="Back"
            type="button"
          >
            <svg width={28} height={28} fill="none" viewBox="0 0 28 28">
              <path
                d="M18 22L10 14L18 6"
                stroke="#FF7316"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <span className="font-semibold text-lg text-gray-800 mt-1">
            Reservation Form
          </span>
        </div>
        <form className="flex flex-col gap-3" onSubmit={handleSubmit} autoComplete="off">
          {/* Room Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[15px] font-medium text-gray-700 mb-[2px]">
              Room Name
            </label>
            <select
              value={form.room}
              onChange={e => handleChange("room", e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 text-gray-900 bg-white"
              required
            >
              <option value="">Room Name</option>
              {ROOM_LIST.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          {/* Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[15px] font-medium text-gray-700 mb-[2px]">
              Name
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => handleChange("name", e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400"
              placeholder="Name"
              required
              autoComplete="off"
            />
          </div>
          {/* No. HP */}
          <div className="flex flex-col gap-1">
            <label className="text-[15px] font-medium text-gray-700 mb-[2px]">
              No.Hp
            </label>
            <input
              type="text"
              value={form.phone}
              onChange={e => handleChange("phone", e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400"
              placeholder="No.Hp"
              required
            />
          </div>
          {/* Company */}
          <div className="flex flex-col gap-1">
            <label className="text-[15px] font-medium text-gray-700 mb-[2px]">
              Company/Organization
            </label>
            <input
              type="text"
              value={form.company}
              onChange={e => handleChange("company", e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400"
              placeholder="Company/Organization"
              required
            />
          </div>
          {/* Date Reservation */}
          <div className="flex flex-col gap-1">
            <label className="text-[15px] font-medium text-gray-700 mb-[2px]">
              Date Reservation
            </label>
            <DatePicker
              selected={form.date}
              onChange={date => handleChange("date", date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              customInput={<DateCustomInput placeholder="Select date" />}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400"
              showPopperArrow={false}
            />
          </div>
          {/* Start & End Time */}
          <div className="flex gap-3">
            <div className="flex flex-col flex-1 gap-1">
              <label className="text-[15px] font-medium text-gray-700 mb-[2px]">Start Time</label>
              <select
                value={form.startTime}
                onChange={e => handleChange("startTime", e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-gray-300 text-gray-900 bg-white"
                required
              >
                <option value="">Start Time</option>
                {TIME_OPTIONS.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col flex-1 gap-1">
              <label className="text-[15px] font-medium text-gray-700 mb-[2px]">End Time</label>
              <select
                value={form.endTime}
                onChange={e => handleChange("endTime", e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-gray-300 text-gray-900 bg-white"
                required
              >
                <option value="">End Time</option>
                {TIME_OPTIONS.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Total Participants */}
          <div className="flex flex-col gap-1">
            <label className="text-[15px] font-medium text-gray-700 mb-[2px]">
              Total Participants
            </label>
            <input
              type="number"
              min={1}
              value={form.participants}
              onChange={e => handleChange("participants", e.target.value)}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400"
              placeholder="Total Participants"
              required
              autoComplete="off"
            />
          </div>
          {/* Add Snack */}
          <div className="flex items-center mb-1 pt-1">
            <input
              id="snack"
              type="checkbox"
              checked={form.addSnack}
              onChange={e => handleChange("addSnack", e.target.checked)}
              className="mr-2 w-[18px] h-[18px] accent-[#FF7316]"
            />
            <label htmlFor="snack" className="text-[15px] text-gray-700 font-medium cursor-pointer select-none">
              Add Snack
            </label>
          </div>
          {form.addSnack && (
            <div className="flex flex-col gap-1">
              <label className="text-[15px] font-medium text-gray-700 mb-[2px]">
                Snack Category
              </label>
              <select
                value={form.snackCategory}
                onChange={e => handleChange("snackCategory", e.target.value)}
                className="w-full h-12 px-4 rounded-lg border border-gray-300 text-gray-900"
                required
              >
                <option value="">Snack Category</option>
                {SNACK_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          {/* Note */}
          <div className="flex flex-col gap-1">
            <label className="text-[15px] font-medium text-gray-700 mb-[2px]">Note</label>
            <textarea
              value={form.note}
              onChange={e => handleChange("note", e.target.value)}
              rows={3}
              className="w-full min-h-[48px] max-h-[96px] px-4 py-2 rounded-lg border border-gray-300 text-gray-900 placeholder:text-gray-400 resize-none"
              placeholder="Note"
            />
          </div>
          <button
            type="submit"
            className="w-full h-12 bg-[#FF7316] text-white text-lg font-semibold rounded-lg mt-4 mb-2 shadow-sm hover:bg-orange-600 transition"
          >
            Next
          </button>
        </form>
      </div>
    </>
  );
}

ReservationForm.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func,
  onAddReservation: PropTypes.func,
  roomData: PropTypes.object,
  rooms: PropTypes.array,
  mode: PropTypes.oneOf(["user", "admin"])
};

export default ReservationForm;
