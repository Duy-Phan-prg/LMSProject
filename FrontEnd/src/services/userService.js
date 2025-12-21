import axiosClient from "../lib/axiosClient";

// GET - Lấy danh sách users với pagination, search, filter
export const getAllUsers = async (params = {}) => {
  const { page = 0, size = 10, keyword = "", isActive } = params;
  
  const queryParams = { page, size };
  
  if (keyword) {
    queryParams.keyword = keyword;
  }
  
  if (isActive !== undefined && isActive !== null && isActive !== "") {
    queryParams.isActive = isActive;
  }
  
  const response = await axiosClient.get("/api/user/getAllUsers", {
    params: queryParams,
  });
  return response.data;
};

// GET - Lấy user theo ID (sẽ implement sau)
export const getUserById = async (id) => {
  const response = await axiosClient.get(`/api/user/getUserById/${id}`);
  return response.data;
};

// POST - Tạo user mới
export const createUser = async (userData) => {
  const payload = {
    email: userData.email,
    password: userData.password,
    fullName: userData.fullName,
    phone: userData.phone || "",
    address: userData.address || "",
    role: userData.role || "MEMBER",
  };
  const response = await axiosClient.post("/api/user/create", payload);
  return response.data;
};

// PUT - Cập nhật user
export const updateUser = async (id, userData) => {
  const payload = {
    fullName: userData.fullName,
    phone: userData.phone || "",
    address: userData.address || "",
    role: userData.role || "MEMBER",
    active: userData.active !== undefined ? userData.active : true,
  };
  // Chỉ gửi password nếu có thay đổi
  if (userData.password) {
    payload.password = userData.password;
  }
  const response = await axiosClient.put(`/api/user/update/${id}`, payload);
  return response.data;
};

// DELETE - Xóa user (sẽ implement sau)
export const deleteUser = async (id) => {
  const response = await axiosClient.delete(`/api/user/delete/${id}`);
  return response.data;
};
