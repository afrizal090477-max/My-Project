import apiHttp from "./http";

/**
 * Ambil semua snack (GET /snacks)
 * @returns {Array} daftar snack
 */
export const fetchSnacks = async () => {
  const response = await apiHttp.get("/snacks");
  return response.data.data;
};

/**
 * Tambah snack baru (POST /snacks)
 * @param {Object} snackData
 * @returns {Object} data snack baru
 */
export const addSnack = async (snackData) => {
  const response = await apiHttp.post("/snacks", snackData);
  return response.data;
};

/**
 * Update snack by ID (PUT /snacks/{id})
 * @param {string|number} snackId
 * @param {Object} snackData
 * @returns {Object} data snack yang diupdate
 */
export const updateSnack = async (snackId, snackData) => {
  const response = await apiHttp.put(`/snacks/${snackId}`, snackData);
  return response.data;
};

/**
 * Hapus snack by ID (DELETE /snacks/{id})
 * @param {string|number} snackId
 * @returns {Object} response server
 */
export const deleteSnack = async (snackId) => {
  const response = await apiHttp.delete(`/snacks/${snackId}`);
  return response.data;
};
