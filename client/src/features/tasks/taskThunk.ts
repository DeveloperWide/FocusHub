import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createTaskAPI,
  deleteTaskAPI,
  fetchTasksAPI,
  toggleTaskCompleteAPI,
  updateTaskAPI,
} from "./taskAPI";

export const fetchTasks = createAsyncThunk<any, void>("tasks/fetchTasks", async () => {
  const res = await fetchTasksAPI();
  return res.data.data;
});

export const createTask = createAsyncThunk<any, any>("tasks/createTask", async (data) => {
  const res = await createTaskAPI(data);
  return res.data.data;
});

export const updateTask = createAsyncThunk<any, any>(
  "tasks/updateTask",
  async ({ taskId, data }: any) => {
    const res = await updateTaskAPI(taskId, data);
    return res.data.data;
  },
);

export const deleteTask = createAsyncThunk<any, any>(
  "tasks/deleteTask",
  async (taskId: any) => {
    await deleteTaskAPI(taskId);
    return taskId;
  },
);

export const toggleTaskComplete = createAsyncThunk<any, any>(
  "tasks/toggleTaskComplete",
  async ({ taskId, isComplete }: any) => {
    const res = await toggleTaskCompleteAPI(taskId, isComplete);
    return res.data.data;
  },
);
