import { configureStore } from "@reduxjs/toolkit";
import taskReducers from "../features/tasks/taskSlice.js";
import goalReducers from "../features/goals/goalSlice.js";

export const store = configureStore({
  reducer: {
    tasks: taskReducers,
    goals: goalReducers,
  },
});
