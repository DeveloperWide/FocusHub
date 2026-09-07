import { axiosInstance } from "../utils/axiosInstance";

export const createCheckoutAPI = (data) => {
  return axiosInstance.post("/subscriptions/checkout", data);
};

export const verifyPaymentAPI = (data) => {
  return axiosInstance.post("/subscriptions/verify", data);
};
