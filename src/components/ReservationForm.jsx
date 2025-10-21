import React, { useState } from "react";
import PropTypes from "prop-types";

export default function ReservationForm({ onClose, rooms = [] }) {
  const [addSnack, setAddSnack] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault(); // mencegah reload halaman
    setShowToast(true); // tampilkan toast sukses

    // auto-close toast setelah 3 detik
    setTimeout(() => {
      setShowToast(false);
      onClose(); // menutup form modal setelah submit
    }, 3000);
  };

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-end z-50">
      <div className="bg-white w-[450px] h-full shadow-2xl overflow-y-auto animate-slideInRight border-l-4 border-[#FF7316]">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">Reservation Form</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Close form"
          >
            ✕
          </button>
        </div>

        {/* Toast Notification */}
        {showToast && (
          <div className="bg-green-100 text-green-700 px-4 py-2 m-4 rounded-md border border-green-300">
            ✅ New reservation successfully added!
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Room Dropdown */}
          <div>
            <label
              htmlFor="roomName"
              className="block text-sm font-medium mb-1"
            >
              Room Name
            </label>
            <select
              id="roomName"
              required
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-[#FF7316] outline-none"
            >
              <option value="">Select Room Name</option>
              {rooms.map((room) => (
                <option key={room.name} value={room.name}>
                  {room.name}
                </option>
              ))}
            </select>
          </div>

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter your name"
              required
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-[#FF7316] outline-none"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium mb-1">
              No. HP
            </label>
            <input
              id="phone"
              type="text"
              placeholder="Phone Number"
              required
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-[#FF7316] outline-none"
            />
          </div>

          {/* Company */}
          <div>
            <label
              htmlFor="company"
              className="block text-sm font-medium mb-1"
            >
              Company/Organization
            </label>
            <input
              id="company"
              type="text"
              placeholder="Company Name"
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-[#FF7316] outline-none"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1">
              Date Reservation
            </label>
            <input
              id="date"
              type="date"
              required
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-[#FF7316] outline-none"
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="startTime"
                className="block text-sm font-medium mb-1"
              >
                Start Time
              </label>
              <input
                id="startTime"
                type="time"
                required
                className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-[#FF7316] outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="endTime"
                className="block text-sm font-medium mb-1"
              >
                End Time
              </label>
              <input
                id="endTime"
                type="time"
                required
                className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-[#FF7316] outline-none"
              />
            </div>
          </div>

          {/* Participants */}
          <div>
            <label
              htmlFor="participants"
              className="block text-sm font-medium mb-1"
            >
              Total Participants
            </label>
            <input
              id="participants"
              type="number"
              placeholder="0"
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-[#FF7316] outline-none"
            />
          </div>

          {/* Add Snack */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="addSnack"
              checked={addSnack}
              onChange={(e) => setAddSnack(e.target.checked)}
              className="accent-[#FF7316]"
            />
            <label htmlFor="addSnack" className="text-sm">
              Add Snack
            </label>
          </div>

          {/* Snack Dropdown (if checked) */}
          {addSnack && (
            <div>
              <label
                htmlFor="snack"
                className="block text-sm font-medium mb-1"
              >
                Snack Category
              </label>
              <select
                id="snack"
                className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-[#FF7316] outline-none"
              >
                <option value="">Select snack</option>
                <option value="Coffee Break 1">
                  Coffee Break Package 1 - Rp 20.000/people
                </option>
                <option value="Coffee Break 2">
                  Coffee Break Package 2 - Rp 50.000/people
                </option>
                <option value="Lunch 1">
                  Lunch Package 1 - Rp 20.000/people
                </option>
                <option value="Lunch 2">
                  Lunch Package 2 - Rp 50.000/people
                </option>
              </select>
            </div>
          )}

          {/* Note */}
          <div>
            <label htmlFor="note" className="block text-sm font-medium mb-1">
              Note
            </label>
            <textarea
              id="note"
              placeholder="Enter note..."
              className="border border-gray-300 rounded-lg w-full p-2 focus:ring-2 focus:ring-[#FF7316] outline-none"
              rows="3"
            ></textarea>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-[48px] bg-[#FF7316] hover:bg-[#e76712] text-white py-2 rounded-lg font-semibold mt-4"
          >
            Next
          </button>
        </form>
      </div>
    </div>
  );
}

ReservationForm.propTypes = {
  onClose: PropTypes.func.isRequired,
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ),
};
