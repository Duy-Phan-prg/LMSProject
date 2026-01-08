import axiosClient from "../lib/axiosClient";

// GET - Admin lấy tất cả reviews
export const getAllReviews = async () => {
  const response = await axiosClient.get("/api/reviews/getAllReviews");
  return response.data;
};

// GET - Lấy danh sách reviews theo bookId
export const getReviewsByBook = async (bookId) => {
  const response = await axiosClient.get(`/api/reviews/book/${bookId}`);
  return response.data;
};

// POST - Tạo review mới
export const createReview = async (userId, reviewData) => {
  const response = await axiosClient.post("/api/reviews/createReview", reviewData, {
    params: { userId }
  });
  return response.data;
};

// PUT - Cập nhật review
export const updateReview = async (reviewId, userId, reviewData) => {
  const response = await axiosClient.put(`/api/reviews/updateReview/${reviewId}`, reviewData, {
    params: { userId }
  });
  return response.data;
};


// DELETE - Xóa review (chỉ owner mới được xóa)
export const deleteReview = async (reviewId, userId) => {
  const response = await axiosClient.delete(`/api/reviews/deleteReview/${reviewId}`, {
    params: { userId }
  });
  return response.data;
};
