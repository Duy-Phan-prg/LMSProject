import axiosClient from "../lib/axiosClient";

// GET - Tạo payment URL với VNPay
// Params: borrowingId, amount (optional)
export const createPayment = async (borrowingId, amount) => {
  const params = { borrowingId };
  if (amount) params.amount = amount;
  
  const response = await axiosClient.get("/api/payment/create", { params });
  return response.data;
};

// GET - VNPay return callback handler
// Xử lý kết quả thanh toán từ VNPay sau khi user thanh toán xong
// VNPay sẽ redirect về URL này với các query params
export const handleVNPayReturn = async (queryParams) => {
  const response = await axiosClient.get("/api/payment/vnpay-return", { 
    params: queryParams 
  });
  return response.data;
};

export default {
  createPayment,
  handleVNPayReturn,
};
