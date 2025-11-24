import apiHttp from "./http";

// Register user (POST /api/v1/auth/register)
export const register = async ({ username, email, password }) => {
  const response = await apiHttp.post("/api/v1/auth/register", { username, email, password });
  return response.data;
};

// Login user (POST /api/v1/auth/login)
export const login = async ({ email, password }) => {
  const response = await apiHttp.post("/api/v1/auth/login", { email, password });
  return response.data;
};

// Logout user (POST /api/v1/auth/logout)
export const logout = async () => {
  const response = await apiHttp.post("/api/v1/auth/logout");
  return response.data;
};

// Forgot password (POST /api/v1/auth/forgot-password)
export const forgotPassword = async (email) => {
  const response = await apiHttp.post("/api/v1/auth/forgot-password", { email });
  return response.data;
};

/**
 * Reset password by OTP/token (POST /api/v1/auth/reset-password/{id})
 */
export const resetPassword = async (id, password, confirmPassword) => {
  const response = await apiHttp.post(`/api/v1/auth/reset-password/${id}`, {
    password,
    confirm_password: confirmPassword,
  });
  return response.data;
};
