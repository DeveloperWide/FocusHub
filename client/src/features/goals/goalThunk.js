import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchGoalsAPI } from "./goalAPI";

export const fetchGoals = createAsyncThunk("goals/fetchGoals", async () => {
  const res = await fetchGoalsAPI();
  return res.data.data;
});
