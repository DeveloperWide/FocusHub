import { axiosInstance } from "../utils/axiosInstance";

// GET ALL TASKS
export const getTasks = async () => {
  try {
    const { data } = await axiosInstance.get("/tasks");
    return data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

// CREATE TASK
export const createTask = async (taskData) => {
  try {
    const { data } = await axiosInstance.post("/tasks", taskData);
    return data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

// DELETE TASK
export const deleteTask = async (id) => {
  try {
    const { data } = await axiosInstance.delete(`/tasks/${id}`);
    return data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};
