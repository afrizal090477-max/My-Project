import apiHttp from "./http";

/**
 * Fetch report data (GET)
 * @returns {Array}
 */
export const fetchReportData = async () => {
  const response = await apiHttp.get("/report");
  return response.data.data || [];
};

/**
 * Download report as a file (GET, blob)
 * @param {Object} filters
 * @returns {Blob}
 */
export const downloadReport = async (filters = {}) => {
  // Gunakan prefix slash konsisten
  const params = new URLSearchParams(filters).toString();
  const response = await apiHttp.get(`/report/download?${params}`, {
    responseType: "blob",
  });
  return response.data;
};
