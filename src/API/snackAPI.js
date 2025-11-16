import apiHttp from "./http";

/**
 * Ambil semua snack (GET /api/v1/snacks)
 * @returns {Array} daftar snack
 */
export const fetchSnacks = async () => {
  const response = await apiHttp.get("/api/v1/snacks");
  return response.data.data;
};

/**
 * Tambah snack baru (POST /api/v1/snacks)
 * @param {Object} snackData
 * @returns {Object} data snack baru
 */
export const addSnack = async (snackData) => {
  const response = await apiHttp.post("/api/v1/snacks", snackData);
  return response.data;
};

/**
 * Update snack by ID (PUT /api/v1/snacks/{id})
 * @param {string|number} snackId
 * @param {Object} snackData
 * @returns {Object} data snack yang diupdate
 */
export const updateSnack = async (snackId, snackData) => {
  const response = await apiHttp.put(`/api/v1/snacks/${snackId}`, snackData);
  return response.data;
};

/**
 * Hapus snack by ID (DELETE /api/v1/snacks/{id})
 * @param {string|number} snackId
 * @returns {Object} response server
 */
export const deleteSnack = async (snackId) => {
  const response = await apiHttp.delete(`/api/v1/snacks/${snackId}`);
  return response.data;
};
