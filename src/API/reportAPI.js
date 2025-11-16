import apiHttp from "./http";

// Fetch data reservations untuk report, filter & pagination
export const fetchReservations = async (params = {}) => {
  // Naming param harus sama persis dengan BE
  const response = await apiHttp.get("/api/v1/reservations", { params });
  return response.data;
};

// Download/export report dari BE
export const downloadReport = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await apiHttp.get(`/api/v1/reservations/download?${params}`, {
    responseType: "blob",
  });
  return response.data;
};
