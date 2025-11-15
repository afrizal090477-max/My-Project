import apiHttp from "./http";

/**
 * Fetch reservation history with paging, filter, search.
 * Gunakan endpoint resmi: GET /api/v1/reservations
 * @param {Object} params
 * @returns {Object} { histories: Array, totalPages: number }
 */
export const fetchHistory = async (params = {}) => {
  // Endpoint sudah sesuai swagger: DAFTAR RIWAYAT RESERVASI
  const response = await apiHttp.get("/api/v1/reservations", { params });
  // Sesuaikan response sesuai field di backend kamu, umumnya { data: {...} }
  const data = response.data.data || {};
  return {
    histories: data.rows || data.histories || [],
    totalPages: data.totalPages || data.total_pages || 1,
  };
};

/**
 * Cancel reservation by id (PUT /api/v1/reservations/{id})
 * @param {number|string} id
 * @returns {Object}
 */
export const cancelReservation = async (id) => {
  // Endpoint update reservation (status) sesuai swagger, misal dengan body tertentu
  // Jika backendmu ada endpoint /cancel, sesuaikan di sini
  const response = await apiHttp.put(`/api/v1/reservations/${id}`, { status: "Cancel" });
  return response.data;
};
