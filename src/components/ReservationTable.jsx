import React, { useEffect, useState } from "react";
import {
  fetchReservations,
  deleteReservation,
  updateReservationStatus,
} from "../API/reservationAPI";
import ModalConfirmStatus from "./ModalConfirmStatus";

export default function ReservationTable({ onSelectDetail }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState(null);
  const [modalStatus, setModalStatus] = useState({ open: false, id: null });

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetchReservations();
      setData(response.data || []);
    } catch (e) {
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin hapus reservasi ini?")) return;
    await deleteReservation(id);
    fetchData();
  };

  const handleChangeStatus = (id) => {
    setModalStatus({ open: true, id });
  };

  return (
    <div className="relative overflow-x-auto rounded-lg shadow-md border border-gray-200 bg-white p-5">
      <h3 className="font-bold text-lg mb-2">Daftar Reservasi</h3>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <table className="min-w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2">Kode</th>
              <th className="px-4 py-2">Nama Pemesan</th>
              <th className="px-4 py-2">Waktu</th>
              <th className="px-4 py-2">Ruangan</th>
              <th className="px-4 py-2">Status</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((resv) => (
              <tr key={resv.id}>
                <td className="border px-2 py-2">{resv.code || resv.id}</td>
                <td className="border px-2 py-2">{resv.booker_name || "-"}</td>
                <td className="border px-2 py-2">{resv.date || resv.reservation_date}</td>
                <td className="border px-2 py-2">{resv.room_name}</td>
                <td className="border px-2 py-2">{resv.status}</td>
                <td className="border px-2 py-2">
                  <button
                    onClick={() => onSelectDetail?.(resv.id)}
                    className="mx-1 text-blue-600 underline"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => handleChangeStatus(resv.id)}
                    className="mx-1 text-yellow-600 underline"
                  >
                    Status
                  </button>
                  <button
                    onClick={() => handleDelete(resv.id)}
                    className="mx-1 text-red-600 underline"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
            {data.length === 0 && (
              <tr>
                <td colSpan={6} className="py-3 text-center text-gray-400">
                  Tidak ada data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Modal status */}
      {modalStatus.open && (
        <ModalConfirmStatus
          open={modalStatus.open}
          reservationId={modalStatus.id}
          onClose={() => setModalStatus({ open: false, id: null })}
          onSuccess={() => {
            setModalStatus({ open: false, id: null });
            fetchData();
          }}
        />
      )}
    </div>
  );
}
