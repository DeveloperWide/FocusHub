import { axiosInstance } from "../../utils/axiosInstance";

export const signupUserAPI = (data) => {
  return axiosInstance.post("/auth/signup", data);
};

export const loginUserAPI = (data) => {
  return axiosInstance.post("/auth/login", data);
};
