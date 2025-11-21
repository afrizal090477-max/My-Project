import React from "react";
import PropTypes from "prop-types";
import { FiEdit2, FiTrash2, FiUsers, FiTag } from "react-icons/fi";
import RoomsImage from "../assets/Rooms.png";

function RoomCard({ room, onEdit, onDelete }) {
  const formatRupiah = (number) =>
    `Rp ${number?.toLocaleString("id-ID") ?? "-"} / hour`;

  const imageUrl = room.image || RoomsImage;

  let typeLabel = "";
  if (room.type && typeof room.type === "object") {
    typeLabel = room.type.name || room.type.label || "[object]";
  } else if (room.room_type && typeof room.room_type === "object") {
    typeLabel = room.room_type.name || room.room_type.label || "[object]";
  } else {
    typeLabel = room.type || room.room_type || "-";
  }

  return (
    <article
      className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 relative group transition-transform duration-300 hover:shadow-xl font-['Roboto']"
      aria-label={`Kartu ruangan ${room.name}`}
    >
      <div className="absolute top-3 right-3 flex gap-2 z-10">
        <button
          type="button"
          onClick={() => onDelete(room)}
          className="bg-white text-red-500 p-2 rounded-full shadow hover:bg-red-50 transition"
          title={`Delete ${room.name}`}
        >
          <FiTrash2 size={16} />
        </button>
        <button
          type="button"
          onClick={() => onEdit(room)}
          className="bg-white text-orange-500 p-2 rounded-full shadow hover:bg-orange-50 transition"
          title={`Edit ${room.name}`}
        >
          <FiEdit2 size={16} />
        </button>
      </div>
      <div className="w-full h-[174px] bg-gray-200 overflow-hidden">
        <img
          src={imageUrl}
          alt={`Foto ruangan ${room.name}`}
          className="w-full h-full object-cover transition group-hover:scale-105 duration-300"
          loading="lazy"
        />
      </div>
      <div className="p-4 pb-5">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-gray-800 truncate">{room.name}</h3>
          <span className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <FiTag className="text-green-500" size={15} />
            {typeLabel} Type
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="flex items-center gap-2 text-sm text-gray-600">
            <FiUsers className="text-blue-500" size={15} />
            {room.capacity ?? '-'} people
          </span>
          <span className="text-sm font-bold text-orange-500 whitespace-nowrap">
            {formatRupiah(room.price)}
          </span>
        </div>
      </div>
    </article>
  );
}

RoomCard.propTypes = {
  room: PropTypes.shape({
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.any,
        name: PropTypes.string,
        label: PropTypes.string,
      }),
    ]),
    room_type: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        id: PropTypes.any,
        name: PropTypes.string,
        label: PropTypes.string,
      }),
    ]),
    capacity: PropTypes.number,
    price: PropTypes.number,
    image: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default React.memo(RoomCard);
