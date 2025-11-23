import apiHttp from "./http";

/**
 * Ambil seluruh room untuk user (GET /api/v1/rooms)
 * @param {Object} params - query filter/paging
 * @returns {Object} { rooms: Array, totalPages: number }
 */
export const fetchRooms = async (params = {}) => {
  const response = await apiHttp.get("/api/v1/rooms", { params });
  return response.data.data || { rooms: [], totalPages: 1 };
};

/**
 * Ambil satu room by id (GET /api/v1/rooms/{id})
 * @param {string|number} id - room id
 * @returns {Object} single room object (bisa null jika tidak ditemukan)
 */
export const fetchRoomById = async (id) => {
  if (!id) return null;
  try {
    const response = await apiHttp.get(`/api/v1/rooms/${id}`);
    return response.data.data || null;
  } catch {
    return null;
  }
};

/**
 * Ambil semua snack (GET /api/v1/snacks)
 * @returns {Array}
 */
export const fetchSnacks = async () => {
  const response = await apiHttp.get("/api/v1/snacks");
  return response.data.data || [];
};

/**
 * Ambil kapasitas ruangan (GET /api/v1/capacities)
 * @returns {Array}
 */
export const fetchCapacities = async () => {
  const response = await apiHttp.get("/api/v1/capacities");
  return response.data.data || [];
};
