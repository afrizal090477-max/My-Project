import React, { useState } from "react";
import PropTypes from "prop-types";
import { FiX, FiCalendar, FiClock } from "react-icons/fi";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function ModalRoomBooking({ isOpen, onClose, onSubmit, roomData }) {
  const [formData, setFormData] = useState({
    date: null,
    startTime: "",
    endTime: "",
    purpose: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.purpose
    ) {
      alert("Please fill all fields!");
      return;
    }

    onSubmit({
      room: roomData,
      ...formData,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX size={24} />
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Book {roomData?.name}
        </h2>

        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <p className="text-sm text-gray-600">
            <strong>Type:</strong> {roomData?.type} | <strong>Capacity:</strong>{" "}
            {roomData?.capacity} people
          </p>
          <p className="text-lg font-bold text-orange-500 mt-1">
            {new Intl.NumberFormat("id-ID", {
              style: "currency",
              currency: "IDR",
              minimumFractionDigits: 0,
            }).format(roomData?.price || 0)}{" "}
            / hour
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiCalendar className="inline mr-2" />
              Reservation Date
            </label>
            <DatePicker
              selected={formData.date}
              onChange={(date) => handleChange("date", date)}
              dateFormat="dd/MM/yyyy"
              minDate={new Date()}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholderText="Select date"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiClock className="inline mr-2" />
              Start Time
            </label>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => handleChange("startTime", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FiClock className="inline mr-2" />
              End Time
            </label>
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => handleChange("endTime", e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meeting Purpose
            </label>
            <textarea
              value={formData.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="Describe the purpose of your meeting..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Book Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

ModalRoomBooking.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  roomData: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    capacity: PropTypes.number,
    price: PropTypes.number,
  }),
};

export default ModalRoomBooking;
