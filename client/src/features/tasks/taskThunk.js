import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createTaskAPI,
  deleteTaskAPI,
  fetchTasksAPI,
  updateTaskAPI,
} from "./taskAPI";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const res = await fetchTasksAPI();
  return res.data.data;
});

export const createTask = createAsyncThunk("tasks/createTask", async (data) => {
  const res = await createTaskAPI(data);
  return res.data.data;
});

export const updateTask = createAsyncThunk(
  "tasks/updateTask",
  async ({ taskId, data }) => {
    const res = await updateTaskAPI(taskId, data);
    return res.data.data;
  },
);

export const deleteTask = createAsyncThunk(
  "tasks/deleteTask",
  async (taskId) => {
    await deleteTaskAPI(taskId);
    return taskId;
  },
);
