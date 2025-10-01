// src/utils/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5175/api",
});

// Attach access token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 → try refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(
          "http://localhost:5175/api/auth/refresh",
          { refreshToken }
        );

        localStorage.setItem("accessToken", res.data.accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return api(originalRequest);
      } catch (err) {
        // Refresh failed → logout
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
