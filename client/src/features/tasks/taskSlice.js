import { createSlice } from "@reduxjs/toolkit";
import { fetchTasks } from "./taskThunk";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.items = state.items.push(action.payload);
    },
    updateTask: () => {},
    removeTask: () => {},
  },
  extraReducers: (builder) => {
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
      });
  },
});

export const { addTask, updateTask, removeTask } = taskSlice.actions;
export default taskSlice.reducer;
