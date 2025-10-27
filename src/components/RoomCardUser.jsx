import React from "react";
import PropTypes from "prop-types";
import { FiUsers, FiTag, FiCalendar } from "react-icons/fi";
import RoomsImage from "../assets/Rooms.png";

function RoomCardUser({ room, onBook }) {
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  let statusColor;
  if (room.status === "Available") {
    statusColor = "bg-green-500";
  } else if (room.status === "Booked") {
    statusColor = "bg-red-500";
  } else {
    statusColor = "bg-yellow-500";
  }

  const imageUrl = room.image || RoomsImage;

  return (
    <article
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 relative group transition-transform duration-300 hover:shadow-xl"
      aria-label={`Kartu ruangan ${room.name}`}
    >
      <div className="absolute top-2 right-2 z-10">
        <span
          className={`${statusColor} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md`}
        >
          {room.status}
        </span>
      </div>

      <div className="w-full h-[174px] bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={`Foto ruangan ${room.name}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {room.name}
        </h3>

        <div className="flex items-center text-sm text-gray-600 mb-2">
          <FiUsers
            className="mr-2 text-blue-500"
            size={16}
            aria-hidden="true"
          />
          <span>{room.capacity} people</span>
        </div>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <FiTag className="mr-2 text-green-500" size={16} aria-hidden="true" />
          <span>{room.type} Type</span>
        </div>

        <p className="text-xl font-bold text-orange-500 mb-3">
          {formatRupiah(room.price)} / hour
        </p>

        <button
          onClick={() => onBook(room)}
          disabled={room.status === "Booked"}
          className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-semibold transition ${
            room.status === "Booked"
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-orange-500 text-white hover:bg-orange-600"
          }`}
        >
          <FiCalendar size={16} />
          {room.status === "Booked" ? "Not Available" : "Book Now"}
        </button>
      </div>
    </article>
  );
}

RoomCardUser.propTypes = {
  room: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    capacity: PropTypes.number,
    price: PropTypes.number,
    status: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  onBook: PropTypes.func.isRequired,
};

export default React.memo(RoomCardUser);
