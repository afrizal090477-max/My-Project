import React, { useState } from "react";
import PropTypes from "prop-types";
import { FiX, FiCalendar } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function ReservationFormAdmin({ isOpen, onClose, onSubmit, data }) {
  const [room, setRoom] = useState(data?.room || "");
  const [name, setName] = useState(data?.name || "");
  const [phone, setPhone] = useState(data?.phone || "");
  const [company, setCompany] = useState(data?.company || "");

  // RANGE date 
  const [dateRange, setDateRange] = useState([
    data?.dateStart ? new Date(data.dateStart) : null,
    data?.dateEnd ? new Date(data.dateEnd) : null
  ]);
  const [startDate, endDate] = dateRange;
  const [startTime, setStartTime] = useState(data?.startTime || "");
  const [endTime, setEndTime] = useState(data?.endTime || "");
  const [participants, setParticipants] = useState(data?.participants || 1);
  const [addSnack, setAddSnack] = useState(data?.addSnack || false);
  const [snackCategory, setSnackCategory] = useState(data?.snackCategory || "");
  const [note, setNote] = useState(data?.note || "");

  const hourOptions = [...Array(24).keys()].map(i => `${i.toString().padStart(2, "0")}:00`);

  const handleNext = () => {
    onSubmit({
      room, name, phone, company,
      dateStart: startDate ? startDate.toISOString().slice(0,10) : "",
      dateEnd: endDate ? endDate.toISOString().slice(0,10) : "",
      startTime, endTime, participants,
      addSnack, snackCategory, note
    });
  };

  if (!isOpen) return null;
  return (
    <div className="fixed top-0 right-0 z-50 w-[456px] h-full max-h-screen bg-white shadow-2xl flex flex-col px-8 pt-5 pb-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-bold text-xl text-gray-800">Reservation Form</h2>
        <button onClick={onClose} className="p-1 text-gray-500 hover:text-orange-600"><FiX size={25}/></button>
      </div>
      <div className="flex flex-col gap-3 mb-6">
        <label className="font-medium text-gray-700">Room Name</label>
        <select className="border px-3 py-2 rounded-lg" value={room} onChange={e => setRoom(e.target.value)}>
          <option value="">Choose Room</option>
          <option value="Aster Room">Aster Room</option>
          <option value="Bluebell Room">Bluebell Room</option>
          <option value="Camellia Room">Camellia Room</option>
          <option value="Daisy Room">Daisy Room</option>
        </select>
        <label>Name</label>
        <input type="text" className="border px-3 py-2 rounded-lg" value={name} onChange={e => setName(e.target.value)} />
        <label>No.Hp</label>
        <input type="text" className="border px-3 py-2 rounded-lg" value={phone} onChange={e => setPhone(e.target.value)} />
        <label>Company/Organization</label>
        <input type="text" className="border px-3 py-2 rounded-lg" value={company} onChange={e => setCompany(e.target.value)} />
        {/* Date Range Reservation in ONE BORDER with icon */}
        <label>Date Reservation</label>
        <div className="relative flex items-center">
          <div className="flex-1">
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={update => setDateRange(update)}
              dateFormat="dd/MM/yyyy"
              className="border-none w-full focus:ring-0 focus:outline-none bg-transparent"
              placeholderText="Select date"
              wrapperClassName="w-full"
            />
          </div>
          <FiCalendar className="absolute right-4 text-gray-400" size={22} />
          <div className="absolute left-2 top-0 bottom-0 flex items-center pointer-events-none"></div>
          {/* Styling for single round border */}
          <div className="absolute inset-0 border rounded-lg pointer-events-none" />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label>Start Time</label>
            <select
              className="border px-3 py-2 rounded-lg w-full"
              value={startTime}
              onChange={e => setStartTime(e.target.value)}
            >
              <option value="">Select time</option>
              {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label>End Time</label>
            <select
              className="border px-3 py-2 rounded-lg w-full"
              value={endTime}
              onChange={e => setEndTime(e.target.value)}
            >
              <option value="">Select time</option>
              {hourOptions.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
        </div>
        <label>Total Participants</label>
        <input type="number" min={1} className="border px-3 py-2 rounded-lg" value={participants} onChange={e => setParticipants(parseInt(e.target.value))} />
        <div className="flex items-center gap-2">
          <input type="checkbox" checked={addSnack} onChange={() => setAddSnack(!addSnack)} />
          <label className="select-none">Add Snack</label>
        </div>
        {addSnack && (
          <>
            <label>Snack Category</label>
            <select className="border px-3 py-2 rounded-lg" value={snackCategory} onChange={e => setSnackCategory(e.target.value)}>
              <option value="">Pilih snack</option>
              <option value="Coffee Break Package 1 - Rp 20.000/people">Coffee Break Package 1 - Rp 20.000/people</option>
              <option value="Coffee Break Package 2 - Rp 50.000/people">Coffee Break Package 2 - Rp 50.000/people</option>
              <option value="Lunch Package 1 - Rp 20.000/people">Lunch Package 1 - Rp 20.000/people</option>
              <option value="Lunch Package 2 - Rp 50.000/people">Lunch Package 2 - Rp 50.000/people</option>
            </select>
          </>
        )}
        <label>Note</label>
        <textarea
          className="border px-3 py-2 rounded-lg"
          style={{ minHeight: "100px", resize: "vertical" }}
          value={note}
          onChange={e => setNote(e.target.value)}
        />
      </div>
      <button className="h-12 bg-[#FF7316] text-white font-semibold rounded-lg w-full" onClick={handleNext}>
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
};
