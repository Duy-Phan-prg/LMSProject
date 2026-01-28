import axiosClient from "../lib/axiosClient";

// POST - Tố cáo review vi phạm
export const reportReview = async (reviewId, reportData) => {
  const response = await axiosClient.post(`/api/reviews/${reviewId}/report`, reportData);
  return response.data;
};

// GET - Lấy danh sách review bị tố cáo (Admin)
export const getViolatedReviews = async () => {
  const response = await axiosClient.get("/api/reviews/violated");
  return response.data;
};
