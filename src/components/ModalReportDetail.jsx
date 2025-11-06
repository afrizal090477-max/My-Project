import React from "react";
import PropTypes from "prop-types";
import { ROOM_LIST } from "../data/roomData";

ModalReportDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.shape({
    date: PropTypes.string,
    room: PropTypes.string,
    type: PropTypes.string,
    status: PropTypes.string,
  }),
};

export default function ModalReportDetail({
  open,
  onClose,
  data,
  onCancelClick,
  onPayClick,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-end z-50">
      <div className="bg-white w-[450px] h-full shadow-2xl overflow-y-auto animate-slideInRight border-l-4 border-[#FF7316]">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="font-semibold text-lg">Reservation Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-4 text-sm">
          {data ? (
            <>
              <div>
                <h3 className="font-semibold text-base mb-2">Room Details</h3>
                <p>
                  <strong>Room Name:</strong> {data.room}
                </p>
                <p>
                  <strong>Room Type:</strong> {data.type}
                </p>
                <p>
                  <strong>Capacity:</strong> 10 people
                </p>
                <p>
                  <strong>Price/hour:</strong> Rp 100.000
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-base mb-2">Personal Data</h3>
                <p>
                  <strong>Name:</strong> Angela Thomas
                </p>
                <p>
                  <strong>No. HP:</strong> 0851 2345 6789
                </p>
                <p>
                  <strong>Company:</strong> PT Maju Jaya
                </p>
                <p>
                  <strong>Reservation Date:</strong> {data.date}
                </p>
                <p>
                  <strong>Duration:</strong> 2 hours
                </p>
                <p>
                  <strong>Total Participants:</strong> 8
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-base mb-2">Snack Details</h3>
                <p>
                  <strong>Snack Category:</strong> Lunch
                </p>
                <p>
                  <strong>Package:</strong> Lunch 1 - Rp 20.000/box
                </p>
              </div>

              <div className="border-t pt-4">
                <h3 className="font-semibold text-base mb-2">Total</h3>
                <p>
                  <strong>{data.room}</strong>: Rp 200.000 <br />
                  Lunch Package: Rp 160.000 <br />
                  <strong>Total: Rp 360.000</strong>
                </p>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={onCancelClick} // <--- HARUS INI, jangan onClose!
                  className="w-1/2 h-[27px] py-2 rounded-lg border !border-orange-300 hover:bg-orange-100"
                >
                  Cancel
                </button>
                <button
                  onClick={onPayClick} // <--- Langsung trigger Pay!
                  className="w-1/2 h-[27px] py-2 rounded-lg bg-[#FF7316] text-white hover:bg-[#e76712]"
                >
                  Pay
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">No data available.</p>
          )}
        </div>
      </div>
    </div>
  );
}
