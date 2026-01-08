import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Flag để tránh refresh token nhiều lần
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Request interceptor - gắn token vào header
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - xử lý lỗi 401 và refresh token
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    console.log("Interceptor caught error:", error.response?.status, originalRequest.url);
    console.log("_retry:", originalRequest._retry);

    // Nếu lỗi 401 và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Bỏ qua nếu đang ở trang login/register hoặc đang gọi refresh-token
      if (
        originalRequest.url?.includes("/login") ||
        originalRequest.url?.includes("/register") ||
        originalRequest.url?.includes("/refresh-token")
      ) {
        console.log("Skipping refresh for auth URLs");
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Nếu đang refresh, đợi và retry
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        // Không có refresh token -> logout
        isRefreshing = false;
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        console.log("Attempting to refresh token...");
        // Gọi API refresh token
        const response = await axios.post(
          "http://localhost:8080/api/user/refresh-token",
          { refreshToken }
        );

        console.log("Refresh token response:", response.data);
        
        // Response có thể có wrapper result hoặc không
        const data = response.data.result || response.data;
        console.log("Parsed data:", data);
        
        const { accessToken, refreshToken: newRefreshToken, id, role } = data;
        
        console.log("New accessToken:", accessToken ? "exists" : "MISSING!");
        console.log("New refreshToken:", newRefreshToken ? "exists" : "MISSING!");

        if (!accessToken) {
          console.error("No accessToken in refresh response!");
          throw new Error("No accessToken in refresh response");
        }

        // Lưu token mới
        localStorage.setItem("accessToken", accessToken);
        if (newRefreshToken) {
          localStorage.setItem("refreshToken", newRefreshToken);
        }
        if (id) localStorage.setItem("userId", id);
        if (role) localStorage.setItem("userRole", role);

        // Cập nhật header và retry request
        axiosClient.defaults.headers.Authorization = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        console.log("Token refreshed successfully, retrying request...");
        console.log("Retry URL:", originalRequest.url);
        return axiosClient(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token failed:", refreshError);
        // Refresh token thất bại -> logout
        processQueue(refreshError, null);
        localStorage.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
