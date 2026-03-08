import { createSlice } from "@reduxjs/toolkit";
import { createGoal, deleteGoal, fetchGoals } from "./goalThunk.js";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const goalSlice = createSlice({
  name: "goal",
  initialState,
  extraReducers: (builder) => {
    // Fetch Goals
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchGoals.rejected, (state) => {
        state.error = "Failed to fetch Goals";
      })

      // Create Goal
      .addCase(createGoal.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      // Delete Goal

      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.items = state.items.filter((g) => g.id !== action.payload);
      });
  },
});

// export const { addGoal, updateGoal, removeGoal } = goalSlice.actions;
export default goalSlice.reducer;
