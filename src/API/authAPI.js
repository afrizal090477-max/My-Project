import apiHttp from "./http";

// Register user (POST /auth/register)
export const register = async ({ username, email, password }) => {
  const response = await apiHttp.post("/auth/register", { username, email, password });
  return response.data;
};

// Login user (POST /auth/login)
export const login = async ({ email, password }) => {
  const response = await apiHttp.post("/auth/login", { email, password });
  return response.data;
};

// Forgot password (POST /auth/forgot-password)
export const forgotPassword = async (email) => {
  const response = await apiHttp.post("/auth/forgot-password", { email });
  return response.data;
};

/**
 * Reset password by OTP/token (POST /auth/reset-password/{id})
 * @param {string} id (token/OTP string)
 * @param {string} password new password
 * @param {string} confirmPassword confirmation
 */
export const resetPassword = async (id, password, confirmPassword) => {
  const response = await apiHttp.post(`/auth/reset-password/${id}`, {
    password,
    confirm_password: confirmPassword,
  });
  return response.data;
};
