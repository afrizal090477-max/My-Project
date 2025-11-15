import apiHttp from "./http";

/**
 * Ambil profile user yang sedang login (GET /profile)
 */
export const fetchProfile = async () => {
  const response = await apiHttp.get("/profile");
  return response.data;
};

/**
 * Update profile user (PUT /profile)
 * @param {Object} profileData - form data user
 */
export const updateProfile = async (profileData) => {
  const response = await apiHttp.put("/profile", profileData);
  return response.data;
};
