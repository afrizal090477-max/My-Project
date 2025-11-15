import apiHttp from "./http";

// Gunakan endpoint Swagger
const PROFILE_URL = "/api/v1/profile";

/**
 * Ambil data profil user saat ini
 * @returns {Object} data profile
 */
export const fetchUserProfile = async () => {
  const response = await apiHttp.get(PROFILE_URL);
  // response.data biasanya: { data: {...profile} }
  return response.data.data;
};

/**
 * Update profil: name, email, password (opsional), dan photo (opsional file)
 * @param {Object} param0 { username, email, password, photo }
 * photo = File browser/image (boleh kosong jika tidak update)
 * @returns {Object} data profile yang sudah diupdate
 */
export const updateUserProfile = async ({ username, email, password, photo }) => {
  const formData = new FormData();
  if (username) formData.append("username", username);
  if (email) formData.append("email", email);
  if (password) formData.append("password", password); // Hanya jika user mengubah password
  if (photo) formData.append("photo", photo);           // File image, jika ada

  const response = await apiHttp.put(PROFILE_URL, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};
