import { createSlice } from "@reduxjs/toolkit";
import { createGoal, deleteGoal, fetchGoals, updateGoal } from "./goalThunk.js";

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

      // Update Goal
      .addCase(updateGoal.fulfilled, (state, action) => {
        const index = state.items.findIndex((g) => g.id === action.payload.id);

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      // Delete Goal
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.items = state.items.filter((g) => g.id !== action.payload);
      });
  },
});
export const { updateGoalLocal } = goalSlice.actions;
// export const { addGoal, updateGoal, removeGoal } = goalSlice.actions;
export default goalSlice.reducer;
