import React from "react";
import PropTypes from "prop-types";
import { FiEdit2, FiUsers, FiTag } from "react-icons/fi";

function RoomCard({ room, onEdit }) {
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number);
  };

  // 🧹 Bersihkan nested ternary
  let statusColor;
  if (room.status === "Available") {
    statusColor = "bg-green-500";
  } else if (room.status === "Booked") {
    statusColor = "bg-red-500";
  } else {
    statusColor = "bg-yellow-500";
  }

  const defaultImageUrl = `https://via.placeholder.com/300x160?text=${room.name.replaceAll(
    " ",
    "+"
  )}`;
  const imageUrl = room.image || defaultImageUrl;

  return (
    <article
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 relative group transition-transform duration-300 hover:shadow-xl"
      aria-label={`Kartu ruangan ${room.name}`}
    >
      {/* === Status & Edit Button === */}
      <div className="absolute top-2 right-2 flex space-x-2">
        <span
          className={`${statusColor} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md`}
        >
          {room.status}
        </span>
        <button
          type="button"
          onClick={() => onEdit(room)}
          className="bg-white text-gray-700 p-2 rounded-full shadow-md opacity-80 hover:opacity-100 hover:text-blue-600 transition"
          title={`Edit ${room.name}`}
        >
          <FiEdit2 size={16} />
        </button>
      </div>

      {/* === Image === */}
      <div className="w-[303px] h-[174px] bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={`Foto ruangan ${room.name}`}
          className="w-[354px] h-[236px] object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>

      {/* === Content === */}
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

        <p className="text-xl font-bold text-orange-500">
          {formatRupiah(room.price)} / hour
        </p>
      </div>
    </article>
  );
}

RoomCard.propTypes = {
  room: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.string,
    capacity: PropTypes.number,
    price: PropTypes.number,
    status: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default React.memo(RoomCard);
