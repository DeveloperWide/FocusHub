import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  createGoalAPI,
  deleteGoalAPI,
  fetchGoalsAPI,
  updateGoalAPI,
} from "./goalAPI";

export const fetchGoals = createAsyncThunk<any, void>("goals/fetchGoals", async () => {
  const res = await fetchGoalsAPI();
  return res.data.data;
});

export const createGoal = createAsyncThunk<any, any>("goals/createGoal", async (data) => {
  const res = await createGoalAPI(data);
  console.log("createGoalThunk : ", res.data.data);
  return res.data.data;
});

export const updateGoal = createAsyncThunk<any, any>(
  "goals/UpdateGoal",
  async ({ goalId, data }: any) => {
    console.log(goalId, data);
    const res = await updateGoalAPI(goalId, data);
    console.log("updateGoalThunk : ", res.data);
    return res.data.updatedGoal;
  },
);

export const deleteGoal = createAsyncThunk<any, any>(
  "goals/deleteGoal",
  async (goalId: any) => {
    await deleteGoalAPI(goalId);
    console.log("deleteGoalThunk : ", goalId);
    return goalId;
  },
);
