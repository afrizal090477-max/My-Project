import React from "react";
import PropTypes from "prop-types";
import { FiEdit2, FiTrash2, FiUsers } from "react-icons/fi";
import RoomsImage from "../assets/Rooms.png";

const TYPE_COLORS = {
  small: "#FF7300",
  medium: "#16A34A",
  large: "#EA580C",
};

function RoomCard({ room, onEdit, onDelete }) {
  const imageUrl =
    room.image_url || room.image || room.photo || RoomsImage;

  const formatRupiah = (number) =>
    `Rp ${number?.toLocaleString("id-ID") ?? "-"} / hour`;

  // Ambil label/type
  let typeLabel = "";
  let typeValue = "";
  if (room.type && typeof room.type === "object") {
    typeLabel = room.type.label || room.type.name || "-";
    typeValue = room.type.value || room.type.name || "";
  } else if (room.room_type && typeof room.room_type === "object") {
    typeLabel = room.room_type.label || room.room_type.name || "-";
    typeValue = room.room_type.value || room.room_type.name || "";
  } else {
    typeLabel = room.type || room.room_type || "-";
    typeValue = (room.type || room.room_type || "").toString().toLowerCase();
  }
  const typeColor = TYPE_COLORS[typeValue] || "#FF7300";

  return (
    <article
      className="
        bg-white rounded-[20px] border border-[#EBEBEB] shadow-sm
        w-[304px] h-[262px] flex flex-col relative overflow-hidden
        transition hover:shadow-md
      "
      style={{ borderWidth: "1.39px" }}
      aria-label={`Kartu ruangan ${room.name}`}
    >
      {/* ICON BADGE ACTION Selalu Render */}
      <div className="absolute top-3 right-3 flex gap-2 z-10">
  <button
    type="button"
    onClick={() => onDelete(room)}
    className="
      bg-white
      border border-[#DBDBDB]
      shadow-[0_2px_6px_0_rgba(14,25,56,0.10)]
      rounded-full
      p-[6px]
      flex items-center justify-center
      hover:bg-red-50
      transition
    "
    title={`Delete ${room.name}`}
    style={{ boxShadow: "0px 2px 6px 0px rgba(14,25,56,0.10)" }}
  >
    <FiTrash2 size={18} className="text-[#F04438]" />
  </button>
  <button
    type="button"
    onClick={() => onEdit(room)}
    className="
      bg-white
      border border-[#DBDBDB]
      shadow-[0_2px_6px_0_rgba(14,25,56,0.10)]
      rounded-full
      p-[6px]
      flex items-center justify-center
      hover:bg-orange-50
      transition
    "
    title={`Edit ${room.name}`}
    style={{ boxShadow: "0px 2px 6px 0px rgba(14,25,56,0.10)" }}
  >
    <FiEdit2 size={18} className="text-[#FF7300]" />
  </button>
</div>


      {/* GAMBAR ROOM */}
      <div className="relative w-full h-[128px] bg-gray-100 overflow-hidden">
        <img
          src={imageUrl}
          alt={`Foto ruangan ${room.name}`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={e => { e.target.onerror = null; e.target.src = RoomsImage; }}
        />
      </div>
      {/* Satu baris: nama dan badge type */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2 min-h-[30px]">
          <h3 className="font-bold text-base text-gray-900 truncate max-w-[135px]">{room.name}</h3>
          <span
            className="inline-block px-2 py-[2px] rounded-full border font-bold text-xs ml-2"
            style={{
              color: typeColor,
              borderColor: typeColor,
              minWidth: 54,
              textAlign: "center",
              fontSize: "13px"
            }}
          >
            {typeLabel} Type
          </span>
        </div>
        <div className="flex items-center justify-between mt-auto">
          <span className="flex items-center gap-1 text-xs text-gray-500 font-medium">
            <FiUsers className="text-orange-400" size={15} />
            {room.capacity ?? '-'} people
          </span>
          <span className="text-base font-bold text-orange-500 whitespace-nowrap">
            {formatRupiah(room.price)}
          </span>
        </div>
      </div>
    </article>
  );
}

RoomCard.propTypes = {
  room: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default React.memo(RoomCard);
