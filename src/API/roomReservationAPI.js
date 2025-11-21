// src/API/roomReservationAPI.js

import apiHttp from "./http";

/**
 * Transformasi data form user agar sesuai schema backend sebelum POST
 * @param {Object} form - data form (bisa dari ReservationForm)
 * @returns {Object} payload untuk backend
 */
export function mapReservationPayload(form) {
  return {
    room_id: form.room, // ID ruangan UUID
    pemesan: form.name,
    no_hp: form.phone,
    company_name: form.company,
    date_reservation: form.date
      ? new Date(form.date).toISOString().slice(0, 10)
      : "",
    start_time: form.startTime,
    end_time: form.endTime,
    total_participant: Number(form.participants) || 1,
    snack: form.addSnack ? form.snackCategory : "-",
    note: form.note || "",
    status: "pending", // default status, atau isi dari form jika dynamic
  };
}

/**
 * Create a reservation (POST /api/v1/reservations)
 * @param {Object} data - PASTI SUDAH DI-MAP DENGAN mapReservationPayload!
 * @returns {Promise<Object>}
 */
export const createReservation = async (data) => {
  // Data yang dikirim HARUS SUDAH PERSIS dengan schema mapReservationPayload!
  const response = await apiHttp.post("/api/v1/reservations", data);
  return response.data.data || {};
};

/**
 * Get all reservations (GET /api/v1/reservations)
 * @param {Object} params - Optional query params
 * @returns {Promise<Array>}
 */
export const fetchReservations = async (params = {}) => {
  const response = await apiHttp.get("/api/v1/reservations", { params });
  return response.data.data || [];
};

/**
 * Get reservation detail by ID (GET /api/v1/reservations/{id})
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const fetchReservationById = async (id) => {
  const response = await apiHttp.get(`/api/v1/reservations/${id}`);
  return response.data.data || {};
};

/**
 * Update a reservation (PUT /api/v1/reservations/{id})
 * @param {string} id
 * @param {Object} data - Sudah map schema backend
 * @returns {Promise<Object>}
 */
export const updateReservation = async (id, data) => {
  const response = await apiHttp.put(`/api/v1/reservations/${id}`, data);
  return response.data.data || {};
};

/**
 * Delete a reservation (DELETE /api/v1/reservations/{id})
 * @param {string} id
 * @returns {Promise<Object>}
 */
export const deleteReservation = async (id) => {
  const response = await apiHttp.delete(`/api/v1/reservations/${id}`);
  return response.data.data || {};
};

/**
 * Search/filter by date (GET /api/v1/reservations?start=yyyy-mm-dd&end=yyyy-mm-dd)
 * @param {string} startDate
 * @param {string} endDate
 * @returns {Promise<Array>}
 */
export const searchReservationsByDate = async (startDate, endDate) => {
  const response = await apiHttp.get("/api/v1/reservations", {
    params: { start: startDate, end: endDate }
  });
  return response.data.data || [];
};
