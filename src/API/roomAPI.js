import apiHttp from "./http";

/**
 * Ambil daftar seluruh room (GET /api/v1/rooms) dengan optional filter, paging, search
 * @param {Object} params - query string filter/search/pagination, ex: { search, type, capacity, page }
 * @returns {Array} array data room
 */
export const fetchRooms = async (params = {}) => {
  const response = await apiHttp.get("/api/v1/rooms", { params });
  return response.data.data;
};

/**
 * Ambil detail room by ID (GET /api/v1/rooms/{id})
 * @param {string|number} id - ID room (UUID)
 * @returns {Object} data room detail
 */
export const fetchRoomById = async (id) => {
  const response = await apiHttp.get(`/api/v1/rooms/${id}`);
  return response.data.data;
};

/**
 * Ambil jenis-jenis room (GET /api/v1/room-types)
 * @returns {Array} array jenis room
 */
export const fetchRoomTypes = async () => {
  const response = await apiHttp.get("/api/v1/room-types");
  return response.data.data;
};

/**
 * Ambil data kapasitas (GET /api/v1/capacities)
 * @returns {Array} array kapasitas room
 */
export const fetchCapacities = async () => {
  const response = await apiHttp.get("/api/v1/capacities");
  return response.data.data;
};

/**
 * Tambah room baru (POST /api/v1/rooms)
 * @param {Object} roomData - data form create room
 * @returns {Object} data dari server (room baru)
 */
export const addRoom = async (roomData) => {
  const response = await apiHttp.post("/api/v1/rooms", roomData);
  return response.data.data;
};

/**
 * Update data room by ID (PUT /api/v1/rooms/{id})
 * @param {string|number} roomId - ID room (UUID)
 * @param {Object} roomData - data update
 * @returns {Object} data dari server
 */
export const updateRoom = async (roomId, roomData) => {
  const response = await apiHttp.put(`/api/v1/rooms/${roomId}`, roomData);
  return response.data.data;
};

/**
 * Hapus room by ID (DELETE /api/v1/rooms/{id})
 * @param {string|number} roomId - ID room (UUID)
 * @returns {Object} data server/respons
 */
export const deleteRoom = async (roomId) => {
  const response = await apiHttp.delete(`/api/v1/rooms/${roomId}`);
  return response.data.data;
};

/**
 * Daftar reservasi by room (GET /api/v1/rooms/{roomId}/reservations)
 * @param {string|number} roomId - ID room (UUID)
 * @param {Object} params (filter, paging, dll)
 * @returns {Array} array data reservasi
 */
export const fetchReservationsByRoomId = async (roomId, params = {}) => {
  const response = await apiHttp.get(`/api/v1/rooms/${roomId}/reservations`, { params });
  return response.data.data;
};

/**
 * (Tambahan) Ambil detail room pertama dari list (perlu untuk RoomDetailDemo)
 * @returns {Object} data detail room pertama pada list
 */
export const fetchFirstRoomDetail = async () => {
  const res = await apiHttp.get("/api/v1/rooms");
  const firstId = res.data.data?.[0]?.id;
  if (!firstId) throw new Error("No room found");
  const detailRes = await apiHttp.get(`/api/v1/rooms/${firstId}`);
  return detailRes.data.data;
};
