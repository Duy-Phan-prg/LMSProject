import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const authService = {
  // Lưu tokens vào localStorage
  setTokens: (accessToken, refreshToken) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  },

  // Lấy access token
  getAccessToken: () => {
    return localStorage.getItem('accessToken');
  },

  // Lấy refresh token
  getRefreshToken: () => {
    return localStorage.getItem('refreshToken');
  },

  // Xóa tokens và user data
  clearTokens: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('userRole');
  },

  // Kiểm tra user đã login chưa
  isAuthenticated: () => {
    return !!localStorage.getItem('accessToken');
  },

  // Gọi Google login - redirect sang backend OAuth2 endpoint
  googleLogin: () => {
    // Có thể dùng endpoint của Spring Security trực tiếp hoặc qua API
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  },

  // Xử lý callback từ Google (lấy tokens từ URL)
  handleOAuth2Callback: () => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');

    if (accessToken && refreshToken) {
      authService.setTokens(accessToken, refreshToken);
      return true;
    }
    return false;
  },

  // Traditional login
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, {
        email,
        password,
      });
      const { accessToken, refreshToken } = response.data;
      authService.setTokens(accessToken, refreshToken);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Register
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/register`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const refreshToken = authService.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await axios.post(`${API_BASE_URL}/user/refresh-token`, {
        refreshToken,
      });
      const { accessToken, refreshToken: newRefreshToken } = response.data;
      authService.setTokens(accessToken, newRefreshToken);
      return response.data;
    } catch (error) {
      authService.clearTokens();
      // Throw error with proper message
      const errorMessage = error.response?.data?.message || error.message || 'Refresh token failed';
      throw new Error(errorMessage);
    }
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/user/me`, {
        headers: {
          Authorization: `Bearer ${authService.getAccessToken()}`,
        },
      });
      
      const userData = response.data;
      
      // Lưu user info vào localStorage
      if (userData) {
        if (userData.id) localStorage.setItem('userId', userData.id);
        if (userData.role) localStorage.setItem('userRole', userData.role);
        localStorage.setItem('user', JSON.stringify(userData));
      }
      
      return userData;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Logout
  logout: async () => {
    try {
      const accessToken = authService.getAccessToken();
      await axios.post(
        `${API_BASE_URL}/user/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      authService.clearTokens();
    }
  },
};

export default authService;

// Named exports for backward compatibility
export const login = (email, password) => authService.login(email, password);
export const register = (userData) => authService.register(userData);
export const refreshToken = () => authService.refreshToken();
export const logout = () => authService.logout();
export const getCurrentUser = () => authService.getCurrentUser();
export const googleLogin = () => authService.googleLogin();
export const handleOAuth2Callback = () => authService.handleOAuth2Callback();
export const setTokens = (accessToken, refreshToken) => authService.setTokens(accessToken, refreshToken);
export const getAccessToken = () => authService.getAccessToken();
export const getRefreshToken = () => authService.getRefreshToken();
export const clearTokens = () => authService.clearTokens();
export const isAuthenticated = () => authService.isAuthenticated();

// Helper function for getting user role
export const getUserRole = () => {
  try {
    const token = authService.getAccessToken();
    if (!token) return null;
    
    // Decode JWT to get role
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    
    const payload = JSON.parse(jsonPayload);
    return payload.role;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
