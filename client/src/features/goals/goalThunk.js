import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createGoalAPI,
  deleteGoalAPI,
  fetchGoalsAPI,
  updateGoalAPI,
} from "./goalAPI";

export const fetchGoals = createAsyncThunk("goals/fetchGoals", async () => {
  const res = await fetchGoalsAPI();
  return res.data.data;
});

export const createGoal = createAsyncThunk("goals/createGoal", async (data) => {
  const res = await createGoalAPI(data);
  console.log("createGoalThunk : ", res.data.data);
  return res.data.data;
});

export const updateGoal = createAsyncThunk(
  "goals/UpdateGoal",
  async ({ goalId, data }) => {
    console.log(goalId, data);
    const res = await updateGoalAPI(goalId, data);
    console.log("updateGoalThunk : ", res.data);
    return res.data.updatedGoal;
  },
);

export const deleteGoal = createAsyncThunk(
  "goals/deleteGoal",
  async (goalId) => {
    await deleteGoalAPI(goalId);
    console.log("deleteGoalThunk : ", goalId);
    return goalId;
  },
);
