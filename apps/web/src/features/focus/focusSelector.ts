import type { RootState } from "../../app/store";

export const selectFocusSession = (state: RootState) => state.focus.session;

export const selectFocusStatus = (state: RootState) => state.focus.status;

export const selectFocusTimeLeft = (state: RootState) => state.focus.timeLeft;

export const selectNextFocusSession = (state: RootState) => state.focus.nextSession;

export const selectFocusSettings = (state: RootState) => state.focus.settings;

export const selectLastEndedFocusSegment = (state: RootState) => state.focus.lastEndedSegment;
