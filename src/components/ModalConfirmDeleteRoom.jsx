import React from "react";
import PropTypes from "prop-types";
import { FiTrash2, FiX } from "react-icons/fi";

export default function ModalConfirmDeleteRoom({ isOpen, onCancel, onConfirm, roomName }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-sm rounded-xl shadow-lg p-8 relative font-['Roboto'] flex flex-col items-center">
        {/* Tombol close */}
        <button
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700"
          onClick={onCancel}
          aria-label="Close Modal"
          type="button"
        >
          <FiX size={22} />
        </button>
        {/* Icon Trash */}
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 text-red-600 rounded-full p-3 flex items-center">
            <FiTrash2 size={40} />
          </div>
        </div>
        {/* Title & Text */}
        <h3 className="text-lg font-bold text-center mb-2">Delete Room</h3>
        <p className="text-center text-gray-700 mb-5">
          Are you sure you want to delete <span className="font-semibold">{roomName}</span>?<br />
          This action cannot be undone.
        </p>
        {/* Buttons */}
        <div className="flex gap-3 justify-center w-full">
          <button
            onClick={onCancel}
            className="w-1/2 px-5 py-2 rounded-lg bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 border-none outline-none shadow"
            type="button"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="w-1/2 px-5 py-2 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 border-none outline-none shadow"
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

ModalConfirmDeleteRoom.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  roomName: PropTypes.string,
};
