import apiHttp from "./http";

// Ambil seluruh kapasitas (GET /capacities)
export const fetchCapacities = async () => {
  const response = await apiHttp.get("/capacities");
  return response.data.data;
};

// (Opsional) Tambah kapasitas baru jika backend support POST
export const addCapacity = async (capacityData) => {
  const response = await apiHttp.post("/capacities", capacityData);
  return response.data;
};

// (Opsional) Edit kapasitas
export const updateCapacity = async (capacityId, capacityData) => {
  const response = await apiHttp.put(`/capacities/${capacityId}`, capacityData);
  return response.data;
};

// (Opsional) Hapus kapasitas
export const deleteCapacity = async (capacityId) => {
  const response = await apiHttp.delete(`/capacities/${capacityId}`);
  return response.data;
};
