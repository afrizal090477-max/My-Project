import apiHttp from "./http";

/**
 * GET semua daftar reservation (optional, filter support)
 */
export const fetchReservations = async (params = {}) => {
  const response = await apiHttp.get("/api/v1/reservations", { params });
  return Array.isArray(response.data.data) ? response.data.data : [];
};

/**
 * GET reservation by ID
 */
export const fetchReservationById = async (id) => {
  const response = await apiHttp.get(`/api/v1/reservations/${id}`);
  return response.data.data;
};

/**
 * POST create reservation - FIXED: clean, sesuai spec backend!
 */
export const createReservation = async (reservationData) => {
  const payload = {
    // WAJIB: room_id dari UUID room yang dipilih user, didapat dari array rooms di FE
    room_id: reservationData.room_id || reservationData.roomId || "",
    pemesan: reservationData.pemesan || reservationData.name || "",
    no_hp: reservationData.no_hp || reservationData.phone || "",
    company_name: reservationData.company_name || reservationData.company || "",
    date_reservation: reservationData.date_reservation || reservationData.dateReservation || reservationData.dateStart || "",
    start_time: reservationData.start_time || reservationData.startTime || "",
    end_time: reservationData.end_time || reservationData.endTime || "",
    total_participant: Number(reservationData.total_participant || reservationData.participants || 1),
    snack: reservationData.snack || reservationData.snackCategory || "",
    note: reservationData.note || "",
    status: "pending"
  };

  // Validasi field WAJIB
  for (const field of ["room_id","pemesan","no_hp","company_name","date_reservation","start_time","end_time"]) {
    if (!payload[field]) throw new Error(`[RESERVATION] Field ${field} wajib diisi!`);
  }

  // Debug (hapus sebelum deploy)
  // console.log("PAYLOAD to BE:", payload);

  const response = await apiHttp.post("/api/v1/reservations", payload);
  return response.data.data;
};

/**
 * PUT update reservation
 */
export const updateReservation = async (id, data) => {
  const response = await apiHttp.put(`/api/v1/reservations/${id}`, data);
  return response.data.data;
};

/**
 * DELETE reservation
 */
export const deleteReservation = async (reservationId) => {
  const response = await apiHttp.delete(`/api/v1/reservations/${reservationId}`);
  return response.data.data;
};

/**
 * GET reservation dengan filter tanggal (search)
 */
export const searchReservationsByDate = async (startDate, endDate, params = {}) => {
  const response = await apiHttp.get("/api/v1/reservations", {
    params: {
      startDate: typeof startDate === "string" ? startDate : startDate?.toISOString?.().slice(0, 10),
      endDate: typeof endDate === "string" ? endDate : endDate?.toISOString?.().slice(0, 10),
      ...params,
    }
  });
  return Array.isArray(response.data.data) ? response.data.data : [];
};

// Alias export supaya mudah dipakai
export const fetchAdminReservations = fetchReservations;
export const fetchAdminReservationById = fetchReservationById;
export const createAdminReservation = createReservation;
export const updateAdminReservation = updateReservation;
export const deleteAdminReservation = deleteReservation;
export const filterAdminReservations = searchReservationsByDate;
