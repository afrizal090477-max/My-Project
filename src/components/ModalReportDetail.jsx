import React, { useState } from "react";
import PropTypes from "prop-types";
import ModalConfirmCancel from "../components/ModalConfirmCancel"; // pastikan import sesuai
// import { ROOM_LIST } from "../data/roomData";

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
  onPayClick,
}) {
  const [modalCancelOpen, setModalCancelOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);

  if (!open) return null;

  // Handler tombol Cancel
  const handleCancelClick = () => {
    setModalCancelOpen(true);
  };

  const handleCancelConfirm = () => {
    setModalCancelOpen(false);
    setShowToast(true);
    // Logika cancel ke backend/API di sini jika sudah ready
    setTimeout(() => setShowToast(false), 2200);
    onClose();
  };

  // Layout dua kolom, auto wrap
  const ReportRow = ({ label, value }) => (
    <div className="flex justify-between gap-4 py-1">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-right text-gray-900">{value}</span>
    </div>
  );

  return (
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

        <div className="p-6 space-y-6 text-sm">
          {data ? (
            <>
              {/* ROOM DETAILS */}
              <div>
                <h3 className="font-semibold text-base mb-4">Room Details</h3>
                <ReportRow label="Room Name:" value={data.room} />
                <ReportRow label="Room Type:" value={data.type} />
                <ReportRow label="Capacity:" value="10 people" />
                <ReportRow label="Price/hour:" value="Rp 100.000" />
              </div>
              {/* PERSONAL DATA */}
              <div>
                <h3 className="font-semibold text-base mb-4 mt-6">Personal Data</h3>
                <ReportRow label="Name:" value="Angela Thomas" />
                <ReportRow label="No. HP:" value="0851 2345 6789" />
                <ReportRow label="Company:" value="PT Maju Jaya" />
                <ReportRow label="Reservation Date:" value={data.date} />
                <ReportRow label="Duration:" value="2 hours" />
                <ReportRow label="Total Participants:" value="8" />
              </div>
              {/* SNACK DETAILS */}
              <div>
                <h3 className="font-semibold text-base mb-4 mt-6">Snack Details</h3>
                <ReportRow label="Snack Category:" value="Lunch" />
                <ReportRow label="Package:" value="Lunch 1 - Rp 20.000/box" />
              </div>
              {/* TOTAL */}
              <div className="border-t pt-6 mt-4">
                <h3 className="font-semibold text-base mb-3">Total</h3>
                <ReportRow label={data.room} value="Rp 200.000" />
                <ReportRow label="Lunch Package:" value="Rp 160.000" />
                <ReportRow label="Total:" value="Rp 360.000" />
              </div>
              {/* BUTTON ACTIONS */}
              <div className="flex gap-4 mt-7">
                <button
                  onClick={handleCancelClick}
                  className="w-1/2 h-[40px] py-2 rounded-lg border border-orange-300 text-orange-600 font-semibold hover:bg-orange-100"
                >
                  Cancel
                </button>
                <button
                  onClick={onPayClick}
                  className="w-1/2 h-[40px] py-2 rounded-lg bg-[#FF7316] text-white font-semibold  hover:bg-[#e76712]"
                >
                  Pay
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">No data available.</p>
          )}
          {/* TOAST SUKSES CANCEL */}
          {showToast && (
            <div className="fixed top-10 right-10 bg-green-500 text-white px-8 py-3 rounded shadow-md z-50 animate-fadeIn">
              Reservation successfully canceled.
            </div>
          )}
          {/* MODAL CONFIRM CANCEL */}
          <ModalConfirmCancel
            open={modalCancelOpen}
            onClose={() => setModalCancelOpen(false)}
            onConfirm={handleCancelConfirm}
          />
        </div>
      </div>
    </div>
  );
}
