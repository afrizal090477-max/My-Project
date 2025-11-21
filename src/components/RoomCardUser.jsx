// src/components/RoomCardUser.jsx

import React from "react";
import PropTypes from "prop-types";
import { FiUsers } from "react-icons/fi";

export default function RoomCardUser({ room, onClick, isSelected }) {
  return (
    <div
      className={`
        relative bg-white rounded-[20px] border border-[#EBEBEB] shadow transition-all overflow-hidden
        cursor-pointer group hover:shadow-lg ${isSelected ? "ring-2 ring-orange-600" : ""}
      `}
      style={{ width: 304, height: 262, minWidth: 304 }}
      onClick={onClick}
    >
      {/* Image Room */}
      <div className="relative h-[130px] w-full bg-gray-200">
        {room.image ? (
          <img
            src={room.image}
            alt={room.name}
            style={{
              objectFit: "cover",
              width: "100%",
              height: "100%",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">no image</div>
        )}
        {/* BADGE, pojok kanan atas seperti di Figma */}
        <div
          className="absolute top-4 right-4 bg-orange-500 text-white rounded-full shadow px-4 py-[2px] font-bold text-sm tracking-wide"
          style={{
            fontSize: 15,
            fontWeight: 600,
            lineHeight: 1.45,
            letterSpacing: ".03em",
            minWidth: 64,
            textAlign: "center",
            borderRadius: 50,
            zIndex: 3,
          }}
        >
          {room.type ? room.type.charAt(0).toUpperCase() + room.type.slice(1) : "Unknown"}
        </div>
      </div>
      {/* Info Card */}
      <div className="px-5 pt-3 pb-4 flex flex-col gap-1">
        <div className="font-semibold text-[20px] truncate mb-1">{room.name}</div>
        <div className="flex flex-row items-center gap-2 text-[15px] text-gray-600 mb-1">
          <FiUsers className="inline mr-1" />
          {room.capacity > 0 ? `${room.capacity} people` : "-"}
        </div>
        <div className="flex flex-row items-center gap-2 text-[15px] font-medium text-orange-500 mt-2">
          Rp {room.price?.toLocaleString("id-ID")} <span className="font-normal text-gray-400 ml-1">/ hour</span>
        </div>
      </div>
    </div>
  );
}

RoomCardUser.propTypes = {
  room: PropTypes.shape({
    id: PropTypes.any,
    name: PropTypes.string,
    type: PropTypes.string,
    capacity: PropTypes.number,
    price: PropTypes.number,
    image: PropTypes.string,
  }),
  onClick: PropTypes.func,
  isSelected: PropTypes.bool,
};
