import React from "react";
import PropTypes from "prop-types";
import { FiUsers, FiTag } from "react-icons/fi";
import RoomsImage from "../assets/Rooms.png";

// Default value pakai destructuring parameter, bukan defaultProps!
function RoomCardUser({
  room = {
    name: "-",
    type: "-",
    capacity: 0,
    price: 0,
    status: "Unknown",
    image: ""
  },
  onClick = () => {}
}) {
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(number || 0);
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
  const name = room.name || "-";
  const capacity = room.capacity ?? 0;
  const type = room.type || "-";
  const price = room.price ?? 0;
  const status = room.status || "Unknown";

  return (
    <article
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 relative group transition-transform duration-300 hover:shadow-xl cursor-pointer"
      aria-label={`Kartu ruangan ${name}`}
      onClick={() => onClick && onClick(room)}
      tabIndex={0}
      role="button"
    >
      <div className="absolute top-2 right-2 z-10">
        <span
          className={`${statusColor} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md`}
        >
          {status}
        </span>
      </div>
      <div className="w-full h-[174px] bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={`Foto ruangan ${name}`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
          {name}
        </h3>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <FiUsers className="mr-2 text-blue-500" size={16} aria-hidden="true" />
          <span>{capacity} people</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-3">
          <FiTag className="mr-2 text-green-500" size={16} aria-hidden="true" />
          <span>{type} Type</span>
        </div>
        <p className="text-xl font-bold text-orange-500 mb-0">
          {formatRupiah(price)} / hour
        </p>
      </div>
    </article>
  );
}

RoomCardUser.propTypes = {
  room: PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    capacity: PropTypes.number,
    price: PropTypes.number,
    status: PropTypes.string,
    image: PropTypes.string,
  }),
  onClick: PropTypes.func,
};

export default React.memo(RoomCardUser);
