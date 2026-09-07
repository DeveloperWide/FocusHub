import type { RootState } from "../../app/store";

export const selectGoals = (state: RootState) => state.goals.items;

export const selectGoalLoading = (state: RootState) => state.goals.loading;

export const selectGoalError = (state: RootState) => state.goals.error;
