// src/API/dashboardUserAPI.js
import apiHttp from "./http";

/**
 * Fetch dashboard user data by date range
 * @param {string} startDate format YYYY-MM-DD
 * @param {string} endDate format YYYY-MM-DD
 * @returns {Promise<Object>} data dashboard summary for user
 */
export const fetchDashboardUserData = async (startDate, endDate) => {
  const response = await apiHttp.get("/dashboard/user", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });
  return response.data.data || {};
};
