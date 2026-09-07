import { configureStore } from "@reduxjs/toolkit";
import taskReducers from "../features/tasks/taskSlice";
import goalReducers from "../features/goals/goalSlice";
import authReducers from "../features/auth/authSlice";
import focusReducer from "../features/focus/focusSlice";

export const store = configureStore({
  reducer: {
    tasks: taskReducers,
    goals: goalReducers,
    auth: authReducers,
    focus: focusReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
