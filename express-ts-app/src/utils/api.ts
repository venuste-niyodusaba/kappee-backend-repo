import axios, { AxiosResponse, AxiosError, InternalAxiosRequestConfig } from "axios";

const api = axios.create({
  baseURL: "http://localhost:5175/api",
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError & { config?: InternalAxiosRequestConfig & { _retry?: boolean } }) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const res = await axios.post(
          "http://localhost:5175/api/auth/refresh",
          { refreshToken }
        );

        localStorage.setItem("accessToken", res.data.accessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
        }

        return api(originalRequest);
      } catch {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
