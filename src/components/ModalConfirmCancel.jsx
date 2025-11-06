import React from "react";
import PropTypes from "prop-types";

export default function ModalConfirmCancel({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="relative z-10 w-[480px] h-[374px] rounded-lg bg-white p-8 shadow-xl flex flex-col items-center">
        {/* Icon/Warning */}
        <div className="mb-8 text-5xl text-yellow-500">⚠️</div>
        <h2
          className="mb-2 text-lg font-semibold text-center text-gray-800"
        >
          Are you sure you want to cancel this reservation?
        </h2>
        <p className="text-sm text-gray-500 mb-12 text-center">
          This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4 w-full">
          <button
            type="button"
            onClick={onClose}
            className="w-[50%] h-[48px] rounded-md border !border-violet-600 px-5 font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            No
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-[50%] h-[48px] rounded-md bg-red-500 px-5 font-medium text-white hover:bg-[#e76712] focus:outline-none"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

ModalConfirmCancel.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
