import axiosClient from "../lib/axiosClient";

// POST - Tố cáo review vi phạm
export const reportReview = async (reviewId, reportData) => {
  const response = await axiosClient.post(`/api/reviews/${reviewId}/report`, reportData);
  return response.data;
};

// GET - Lấy danh sách tất cả reports theo trạng thái (PENDING, VIOLATED, IGNORED)
export const getReports = async (status) => {
  const params = status ? { status } : {};
  const response = await axiosClient.get("/api/reviews/reports", { params });
  return response.data;
};

// PUT - Cập nhật trạng thái report (Admin xử lý report)
export const updateReportStatus = async (reportId, status) => {
  const response = await axiosClient.put(`/api/reviews/report/${reportId}/status`, null, {
    params: { status }
  });
  return response.data;
};
