import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  // Helps backend compute "today" correctly for the user's local timezone
  config.headers["x-tz-offset"] = new Date().getTimezoneOffset();

  return config;
});
