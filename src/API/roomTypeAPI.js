import apiHttp from "./http";

/**
 * Ambil semua tipe ruangan (room types)
 * @returns {Array} daftar room type
 */
export const fetchRoomTypes = async () => {
  const response = await apiHttp.get("/room-types");
  return response.data.data || [];
};
