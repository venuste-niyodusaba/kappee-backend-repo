"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const api = axios_1.default.create({
    baseURL: "http://localhost:5175/api",
});
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));
api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const refreshToken = localStorage.getItem("refreshToken");
            const res = await axios_1.default.post("http://localhost:5175/api/auth/refresh", { refreshToken });
            localStorage.setItem("accessToken", res.data.accessToken);
            if (originalRequest.headers) {
                originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            }
            return api(originalRequest);
        }
        catch {
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            window.location.href = "/login";
        }
    }
    return Promise.reject(error);
});
exports.default = api;
