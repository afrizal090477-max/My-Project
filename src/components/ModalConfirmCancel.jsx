import React from "react";
import PropTypes from "prop-types";
import ReactDOM from "react-dom"; // Tambah ini!

export default function ModalConfirmCancel({ open, onClose, onConfirm }) {
  if (!open) return null;

  return ReactDOM.createPortal(
    <>
      {/* BACKDROP */}
      <div className="fixed inset-0 z-[9998] bg-black/30 backdrop-blur-sm"></div>
      {/* MODAL */}
      <div className="fixed z-[9999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[480px] h-[374px] rounded-lg bg-white p-8 shadow-xl flex flex-col items-center">
        {/* Icon/Warning */}
        <div className="mb-8 text-5xl text-yellow-500">⚠️</div>
        <h2 className="mb-2 text-lg font-semibold text-center text-gray-800">
          Are you sure you want to cancel this reservation?
        </h2>
        <p className="text-sm text-gray-500 mb-12 text-center">
          This action cannot be undone.
        </p>
        <div className="flex justify-center gap-4 w-full">
          <button
            type="button"
            onClick={onClose}
            className="w-[50%] h-[48px] rounded-md px-5 font-medium text-gray-700 bg-white hover:bg-gray-100 !border-orange-500 outline-none shadow"
          >
            No
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-[50%] h-[48px] rounded-md bg-red-500 px-5 font-medium text-white hover:bg-[#e76712] border-none outline-none shadow"
          >
            Yes, Cancel
          </button>
        </div>
      </div>
    </>,
    document.body // Pasti di root window!
  );
}

ModalConfirmCancel.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};
