export const selectUser = (state) => state.auth.user;

export const selectToken = (state) => state.auth.token;

export const selectAuthLoading = (state) => state.auth.loading;

export const selectAuthError = (state) => state.auth.error;
