import { configureStore } from "@reduxjs/toolkit";
import taskReducers from "../features/tasks/taskSlice.js";
import goalReducers from "../features/goals/goalSlice.js";
import authReducers from "../features/auth/authSlice.js";

export const store = configureStore({
  reducer: {
    tasks: taskReducers,
    goals: goalReducers,
    auth: authReducers,
  },
});
