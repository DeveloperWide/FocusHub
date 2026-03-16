import { axiosInstance } from "../utils/axiosInstance";

export const fetchBillingPlansAPI = () => {
  return axiosInstance.get("/billing/plans");
};

export const createCheckoutAPI = ({ planId, interval }) => {
  return axiosInstance.post("/billing/checkout", { planId, interval });
};

export const verifyPaymentAPI = (payload) => {
  return axiosInstance.post("/billing/verify", payload);
};

