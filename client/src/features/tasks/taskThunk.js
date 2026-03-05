import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchTasksAPI } from "./taskAPI";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const res = await fetchTasksAPI();
  return res.data.data;
});
