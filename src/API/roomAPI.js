import apiHttp from "./http";

// Helper: Clean param kosong/invalid
function cleanParams(params = {}, validKeys = null) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([k, v]) =>
        (validKeys ? validKeys.includes(k) : true) &&
        v !== "" &&
        v !== undefined &&
        v !== null &&
        (!Array.isArray(v) || v.length > 0)
    )
  );
}

// Semua kemungkinan key utk filter/sort BE, KUNCI HARUS SESUAI API
const validRoomKeys = [
  "room_name",
  "room_type",
  "capacity",
  "status",
  "price",
  "page",
  "limit",
  "sort",
  "startDate",
  "endDate",
];

// GET: List rooms, search, filter, paginasi (FE wajib kirim page/limit)
export const fetchRooms = async (params = {}) => {
  let reqParams = { ...params };
  reqParams.page = !reqParams.page || reqParams.page < 1 ? 1 : reqParams.page;
  reqParams.limit = reqParams.limit || 10;
  const filtered = cleanParams(reqParams, validRoomKeys);
  const res = await apiHttp.get("/api/v1/rooms", { params: filtered });
  return res.data; // BE diharapkan kirim { data: [...], pagination: {...} }
};

export const fetchRoomById = async (id) => {
  const res = await apiHttp.get(`/api/v1/rooms/${id}`);
  return res.data?.data;
};

// POST: Add ROOM baru (FormData upload ke BE file asli!)
export const addRoom = async (roomData, isFormData = false) => {
  let payload = roomData;

  // Jika bukan FormData, mapping object fields agar cocok ke backend
  if (!isFormData && !(roomData instanceof FormData)) {
    payload = { ...roomData };
    if (payload.name) {
      payload.room_name = payload.name;
      delete payload.name;
    }
    if (payload.type) {
      payload.room_type = payload.type;
      delete payload.type;
    }
    // Hapus jika image blob/url belum sesuai
    if (
      payload.image &&
      (payload.image.startsWith("blob:") || payload.image === "")
    ) {
      delete payload.image;
    }
    payload = cleanParams(payload, [
      "room_name",
      "room_type",
      "capacity",
      "status",
      "price",
      "image",
      "description",
    ]);
  }

  // FormData: langsung kirim sebagai multipart/form-data
  if (isFormData || payload instanceof FormData) {
    const res = await apiHttp.post(`/api/v1/rooms`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data;
  } else {
    const res = await apiHttp.post(`/api/v1/rooms`, payload);
    return res.data?.data;
  }
};

export const updateRoom = async (roomId, roomData, isFormData = false) => {
  let payload = roomData;

  if (!isFormData && !(roomData instanceof FormData)) {
    payload = { ...roomData };
    if (payload.name) {
      payload.room_name = payload.name;
      delete payload.name;
    }
    if (payload.type) {
      payload.room_type = payload.type;
      delete payload.type;
    }
    if (
      payload.image &&
      (payload.image.startsWith("blob:") || payload.image === "")
    ) {
      delete payload.image;
    }
    payload = cleanParams(payload, [
      "room_name",
      "room_type",
      "capacity",
      "status",
      "price",
      "image",
      "description",
    ]);
  }

  if (isFormData || payload instanceof FormData) {
    const res = await apiHttp.put(`/api/v1/rooms/${roomId}`, payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data?.data;
  } else {
    const res = await apiHttp.put(`/api/v1/rooms/${roomId}`, payload);
    return res.data?.data;
  }
};

export const deleteRoom = async (roomId) => {
  const res = await apiHttp.delete(`/api/v1/rooms/${roomId}`);
  return res.data?.data;
};

// QUICK PREVIEW: Ambil room pertama (limit kecil, fallback aman)
export const fetchFirstRoomDetail = async () => {
  const res = await apiHttp.get("/api/v1/rooms", {
    params: { limit: 1, page: 1 },
  });
  const arr = Array.isArray(res.data?.data) ? res.data.data : [];
  if (!arr.length) throw new Error("No room found");
  return arr[0];
};
