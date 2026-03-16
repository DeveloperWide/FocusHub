export const selectUser = (state) => state.auth.user;

export const selectAuthLoading = (state) => state.auth.loading;

export const selectAuthError = (state) => state.auth.error;

export const selectAuthInitialized = (state) => state.auth.initialized;
