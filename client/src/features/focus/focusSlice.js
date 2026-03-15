import { createSlice } from "@reduxjs/toolkit";
import { calculateRemainingTime } from "../../utils/timerUtils";

const initialState = {
  session: null,
  timeLeft: 0,
  status: "idle",
};

export const focusSlice = createSlice({
  name: "focus",
  initialState,
  reducers: {
    startSession: (state, action) => {
      const session = {
        ...action.payload,
        startedAt: Date.now(),
      };

      state.session = session;
      state.status = "running";
      state.timeLeft = session.duration;

      localStorage.setItem(
        "focusSession",
        JSON.stringify({ ...state.session, status: state.status }),
      );
    },

    tick: (state) => {
      if (!state.session || state.status !== "running") return;

      const remaining = calculateRemainingTime(state.session);
      state.timeLeft = remaining;

      if (remaining <= 0) {
        state.status = "completed";
        state.session = null;
        state.timeLeft = 0;

        localStorage.removeItem("focusSession");
        return;
      }

      localStorage.setItem(
        "focusSession",
        JSON.stringify({
          ...state.session,
          status: "running",
        }),
      );
    },

    pauseSession: (state) => {
      if (!state.session) return;

      const remaining = calculateRemainingTime(state.session);

      state.timeLeft = remaining;
      state.session.remaining = remaining;

      delete state.session.startedAt;

      state.status = "paused";

      localStorage.setItem(
        "focusSession",
        JSON.stringify({
          ...state.session,
          status: state.status,
        }),
      );
    },

    resumeSession: (state) => {
      if (!state.session) return;

      state.session.startedAt = Date.now();
      state.session.duration = state.session.remaining;

      delete state.session.remaining;

      state.status = "running";

      localStorage.setItem(
        "focusSession",
        JSON.stringify({
          ...state.session,
          status: state.status,
        }),
      );
    },

    resetSession: (state) => {
      state.session = null;
      state.timeLeft = 0;
      state.status = "idle";

      localStorage.removeItem("focusSession");
    },
  },
});

export const { startSession, tick, pauseSession, resumeSession, resetSession } =
  focusSlice.actions;
export default focusSlice.reducer;
