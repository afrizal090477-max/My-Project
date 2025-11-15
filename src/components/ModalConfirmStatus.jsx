import React, { useState } from "react";
import { updateReservationStatus } from "../API/reservationAPI";

const STATUS_OPSI = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
];

export default function ModalConfirmStatus({ open, reservationId, onClose, onSuccess }) {
  const [status, setStatus] = useState("approved");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await updateReservationStatus(reservationId, status);
      onSuccess?.();
    } catch (err) {
      setError("Gagal update status.");
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md max-w-xs w-full">
        <h4 className="font-semibold text-lg mb-3">Ubah Status Reservasi</h4>
        <form onSubmit={handleSubmit}>
          <label htmlFor="status" className="font-medium text-base mb-2 block">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full border px-3 py-2 rounded mb-3"
            disabled={loading}
          >
            {STATUS_OPSI.map(opt => (
              <option value={opt.value} key={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="bg-gray-300 px-3 py-1 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white px-3 py-1 rounded"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
