import React from "react";
import PropTypes from "prop-types";

export default function ModalConfirmCancel({ open, onClose, onConfirm }) {
  if (!open) return null;

  return (
    <dialog
      open
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30"
      aria-labelledby="cancel-modal-title"
      aria-modal="true"
    >
      {/* ✅ Backdrop pakai button transparan */}
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-transparent border-none p-0 m-0"
        aria-label="Close modal"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Enter" && onClose()}
      />

      <div className="relative z-10 w-[380px] rounded-lg bg-white p-6 shadow-xl">
        <div className="text-center">
          <div className="mb-4 text-5xl text-red-500">⚠️</div>
          <h2
            id="cancel-modal-title"
            className="mb-2 text-lg font-semibold text-gray-800"
          >
            Are you sure you want to cancel this reservation?
          </h2>
          <p className="text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </div>

        {/* Dummy input biar label warning hilang */}
        <div className="sr-only">
          <label htmlFor="dummyInput">Hidden</label>
          <input id="dummyInput" readOnly value="" />
        </div>

        <div className="mt-6 flex justify-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-md border border-gray-300 px-5 font-medium text-gray-700 hover:bg-gray-100 focus:outline-none"
          >
            No
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-10 rounded-md bg-[#FF7316] px-5 font-medium text-white hover:bg-[#e76712] focus:outline-none"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </dialog>
  );
}

ModalConfirmCancel.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
