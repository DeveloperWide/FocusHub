import { createSlice } from "@reduxjs/toolkit";
import { fetchGoals } from "./goalThunk.js";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const goalSlice = createSlice({
  name: "goal",
  initialState,
  reducers: {
    addGoal: () => {},
    updateGoal: () => {},
    removeGoal: () => {},
  },
  extraReducers: (builder) => {
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
      });
  },
});

export const { addGoal, updateGoal, removeGoal } = goalSlice.actions;
export default goalSlice.reducer;
