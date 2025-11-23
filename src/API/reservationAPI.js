import apiHttp from "./http";

// GET /reservations (dengan filter params)
export const fetchReservations = async (params = {}) => {
  const response = await apiHttp.get("/reservations", { params });
  return response.data.data;
};

// GET /reservations/{id}
export const fetchReservationById = async (id) => {
  const response = await apiHttp.get(`/reservations/${id}`);
  return response.data.data;
};

// POST /reservations
export const createReservation = async (reservationData) => {
  const response = await apiHttp.post("/reservations", reservationData);
  return response.data.data;
};

// PUT /reservations/{id}
export const updateReservation = async (id, data) => {
  const response = await apiHttp.put(`/reservations/${id}`, data);
  return response.data.data;
};

// DELETE /reservations/{id}
export const deleteReservation = async (reservationId) => {
  const response = await apiHttp.delete(`/reservations/${reservationId}`);
  return response.data.data;
};
