import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import ModalConfirmCancel from "./ModalConfirmCancel";
import { patchReservationStatus, deleteReservation } from "../API/reportAPI";
import { fetchRoomById } from "../API/userRoomAPI";
import { toast } from "react-toastify";

export default function ModalReportDetail({ open, onClose, data = null }) {
  const [modalCancelOpen, setModalCancelOpen] = useState(false);
  const [room, setRoom] = useState(null);

  const safeData = data || {};

  // Ambil detail room by ID → sumber tunggal: name, type, capacity, price/hour
  useEffect(() => {
    if (open && safeData.room_id) {
      fetchRoomById(safeData.room_id)
        .then((res) => {
          console.log("REPORT ROOM DETAIL:", res);
          setRoom(res);
        })
        .catch(() => setRoom(null));
    } else {
      setRoom(null);
    }
  }, [open, safeData.room_id]);

  // Setelah semua hooks
  if (!open || !data) return null;

  const ReportRow = ({ label, value }) => (
    <div className="flex justify-between gap-4 py-1">
      <span className="text-gray-600 font-medium">{label}</span>
      <span className="text-right text-gray-900">
        {value === undefined || value === null || value === "" ? "-" : value}
      </span>
    </div>
  );

  // Payload builder for update (Pay)
  const buildPayload = (status) => ({
    room_id: safeData.room_id || safeData.rooms?.id,
    pemesan: safeData.pemesan,
    no_hp: safeData.no_hp,
    company_name: safeData.company_name,
    date_reservation: safeData.date_reservation,
    start_time: safeData.start_time,
    end_time: safeData.end_time,
    total_participant: safeData.total_participant,
    snack: safeData.snack,
    note: safeData.note,
    status,
  });

  const handleCancelConfirm = async () => {
    try {
      await deleteReservation(safeData.id);
      toast.success("Reservation canceled successfully!");
      setModalCancelOpen(false);
      onClose?.(true);
    } catch (err) {
      setModalCancelOpen(false);
      toast.error(
        "Failed to cancel: " +
          (err?.response?.data?.message || err.toString())
      );
      onClose?.(false);
    }
  };

  const handlePay = async () => {
    try {
      await patchReservationStatus(safeData.id, buildPayload("confirmed"));
      toast.success("Payment Success!");
      onClose?.(true);
    } catch (err) {
      toast.error(
        "Failed to pay: " +
          (err?.response?.data?.message || err.toString())
      );
      onClose?.(false);
    }
  };

  // ---------- LOGIC ROOM (single source of truth) ----------
  const roomName =
    room?.room_name || safeData.room_name || safeData.roomName || "-";
  const roomType =
    room?.room_type || safeData.room_type || safeData.roomType || "-";
  const roomCapacity =
    room?.capacity !== undefined && room?.capacity !== null
      ? String(room.capacity)
      : "-";
  const roomPriceNumber =
    room?.price !== undefined && room?.price !== null
      ? Number(room.price)
      : null;
  const roomPriceLabel =
    roomPriceNumber !== null
      ? `Rp ${roomPriceNumber.toLocaleString("id-ID")}`
      : "-";

  // ---------- DURASI & TOTAL ----------
  const getDurationHours = () => {
    if (!safeData.start_time || !safeData.end_time) return null;
    const [sh, sm = 0] = safeData.start_time.split(":").map(Number);
    const [eh, em = 0] = safeData.end_time.split(":").map(Number);
    const startMinutes = sh * 60 + sm;
    const endMinutes = eh * 60 + em;
    const diffMinutes = endMinutes - startMinutes;
    if (diffMinutes <= 0) return null;
    return diffMinutes / 60;
  };

  const durationHours = getDurationHours();

  // Total room (tanpa snack) = price/hour * durasi
  const totalRoomPrice =
    roomPriceNumber !== null && durationHours !== null
      ? roomPriceNumber * durationHours
      : null;

  // Snack subtotal kalau BE kirim snack_price
  const snackPrice =
    safeData.snack_price !== undefined && safeData.snack_price !== null
      ? Number(safeData.snack_price)
      : null;

  const grandTotal =
    totalRoomPrice !== null && snackPrice !== null
      ? totalRoomPrice + snackPrice
      : totalRoomPrice ?? snackPrice ?? null;

  // ---------- FORMAT FIELD LAIN ----------
  const startDate =
    safeData.date_reservation && safeData.start_time
      ? `${safeData.date_reservation} ${safeData.start_time}`
      : "-";

  const endDate =
    safeData.date_reservation && safeData.end_time
      ? `${safeData.date_reservation} ${safeData.end_time}`
      : "-";

  const durationLabel =
    safeData.start_time && safeData.end_time
      ? `${safeData.start_time} - ${safeData.end_time}`
      : "-";

  const capacityReservation =
    safeData.total_participant !== undefined &&
    safeData.total_participant !== null
      ? String(safeData.total_participant)
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
            {/* Room Details */}
            <div>
              <h3 className="font-semibold text-base mb-4">Room Details</h3>
              <ReportRow label="Room Name:" value={roomName} />
              <ReportRow label="Room Type:" value={roomType} />
              <ReportRow label="Capacity (room):" value={roomCapacity} />
              <ReportRow label="Price/hour:" value={roomPriceLabel} />
            </div>

            {/* Personal Data (dari reservation) */}
            <div>
              <h3 className="font-semibold text-base mb-4 mt-6">Personal Data</h3>
              <ReportRow label="Name:" value={safeData.pemesan} />
              <ReportRow label="No. HP:" value={safeData.no_hp} />
              <ReportRow label="Company:" value={safeData.company_name} />
              <ReportRow label="Reservation Date:" value={startDate} />
              <ReportRow label="End Date:" value={endDate} />
              <ReportRow label="Duration:" value={durationLabel} />
              <ReportRow
                label="Total Participants:"
                value={capacityReservation}
              />
            </div>

            {/* Snack Details */}
            <div>
              <h3 className="font-semibold text-base mb-4 mt-6">Snack Details</h3>
              <ReportRow label="Snack Category:" value={safeData.snack} />
            </div>

            {/* Payment Detail (selaras dengan ReservationDetailAdmin) */}
            <div>
              <h3 className="font-semibold text-base mb-4 mt-6">
                Payment Detail
              </h3>
              <ReportRow
                label="Room Subtotal:"
                value={
                  totalRoomPrice !== null
                    ? `Rp ${totalRoomPrice.toLocaleString("id-ID")}`
                    : "-"
                }
              />
              <ReportRow
                label="Snack Subtotal:"
                value={
                  snackPrice !== null
                    ? `Rp ${snackPrice.toLocaleString("id-ID")}`
                    : "-"
                }
              />
              <ReportRow
                label="Grand Total:"
                value={
                  grandTotal !== null
                    ? `Rp ${grandTotal.toLocaleString("id-ID")}`
                    : "-"
                }
              />
            </div>

            {/* Other Info */}
            <div>
              <h3 className="font-semibold text-base mb-4 mt-6">
                Other Information
              </h3>
              <ReportRow label="Note:" value={safeData.note} />
            </div>

            {/* Actions */}
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
