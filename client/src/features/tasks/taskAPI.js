import { axiosInstance } from "../../utils/axiosInstance";

export const fetchTasksAPI = () => {
  return axiosInstance.get("/tasks");
};

export const createTaskAPI = (data) => {
  return axiosInstance.post("/tasks", data);
};

export const updateTaskAPI = (taskId, data) => {
  return axiosInstance.put(`/tasks/${taskId}`, data);
};

export const deleteTaskAPI = (taskId) => {
  return axiosInstance.delete(`/tasks/${taskId}`);
};
