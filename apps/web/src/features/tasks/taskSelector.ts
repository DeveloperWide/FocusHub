import type { RootState } from "../../app/store";

export const selectTasks = (state: RootState) => state.tasks.items;

export const selectTaskLoading = (state: RootState) => state.tasks.loading;

export const selectTaskError = (state: RootState) => state.tasks.error;
