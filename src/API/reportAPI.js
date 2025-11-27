import apiHttp from "./http";

// Helper: bersihkan param kosong
function cleanParams(params = {}) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) =>
        v !== "" &&
        v !== undefined &&
        v !== null &&
        (!Array.isArray(v) || v.length > 0)
    )
  );
}

// GET: reservations (report) dengan filter/pagination dari FE
export const fetchReservations = async (params = {}) => {
  const filtered = cleanParams(params);
  const response = await apiHttp.get("/api/v1/reservations", {
    params: filtered,
  });
  const root = response.data || {};
  const dataArr = Array.isArray(root.data)
    ? root.data
    : Array.isArray(root.data?.rows)
    ? root.data.rows
    : Array.isArray(root.rows)
    ? root.rows
    : [];

  // Sort A–Z berdasarkan nama room
  dataArr.sort((a, b) =>
    (a.rooms?.room_name || "")
      .toUpperCase()
      .localeCompare(
        (b.rooms?.room_name || "").toUpperCase(),
        "id-ID"
      )
  );

  return {
    ...root,
    data: dataArr,
  };
};

// Helper: ambil SEMUA reservations (loop semua page) + sort A–Z by room_name
export const fetchAllReservationsSorted = async (params = {}) => {
  const baseParams = cleanParams(params);
  let currentPage = 1;
  const pageSize = baseParams.limit || 50;
  let totalPages = 1;
  const allRows = [];

  while (currentPage <= totalPages) {
    const res = await apiHttp.get("/api/v1/reservations", {
      params: { ...baseParams, page: currentPage, limit: pageSize },
    });

    const root = res.data || {};
    const dataPart = Array.isArray(root.data)
      ? root.data
      : Array.isArray(root.data?.rows)
      ? root.data.rows
      : Array.isArray(root.rows)
      ? root.rows
      : Array.isArray(root)
      ? root
      : [];

    allRows.push(...dataPart);

    const pag = root.pagination || root.data?.pagination || {};
    totalPages = pag.totalPages || pag.total_pages || totalPages;
    if (!totalPages) totalPages = 1;

    currentPage += 1;
  }

  allRows.sort((a, b) =>
    (a.rooms?.room_name || "")
      .toUpperCase()
      .localeCompare(
        (b.rooms?.room_name || "").toUpperCase(),
        "id-ID"
      )
  );

  return allRows;
};

// Update reservation (Pay)
export const patchReservationStatus = async (reservationId, payload) => {
  const response = await apiHttp.put(
    `/api/v1/reservations/${reservationId}`,
    payload
  );
  return response.data;
};

// Cancel Reservation (DELETE)
export const deleteReservation = async (reservationId) => {
  const response = await apiHttp.delete(
    `/api/v1/reservations/${reservationId}`
  );
  return response.data;
};

// Download report
export const downloadReport = async (filters = {}) => {
  const params = new URLSearchParams(cleanParams(filters)).toString();
  const response = await apiHttp.get(
    `/api/v1/reservations/download?${params}`,
    {
      responseType: "blob",
    }
  );
  return response.data;
};
