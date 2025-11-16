import apiHttp from "./http";

// Helper: Hapus param kosong/null/array kosong & validasi key filter yang diterima BE
function cleanParams(params = {}, validKeys = null) {
  return Object.fromEntries(
    Object.entries(params)
      .filter(
        ([k, v]) =>
          (validKeys ? validKeys.includes(k) : true) &&
          v !== "" &&
          v !== undefined &&
          v !== null &&
          (!Array.isArray(v) || v.length > 0)
      )
  );
}

// Semua kemungkinan key untuk filter/sort BE
const validRoomKeys = [
  "name", "room_type", "capacity", "status", "price", "page", "limit", "sort", "startDate", "endDate"
];

// GET: List rooms, search, filter, paginasi
export const fetchRooms = async (params = {}) => {
  let reqParams = { ...params };
  reqParams.page = !reqParams.page || reqParams.page < 1 ? 1 : reqParams.page;
  reqParams.limit = reqParams.limit || 10;
  const filtered = cleanParams(reqParams, validRoomKeys);
  const res = await apiHttp.get("/api/v1/rooms", { params: filtered });
  return res.data; // { data: [...], pagination: {...} }
};

// GET: Room detail by id
export const fetchRoomById = async (id) => {
  const res = await apiHttp.get(`/api/v1/rooms/${id}`);
  return res.data?.data;
};

// POST: Add room baru
export const addRoom = async (roomData) => {
  const cleaned = cleanParams(roomData, [
    "name", "room_type", "capacity", "status", "price", "image", "description"
  ]);
  const res = await apiHttp.post(`/api/v1/rooms`, cleaned);
  return res.data?.data;
};

// PUT: Update data room by id
export const updateRoom = async (roomId, roomData) => {
  const cleaned = cleanParams(roomData, [
    "name", "room_type", "capacity", "status", "price", "image", "description"
  ]);
  const res = await apiHttp.put(`/api/v1/rooms/${roomId}`, cleaned);
  return res.data?.data;
};

// DELETE: Hapus room by id
export const deleteRoom = async (roomId) => {
  const res = await apiHttp.delete(`/api/v1/rooms/${roomId}`);
  return res.data?.data;
};

// QUICK PREVIEW: Ambil room pertama (limit kecil, fallback aman)
export const fetchFirstRoomDetail = async () => {
  const res = await apiHttp.get("/api/v1/rooms", { params: { limit: 1, page: 1 } });
  const arr = Array.isArray(res.data?.data) ? res.data.data : [];
  if (!arr.length) throw new Error("No room found");
  return arr[0];
};

// SEARCH: Auto-complete search bar by name
export const searchRoomNames = async (q) => {
  const res = await apiHttp.get("/api/v1/rooms", {
    params: cleanParams({ name: q, limit: 10 })
  });
  return Array.isArray(res.data?.data) ? res.data.data : [];
};

// (Opsional untuk ke depan) Bulk import, export, dsb bisa tinggal tambah di sini
// export const importRooms = async (fileData) => {...}

export function validateRoomData(roomData) {
  if (!roomData.name || typeof roomData.name !== "string") return "Room name harus diisi";
  if (!roomData.room_type) return "Room type wajib dipilih";
  if (!roomData.capacity || Number.isNaN(Number(roomData.capacity))) return "Capacity harus angka";
  return null;
}
