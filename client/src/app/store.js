import { configureStore } from "@reduxjs/toolkit";
import taskReducers from "../features/tasks/taskSlice.js";
import goalReducers from "../features/goals/goalSlice.js";
import authReducers from "../features/auth/authSlice.js";
import focusReducer from "../features/focus/focusSlice.js";
import { calculateRemainingTime } from "../utils/timerUtils.js";

const savedSession = JSON.parse(localStorage.getItem("focusSession"));

const session = savedSession || null;

export const store = configureStore({
  reducer: {
    tasks: taskReducers,
    goals: goalReducers,
    auth: authReducers,
    focus: focusReducer,
  },

  preloadedState: {
    focus: {
      session: session,
      timeLeft: session
        ? session.remaining || calculateRemainingTime(session)
        : 0,
      status: session ? session.status : "idle",
    },
  },
});
