import axiosClient from "../lib/axiosClient";

// POST - Tố cáo review vi phạm
export const reportReview = async (reviewId, reportData) => {
  const response = await axiosClient.post(`/api/reviews/${reviewId}/report`, reportData);
  return response.data;
};

// GET - Lấy danh sách review bị tố cáo theo status (Admin)
export const getReportsByStatus = async (status) => {
  const response = await axiosClient.get(`/api/reviews/reports?status=${status}`);
  return response.data;
};

// Backward compatibility & convenience functions
export const getPendingReports = async () => {
  return getReportsByStatus('PENDING');
};

export const getViolatedReports = async () => {
  return getReportsByStatus('VIOLATED');
};

export const getIgnoredReports = async () => {
  return getReportsByStatus('IGNORED');
};

// PUT - Cập nhật trạng thái report (Admin xử lý)
export const updateReportStatus = async (reportId, status) => {
  const response = await axiosClient.put(`/api/reviews/report/${reportId}/status`, { status });
  return response.data;
};
