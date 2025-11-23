import React, { useState } from "react";
import PropTypes from "prop-types";
import ModalConfirmCancel from "./ModalConfirmCancel";
import { patchReservationStatus, deleteReservation } from "../API/reportAPI";
import { toast } from "react-toastify";

export default function ModalReportDetail({ open, onClose, data }) {
  const [modalCancelOpen, setModalCancelOpen] = useState(false);

  if (!open || !data) return null;

  const ReportRow = ({ label, value }) => (
    <div className="flex justify-between gap-4 py-1">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-right text-gray-900">{value === undefined || value === null || value === "" ? "-" : value}</span>
    </div>
  );

  // Payload builder for update (Pay)
  const buildPayload = (status) => ({
    room_id: data.room_id || data.rooms?.id,
    pemesan: data.pemesan,
    no_hp: data.no_hp,
    company_name: data.company_name,
    date_reservation: data.date_reservation,
    start_time: data.start_time,
    end_time: data.end_time,
    total_participant: data.total_participant,
    snack: data.snack,
    note: data.note,
    status // gunakan status valid BE
  });

  const handleCancelConfirm = async () => {
    try {
      await deleteReservation(data.id); // CANCEL = DELETE
      toast.success("Reservation canceled successfully!");
      setModalCancelOpen(false);
      if (onClose) onClose(true);
    } catch (err) {
      setModalCancelOpen(false);
      toast.error("Failed to cancel: " + (err?.response?.data?.message || err.toString()));
      if (onClose) onClose(false);
    }
  };

  const handlePay = async () => {
    try {
      await patchReservationStatus(data.id, buildPayload("confirmed")); // status allowed backend
      toast.success("Payment Success!");
      if (onClose) onClose(true);
    } catch (err) {
      toast.error("Failed to pay: " + (err?.response?.data?.message || err.toString()));
      if (onClose) onClose(false);
    }
  };

  const room = data.rooms || data.room || {};
  const priceFmt = room.price !== undefined && room.price !== null
    ? `Rp ${Number(room.price).toLocaleString("id-ID")}`
    : "-";
  const capacityFmt = room.capacity !== undefined && room.capacity !== null
    ? String(room.capacity)
    : "-";
  const startDate = data.date_reservation && data.start_time
    ? `${data.date_reservation} ${data.start_time}`
    : "-";
  const endDate = data.date_reservation && data.end_time
    ? `${data.date_reservation} ${data.end_time}`
    : "-";
  const duration = data.start_time && data.end_time
    ? `${data.start_time} - ${data.end_time}`
    : "-";

  return (
    <>
      <div className="fixed inset-0 bg-black/30 flex items-center justify-end z-50">
        <div className="bg-white w-[450px] h-full shadow-2xl overflow-y-auto animate-slideInRight border-l-4 border-[#FF7316] relative">
          <div className="p-6 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">Reservation Details</h2>
            <button
              onClick={() => onClose(false)}
              className="text-gray-500 hover:text-gray-800 text-xl"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
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
            <div className="flex gap-4 mt-7">
              <button
                onClick={() => setModalCancelOpen(true)}
                className="w-1/2 h-[40px] py-2 rounded-lg border !border-orange-300 text-orange-600 font-semibold hover:bg-orange-100"
              >
                Cancel
              </button>
              <button
                onClick={handlePay}
                className="w-1/2 h-[40px] py-2 rounded-lg bg-[#FF7316] text-white font-semibold hover:bg-[#e76712]"
              >
                Pay
              </button>
            </div>
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
};
