import apiHttp from "./http";

/**
 * Fetch dashboard data summary by date range (Swagger)
 * @param {string} startDate format YYYY-MM-DD
 * @param {string} endDate format YYYY-MM-DD
 * @returns {Promise<Object>} data dashboard summary
 */
export const fetchDashboardData = async (startDate, endDate) => {
  const response = await apiHttp.get("/api/v1/dashboard", {
    params: {
      startDate,   // camelCase sesuai Swagger!
      endDate,
    },
  });
  return response.data.data || {};
};
