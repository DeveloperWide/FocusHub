import { createSlice } from "@reduxjs/toolkit";
import { calculateRemainingTime } from "../../utils/timerUtils";

const FOCUS_STATE_KEY = "focusState";
const FOCUS_SETTINGS_KEY = "focusSettings";

const defaultSettings = {
  focusMinutes: 25,
  shortBreakMinutes: 5,
  longBreakMinutes: 15,
  longBreakEvery: 4,
  autoNext: true,
  notificationsEnabled: false,
  soundEnabled: true,
};

const loadSettings = () => {
  try {
    const raw = localStorage.getItem(FOCUS_SETTINGS_KEY);
    if (!raw) return defaultSettings;
    const parsed = JSON.parse(raw);
    return { ...defaultSettings, ...(parsed || {}) };
  } catch {
    return defaultSettings;
  }
};

const loadFocusState = () => {
  try {
    const raw = localStorage.getItem(FOCUS_STATE_KEY);
    if (raw) return JSON.parse(raw);

    // Backward-compat: old key stored as session object + status
    const oldRaw = localStorage.getItem("focusSession");
    if (!oldRaw) return null;

    const old = JSON.parse(oldRaw);
    if (!old || typeof old !== "object") return null;

    return {
      session: {
        ...old,
        mode: old.mode || "focus",
        goalTag: old.goalTag || null,
        totalDuration: old.totalDuration || old.duration,
      },
      status: old.status || "idle",
      flow: { focusCount: 0 },
      nextSession: null,
      settings: loadSettings(),
    };
  } catch {
    return null;
  }
};

const persistFocusState = (state) => {
  try {
    const payload = {
      session: state.session,
      status: state.status,
      nextSession: state.nextSession,
      flow: state.flow,
      settings: state.settings,
      timeLeft: state.timeLeft,
    };

    localStorage.setItem(FOCUS_STATE_KEY, JSON.stringify(payload));
    localStorage.removeItem("focusSession");
  } catch {
    // ignore
  }
};

const clearPersistedFocusState = () => {
  try {
    localStorage.removeItem(FOCUS_STATE_KEY);
    localStorage.removeItem("focusSession");
  } catch {
    // ignore
  }
};

const computeDurationForMode = (settings, mode) => {
  if (mode === "shortBreak") return Math.max(1, settings.shortBreakMinutes) * 60;
  if (mode === "longBreak") return Math.max(1, settings.longBreakMinutes) * 60;
  return Math.max(1, settings.focusMinutes) * 60;
};

const computeNextMode = (state, currentMode) => {
  if (currentMode === "focus") {
    const every = Math.max(1, Number(state.settings.longBreakEvery) || 4);
    const nextCount = (state.flow.focusCount || 0) + 1;
    return nextCount % every === 0 ? "longBreak" : "shortBreak";
  }
  return "focus";
};

const endCurrentSegment = (state, endedAtMs, status) => {
  const mode = state.session?.mode || "focus";
  const totalDuration = state.session?.totalDuration || state.session?.duration || 0;

  let elapsedSeconds = totalDuration;
  if (status === "cancelled") {
    const remaining =
      typeof state.session?.remaining === "number"
        ? state.session.remaining
        : state.timeLeft;

    elapsedSeconds = Math.max(1, Math.round(totalDuration - (remaining || 0)));
  }

  const nextMode = status === "completed" ? computeNextMode(state, mode) : null;

  state.lastEndedSegment = {
    title: state.session?.title || "Focus Session",
    goalTag: state.session?.goalTag || null,
    mode,
    status,
    durationSeconds: elapsedSeconds,
    startedAt: endedAtMs - elapsedSeconds * 1000,
    endedAt: endedAtMs,
    nextMode,
  };

  if (mode === "focus" && status === "completed") {
    state.flow.focusCount = (state.flow.focusCount || 0) + 1;
  }

  if (status === "completed") {
    const nextDuration = computeDurationForMode(state.settings, nextMode);
    state.nextSession = nextMode
      ? {
          title: state.session?.title || "Focus Session",
          goalTag: state.session?.goalTag || null,
          mode: nextMode,
          duration: nextDuration,
        }
      : null;
  } else {
    state.nextSession = null;
  }

  state.session = null;
  state.timeLeft = 0;
  state.status = state.nextSession ? "ready" : "idle";
};

const hydrated = loadFocusState();
const hydratedSettings = hydrated?.settings || loadSettings();

const initialState = {
  session: hydrated?.session || null,
  timeLeft:
    hydrated?.session && hydrated?.status === "running"
      ? calculateRemainingTime(hydrated.session)
      : hydrated?.timeLeft || hydrated?.session?.remaining || 0,
  status: hydrated?.status || "idle",
  nextSession: hydrated?.nextSession || null,
  flow: hydrated?.flow || { focusCount: 0 },
  settings: hydratedSettings,
  lastEndedSegment: null,
};

export const focusSlice = createSlice({
  name: "focus",
  initialState,
  reducers: {
    startSession: (state, action) => {
      const { title, goalTag, duration, mode, resetFlow, settings } =
        action.payload || {};

      if (settings && typeof settings === "object") {
        state.settings = { ...state.settings, ...settings };
        try {
          localStorage.setItem(
            FOCUS_SETTINGS_KEY,
            JSON.stringify(state.settings),
          );
        } catch {
          // ignore
        }
      }

      if (resetFlow) state.flow.focusCount = 0;

      const seconds = Math.max(1, Number(duration) || 0);
      const session = {
        title: String(title || "Focus Session"),
        goalTag: goalTag ? String(goalTag) : null,
        mode: mode || "focus",
        startedAt: Date.now(),
        duration: seconds,
        totalDuration: seconds,
      };

      state.session = session;
      state.nextSession = null;
      state.status = "running";
      state.timeLeft = session.duration;

      persistFocusState(state);
    },

    tick: (state) => {
      if (!state.session || state.status !== "running") return;

      const remaining = calculateRemainingTime(state.session);
      state.timeLeft = remaining;

      if (remaining <= 0) {
        endCurrentSegment(state, Date.now(), "completed");

        // Auto-start next if enabled
        if (state.status === "ready" && state.settings.autoNext && state.nextSession) {
          const next = state.nextSession;
          state.session = {
            title: next.title,
            goalTag: next.goalTag,
            mode: next.mode,
            startedAt: Date.now(),
            duration: next.duration,
            totalDuration: next.duration,
          };
          state.nextSession = null;
          state.status = "running";
          state.timeLeft = state.session.duration;
        }

        persistFocusState(state);
        return;
      }

      persistFocusState(state);
    },

    pauseSession: (state) => {
      if (!state.session) return;

      const remaining = calculateRemainingTime(state.session);

      state.timeLeft = remaining;
      state.session.remaining = remaining;

      delete state.session.startedAt;

      state.status = "paused";

      persistFocusState(state);
    },

    resumeSession: (state) => {
      if (!state.session) return;

      state.session.startedAt = Date.now();
      state.session.duration = state.session.remaining;

      delete state.session.remaining;

      state.status = "running";

      persistFocusState(state);
    },

    resetSession: (state) => {
      state.session = null;
      state.nextSession = null;
      state.timeLeft = 0;
      state.status = "idle";
      state.flow.focusCount = 0;

      clearPersistedFocusState();
    },

    cancelSession: (state) => {
      if (!state.session) {
        state.nextSession = null;
        state.status = "idle";
        state.timeLeft = 0;
        clearPersistedFocusState();
        return;
      }

      endCurrentSegment(state, Date.now(), "cancelled");
      clearPersistedFocusState();
    },

    startNextSession: (state) => {
      if (state.status !== "ready" || !state.nextSession) return;

      const next = state.nextSession;
      state.session = {
        title: next.title,
        goalTag: next.goalTag,
        mode: next.mode,
        startedAt: Date.now(),
        duration: next.duration,
        totalDuration: next.duration,
      };

      state.nextSession = null;
      state.status = "running";
      state.timeLeft = state.session.duration;

      persistFocusState(state);
    },

    skipToFocus: (state) => {
      const title = state.session?.title || state.nextSession?.title || "Focus Session";
      const goalTag = state.session?.goalTag || state.nextSession?.goalTag || null;

      const duration = computeDurationForMode(state.settings, "focus");
      state.session = {
        title,
        goalTag,
        mode: "focus",
        startedAt: Date.now(),
        duration,
        totalDuration: duration,
      };
      state.nextSession = null;
      state.status = "running";
      state.timeLeft = duration;

      persistFocusState(state);
    },

    setSettings: (state, action) => {
      const next = action.payload || {};
      state.settings = { ...state.settings, ...next };

      try {
        localStorage.setItem(FOCUS_SETTINGS_KEY, JSON.stringify(state.settings));
      } catch {
        // ignore
      }
    },

    clearLastEndedSegment: (state) => {
      state.lastEndedSegment = null;
    },
  },
});

export const {
  startSession,
  tick,
  pauseSession,
  resumeSession,
  resetSession,
  cancelSession,
  startNextSession,
  skipToFocus,
  setSettings,
  clearLastEndedSegment,
} = focusSlice.actions;
export default focusSlice.reducer;
