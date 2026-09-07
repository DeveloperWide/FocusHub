import { axiosInstance } from "../../utils/axiosInstance";

export const signupUserAPI = (data) => {
  return axiosInstance.post("/auth/signup", data);
};

export const loginUserAPI = (data) => {
  return axiosInstance.post("/auth/login", data);
};

export const fetchMeAPI = () => {
  return axiosInstance.get("/auth/me");
};

export const logoutAPI = () => {
  return axiosInstance.post("/auth/logout");
};
