import axios from "axios";

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
    const token = localStorage.getItem("token");
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

      if (error.response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        localStorage.removeItem("email");
        window.location.href = "/login";
      }
    } else if (error.request) {
      //request made, but no response
      console.error("Network error: ", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
