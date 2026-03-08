import { createAsyncThunk } from "@reduxjs/toolkit";
import { createGoalAPI, deleteGoalAPI, fetchGoalsAPI } from "./goalAPI";

export const fetchGoals = createAsyncThunk("goals/fetchGoals", async () => {
  const res = await fetchGoalsAPI();
  return res.data.data;
});

export const createGoal = createAsyncThunk("goals/createGoal", async (data) => {
  const res = await createGoalAPI(data);
  console.log("createGoalThunk : ", res.data.data);
  return res.data.data;
});

// UpdateGoal Thunk here

export const deleteGoal = createAsyncThunk(
  "goals/deleteGoal",
  async (goalId) => {
    await deleteGoalAPI(goalId);
    console.log("deleteGoalThunk : ", goalId);
    return goalId;
  },
);
