import apiHttp from "./http";

// Get reservations data
export const fetchReservations = async (params = {}) => {
  const response = await apiHttp.get("/api/v1/reservations", { params });
  return response.data;
};

// Update reservation (Pay)
export const patchReservationStatus = async (reservationId, payload) => {
  const response = await apiHttp.put(`/api/v1/reservations/${reservationId}`, payload);
  return response.data;
};

// Cancel Reservation (DELETE)
export const deleteReservation = async (reservationId) => {
  const response = await apiHttp.delete(`/api/v1/reservations/${reservationId}`);
  return response.data;
};

// Download report
export const downloadReport = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await apiHttp.get(`/api/v1/reservations/download?${params}`, {
    responseType: "blob",
  });
  return response.data;
};
