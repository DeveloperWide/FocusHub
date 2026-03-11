import { createSlice } from "@reduxjs/toolkit";
import { createTask, deleteTask, fetchTasks, updateTask } from "./taskThunk";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  extraReducers: (builder) => {
    // Fetch Tasks
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchTasks.rejected, (state) => {
        state.error = "Failed to fetch Tasks";
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.items.findIndex((t) => t.id === action.payload.id); // if not found = -1

        if (index != -1) {
          state.items[index] = action.payload;
        }
      })

      // Delete Task

      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      });
  },
});

// export const { addTask, removeTask } = taskSlice.actions;
export default taskSlice.reducer;
