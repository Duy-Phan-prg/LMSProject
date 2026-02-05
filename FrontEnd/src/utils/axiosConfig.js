import axios from 'axios';
import authService from '../services/authService';
import Swal from 'sweetalert2';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
});

// Global flag to prevent multiple session expired popups
let isHandlingSessionExpired = false;
let sessionExpiredPromise = null;

// Request interceptor - thêm token vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - xử lý token hết hạn
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu token hết hạn (401) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Nếu đang xử lý session expired rồi thì return cùng promise đó
      if (isHandlingSessionExpired && sessionExpiredPromise) {
        return sessionExpiredPromise;
      }

      try {
        await authService.refreshToken();
        const newToken = authService.getAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Nếu đã có popup rồi thì return cùng promise
        if (isHandlingSessionExpired && sessionExpiredPromise) {
          return sessionExpiredPromise;
        }
        
        // Set flag và tạo promise để các requests khác dùng chung
        isHandlingSessionExpired = true;
        
        // Clear tokens
        authService.clearTokens();
        
        // Tạo promise chung cho tất cả requests
        sessionExpiredPromise = new Promise((resolve, reject) => {
          // Show notification
          Swal.fire({
            icon: 'warning',
            title: 'Phiên đăng nhập hết hạn',
            text: 'Vui lòng đăng nhập lại để tiếp tục',
            confirmButtonText: 'Đăng nhập',
            allowOutsideClick: false,
            allowEscapeKey: false,
          }).then(() => {
            isHandlingSessionExpired = false;
            sessionExpiredPromise = null;
            window.location.href = '/login';
            // Never resolve - page will redirect
          });
        });
        
        return sessionExpiredPromise;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
