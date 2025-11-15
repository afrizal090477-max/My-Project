import apiHttp from "./http";

/**
 * Fetch dashboard data summary by date range
 * @param {string} startDate format YYYY-MM-DD
 * @param {string} endDate format YYYY-MM-DD
 * @returns {Promise<Object>} data dashboard summary
 */
export const fetchDashboardData = async (startDate, endDate) => {
  const response = await apiHttp.get("/dashboard", {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  });
  return response.data.data || {};
};
