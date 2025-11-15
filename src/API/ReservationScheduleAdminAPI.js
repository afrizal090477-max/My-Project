// src/API/ReservationScheduleAdmin.js

import apiHttp from "./http";

/**
 * Ambil semua jadwal reservation (full filter admin)
 * @param {Object} params - query filter (startDate, endDate, roomId, userId, dsb)
 * @returns {Promise<Array>} List jadwal reservasi
 */
export const fetchAdminReservations = async (params = {}) => {
  const response = await apiHttp.get("/api/v1/reservations", { params });
  return response.data.data;
};

/**
 * Ambil detail reservation by ID (admin)
 * @param {string|number} id
 * @returns {Promise<Object>}
 */
export const fetchAdminReservationById = async (id) => {
  const response = await apiHttp.get(`/api/v1/reservations/${id}`);
  return response.data.data;
};

/**
 * Tambah reservation (admin)
 * @param {Object} reservationData - data reservasi yang ingin dibuat
 * @returns {Promise<Object>}
 */
export const createAdminReservation = async (reservationData) => {
  const response = await apiHttp.post("/api/v1/reservations", reservationData);
  return response.data.data;
};

/**
 * Edit reservation (admin)
 * @param {string|number} id
 * @param {Object} data - data yang diupdate
 * @returns {Promise<Object>}
 */
export const updateAdminReservation = async (id, data) => {
  const response = await apiHttp.put(`/api/v1/reservations/${id}`, data);
  return response.data.data;
};

/**
 * Delete reservation (admin)
 * @param {string|number} reservationId
 * @returns {Promise<Object>}
 */
export const deleteAdminReservation = async (reservationId) => {
  const response = await apiHttp.delete(`/api/v1/reservations/${reservationId}`);
  return response.data.data;
};

/**
 * Filtering/search range jadwal untuk admin (opsional, jika ingin lebih spesifik)
 * @param {string} startDate
 * @param {string} endDate
 * @param {Object} tambahanParam - param lain, misal roomId, status dll (opsional)
 * @returns {Promise<Array>}
 */
export const filterAdminReservations = async (startDate, endDate, tambahanParam = {}) => {
  const params = { startDate, endDate, ...tambahanParam };
  const response = await apiHttp.get("/api/v1/reservations", { params });
  return response.data.data;
};
