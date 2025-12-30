import axiosClient from "../lib/axiosClient";

// GET - Lấy danh sách borrowings theo status
export const getAllBorrowings = async (status = "") => {
  const params = {};
  if (status) params.status = status;
  
  const response = await axiosClient.get("/api/borrowings/getAllAndSearchByStatus", { params });
  return response.data;
};

// POST - Tạo yêu cầu mượn sách
export const createBorrow = async (userId, bookId) => {
  const response = await axiosClient.post("/api/borrowings/createBorrow", 
    { bookId },
    { params: { userId } }
  );
  return response.data;
};

// TODO: API duyệt yêu cầu mượn (khi backend sẵn sàng)
export const approveBorrow = async (borrowId) => {
  // const response = await axiosClient.put(`/api/borrowings/approve/${borrowId}`);
  // return response.data;
  throw new Error("API chưa được implement");
};

// TODO: API từ chối yêu cầu mượn (khi backend sẵn sàng)
export const rejectBorrow = async (borrowId) => {
  // const response = await axiosClient.put(`/api/borrowings/reject/${borrowId}`);
  // return response.data;
  throw new Error("API chưa được implement");
};

// TODO: API xác nhận trả sách (khi backend sẵn sàng)
export const returnBorrow = async (borrowId) => {
  // const response = await axiosClient.put(`/api/borrowings/return/${borrowId}`);
  // return response.data;
  throw new Error("API chưa được implement");
};
