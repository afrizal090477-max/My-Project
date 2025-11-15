import apiHttp from "./http";

/**
 * Ambil seluruh room dengan filter params opsional (GET /rooms)
 * @param {Object} params - query filter/paging
 * @returns {Object} { rooms: Array, totalPages: number }
 */
export const fetchRooms = async (params = {}) => {
  const response = await apiHttp.get("/rooms", { params });
  return response.data.data || { rooms: [], totalPages: 1 };
};

/**
 * Ambil semua snack (GET /snacks)
 * @returns {Array}
 */
export const fetchSnacks = async () => {
  const response = await apiHttp.get("/snacks");
  return response.data.data || [];
};

/**
 * Ambil kapasitas ruangan (GET /capacities)
 * @returns {Array}
 */
export const fetchCapacities = async () => {
  const response = await apiHttp.get("/capacities");
  return response.data.data || [];
};
