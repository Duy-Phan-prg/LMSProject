import axiosClient from "../lib/axiosClient";

// POST - Tố cáo review vi phạm
export const reportReview = async (reviewId, reportData) => {
  const response = await axiosClient.post(`/api/admin/reviews/${reviewId}/report`, reportData);
  return response.data;
};
