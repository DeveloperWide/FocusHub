import { configureStore } from "@reduxjs/toolkit";
import taskReducers from "./features/Task/taskSlice";

export const store = configureStore({
  reducer: {
    task: taskReducers,
  },
});
