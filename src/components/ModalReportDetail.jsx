import React, { useState } from "react";
import PropTypes from "prop-types";
import ModalConfirmCancel from "../components/ModalConfirmCancel";

export default function ModalReportDetail({ open, onClose, data, onPay }) {
  const [modalCancelOpen, setModalCancelOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  if (!open || !data) return null;

  // Helper row tampilan label dan value (selalu aman)
  const ReportRow = ({ label, value }) => (
    <div className="flex justify-between gap-4 py-1">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-right text-gray-900">{value === undefined || value === null || value === "" ? "-" : value}</span>
    </div>
  );

  const handleCancelClick = () => setModalCancelOpen(true);

  const handleCancelConfirm = () => {
    setModalCancelOpen(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2200);
    if (onClose) onClose();
  };

  // Data mapping: BE-mu pakai 'rooms' untuk relasi ruangan
  const room = data.rooms || data.room || {};

  // Format
  const priceFmt =
    room.price !== undefined && room.price !== null
      ? `Rp ${Number(room.price).toLocaleString("id-ID")}`
      : "-";

  const capacityFmt =
    room.capacity !== undefined && room.capacity !== null
      ? String(room.capacity)
      : "-";

  const startDate =
    data.date_reservation && data.start_time
      ? `${data.date_reservation} ${data.start_time}`
      : "-";
  const endDate =
    data.date_reservation && data.end_time
      ? `${data.date_reservation} ${data.end_time}`
      : "-";
  const duration =
    data.start_time && data.end_time
      ? `${data.start_time} - ${data.end_time}`
      : "-";

  // Total price fields kalau BE sudah kirimkan di future
  // const totalFmt =
  //   data.total !== undefined && data.total !== null
  //     ? `Rp ${Number(data.total).toLocaleString("id-ID")}`
  //     : "-";

  // const subtotalFmt =
  //   room.subtotal !== undefined && room.subtotal !== null
  //     ? `Rp ${Number(room.subtotal).toLocaleString("id-ID")}`
  //     : "-";

  return (
    <>
      <div className="fixed inset-0 bg-black/30 flex items-center justify-end z-50">
        <div className="bg-white w-[450px] h-full shadow-2xl overflow-y-auto animate-slideInRight border-l-4 border-[#FF7316] relative">
          {/* Header */}
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">Reservation Details</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 text-xl"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
          {/* Content */}
          <div className="p-6 space-y-6 text-sm">
            <div>
              <h3 className="font-semibold text-base mb-4">Room Details</h3>
              <ReportRow label="Room Name:" value={room.room_name} />
              <ReportRow label="Room Type:" value={room.room_type} />
              <ReportRow label="Capacity:" value={capacityFmt} />
              <ReportRow label="Price/hour:" value={priceFmt} />
            </div>
            <div>
              <h3 className="font-semibold text-base mb-4 mt-6">Personal Data</h3>
              <ReportRow label="Name:" value={data.pemesan} />
              <ReportRow label="No. HP:" value={data.no_hp} />
              <ReportRow label="Company:" value={data.company_name} />
              <ReportRow label="Reservation Date:" value={startDate} />
              <ReportRow label="End Date:" value={endDate} />
              <ReportRow label="Duration:" value={duration} />
              <ReportRow label="Total Participants:" value={data.total_participant} />
            </div>
            <div>
              <h3 className="font-semibold text-base mb-4 mt-6">Snack Details</h3>
              <ReportRow label="Snack Category:" value={data.snack} />
            </div>
            <div>
              <h3 className="font-semibold text-base mb-4 mt-6">Other Information</h3>
              <ReportRow label="Note:" value={data.note} />
            </div>
            {/* Total, jika BE sudah return sesuai field */}
            {/* 
            <div className="border-t pt-6 mt-4">
              <h3 className="font-semibold text-base mb-3">Total</h3>
              <ReportRow label="Subtotal:" value={subtotalFmt} />
              <ReportRow label="Total:" value={totalFmt} />
            </div>
            */}
            <div className="flex gap-4 mt-7">
              <button
                onClick={handleCancelClick}
                className="w-1/2 h-[40px] py-2 rounded-lg border border-orange-300 text-orange-600 font-semibold hover:bg-orange-100"
              >
                Cancel
              </button>
              <button
                onClick={onPay}
                className="w-1/2 h-[40px] py-2 rounded-lg bg-[#FF7316] text-white font-semibold hover:bg-[#e76712]"
              >
                Pay
              </button>
            </div>
            {/* Toast Success Cancel */}
            {showToast && (
              <div className="fixed top-10 right-10 bg-green-500 text-white px-8 py-3 rounded shadow-md z-50 animate-fadeIn">
                Reservation successfully canceled.
              </div>
            )}
            <ModalConfirmCancel
              open={modalCancelOpen}
              onClose={() => setModalCancelOpen(false)}
              onConfirm={handleCancelConfirm}
            />
          </div>
        </div>
      </div>
    </>
  );
}

ModalReportDetail.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  data: PropTypes.object,
  onPay: PropTypes.func,
};
