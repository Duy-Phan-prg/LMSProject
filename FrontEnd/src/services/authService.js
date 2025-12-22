import axiosClient from "../lib/axiosClient";

// POST - Login
export const login = async (credentials) => {
  const response = await axiosClient.post("/api/user/login", {
    email: credentials.email,
    password: credentials.password,
  });
  return response.data;
};

// POST - Register
export const register = async (userData) => {
  const response = await axiosClient.post("/api/user/register", {
    email: userData.email,
    password: userData.password,
    fullName: userData.fullName,
    phone: userData.phone || "",
    address: userData.address || "",
  });
  return response.data;
};

// POST - Logout
export const logoutApi = async () => {
  const response = await axiosClient.post("/api/user/logout");
  return response.data;
};

// POST - Refresh Token
export const refreshTokenApi = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    throw new Error("No refresh token");
  }
  const response = await axiosClient.post("/api/user/refresh-token", {
    refreshToken,
  });
  return response.data;
};

// Lưu token vào localStorage
export const saveTokens = (data) => {
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  localStorage.setItem("userId", data.id);
  localStorage.setItem("userRole", data.role);
};

// Lấy token
export const getAccessToken = () => localStorage.getItem("accessToken");
export const getRefreshToken = () => localStorage.getItem("refreshToken");
export const getUserId = () => localStorage.getItem("userId");
export const getUserRole = () => localStorage.getItem("userRole");

// Xóa token (logout)
export const clearTokens = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userId");
  localStorage.removeItem("userRole");
};

// Kiểm tra đã login chưa
export const isAuthenticated = () => {
  return !!getAccessToken();
};
