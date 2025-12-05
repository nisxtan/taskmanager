import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/slices/authSlice";

const axiosInstance = axios.create({
  baseURL: "http://localhost:9009/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

//request interceptor

axiosInstance.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem("token");
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

//response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      console.log("API Error: ", error.response.data);

      //Only redirect to /login for authentication failures,
      // NOT for admin login errors
      if (error.response.status === 401) {
        const errorMessage = error.response.data?.message || "";

        // Don't redirect if it's an admin login error
        if (errorMessage.includes("Admin accounts must use admin login")) {
          return Promise.reject(error);
        }

        // Don't redirect if it's a login/register request failing
        const url = error.config?.url || "";
        if (
          url.includes("/login") ||
          url.includes("/register") ||
          url.includes("/admin/login")
        ) {
          return Promise.reject(error);
        }

        // Only logout and redirect for authenticated requests that fail
        store.dispatch(logout());
        // window.location.href = "/login";
      }
    } else if (error.request) {
      console.error("Network error: ", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
