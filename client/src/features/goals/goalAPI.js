import { axiosInstance } from "../../utils/axiosInstance";

export const fetchGoalsAPI = () => {
  return axiosInstance.get("/goals");
};

export const createGoalAPI = (data) => {
  return axiosInstance.post("/goals", data);
};

// TODO: add it later if needed

/* export const updateGoalAPI = (taskId, data) => {
  return axiosInstance.put(`/goals/${taskId}`, data);
}; */

export const deleteGoalAPI = (goalId) => {
  return axiosInstance.delete(`/goals/${goalId}`);
};
