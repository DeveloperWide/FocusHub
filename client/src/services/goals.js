import { axiosInstance } from "../utils/axiosInstance";

// GET GOALS
export const getGoals = async () => {
  try {
    const res = await axiosInstance.get("/goals");
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

// CREATE GOAL
export const addGoal = async (data) => {
  try {
    const res = await axiosInstance.post("/goals", data);
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};

//DELETE GOAL
export const deleteGoal = async (id) => {
  try {
    const res = await axiosInstance.delete(`/goals/${id}`);
    return res.data;
  } catch (err) {
    throw err.response?.data || err.message;
  }
};
