import apiHttp from "./http";

/**
 * Fetch reservation history with paging, filter, search.
 * Endpoint: GET /api/v1/reservations
 * @param {Object} params
 * @returns {Object} { histories: Array, totalPages: number }
 */
export const fetchHistory = async (params = {}) => {
  const response = await apiHttp.get("/api/v1/reservations", { params });

  const root = response.data || {};

  // Ambil kandidat data utama
  const dataCandidate =
    Array.isArray(root.data) || Array.isArray(root.rows)
      ? root
      : root.data || root;

  let histories =
    dataCandidate.rows ||
    dataCandidate.histories ||
    dataCandidate.data ||
    (Array.isArray(dataCandidate) ? dataCandidate : []);

  const pagination =
    root.pagination || dataCandidate.pagination || {};

  const totalPages =
    pagination.totalPages ||
    pagination.total_pages ||
    pagination.total ||
    dataCandidate.totalPages ||
    dataCandidate.total_pages ||
    1;

  // Sort A–Z by room name (fallback pemesan kalau mau)
  histories = [...histories].sort((a, b) =>
    (a.rooms?.room_name || a.pemesan || "")
      .toUpperCase()
      .localeCompare(
        (b.rooms?.room_name || b.pemesan || "").toUpperCase(),
        "id-ID"
      )
  );

  return {
    histories,
    totalPages: totalPages || 1,
  };
};

/**
 * Cancel reservation by id (PUT /api/v1/reservations/{id})
 * @param {number|string} id
 * @returns {Object}
 */
export const cancelReservation = async (id) => {
  const response = await apiHttp.put(`/api/v1/reservations/${id}`, {
    status: "Cancel",
  });
  return response.data;
};
