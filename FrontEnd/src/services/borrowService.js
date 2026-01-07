import axiosClient from "../lib/axiosClient";

// GET - Admin/Librarian xem tất cả yêu cầu mượn (lọc theo status)
export const getAllBorrowings = async (status = "") => {
  const params = {};
  if (status) params.status = status;
  
  const response = await axiosClient.get("/api/borrowings/getAll", { params });
  return response.data;
};

// GET - User xem danh sách mượn của mình (lọc theo status)
export const getMyBorrowings = async (status = "") => {
  const params = {};
  if (status) params.status = status;
  
  const response = await axiosClient.get("/api/borrowings/me", { params });
  return response.data;
};

// GET - Librarian/Admin xem chi tiết yêu cầu mượn sách
export const getBorrowingDetails = async (borrowingId) => {
  const response = await axiosClient.get(`/api/borrowings/getBorrowingDetails/${borrowingId}`);
  return response.data;
};

// POST - User tạo yêu cầu mượn sách
export const createBorrow = async (bookId) => {
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("accessToken");
  console.log("Creating borrow - userId:", userId, "bookId:", bookId, "token exists:", !!token);
  
  const response = await axiosClient.post("/api/borrowings/create", 
    { bookId },
    { params: { userId } }
  );
  return response.data;
};

// PUT - User hủy yêu cầu mượn sách
export const cancelBorrow = async (borrowingId) => {
  const response = await axiosClient.put(`/api/borrowings/${borrowingId}/cancel`);
  return response.data;
};

// PUT - Librarian giao sách cho user
export const pickupBorrow = async (borrowingId) => {
  const response = await axiosClient.put(`/api/borrowings/${borrowingId}/pickup`);
  return response.data;
};

// PUT - Librarian cập nhật trạng thái mượn sách (RETURNED / EXPIRED_PICKUP)
export const updateBorrowStatus = async (borrowingId, status) => {
  const response = await axiosClient.put(`/api/borrowings/borrowings/${borrowingId}/status`, null, {
    params: { status }
  });
  return response.data;
};
