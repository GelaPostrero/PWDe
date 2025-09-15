import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000",
});

// Request interceptor: add token to headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken") || sessionStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: check for 401 (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid → logout
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("authToken")
      window.location.href = "/signin";
    }
    return Promise.reject(error);
  }
);

export default api;
