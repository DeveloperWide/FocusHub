import { axiosInstance } from "../../utils/axiosInstance";

export const fetchGoalsAPI = () => {
  return axiosInstance.get("/goals");
};

export const createGoalAPI = (data) => {
  return axiosInstance.post("/goals", data);
};

export const updateGoalAPI = (goalId, data) => {
  return axiosInstance.put(`/goals/${goalId}`, data);
};

export const deleteGoalAPI = (goalId) => {
  return axiosInstance.delete(`/goals/${goalId}`);
};
