import { createSlice } from "@reduxjs/toolkit";
import { fetchMe, loginUser, logoutUser, signupUser } from "./authThunk";

const initialState = {
  user: null,
  loading: false,
  sessionLoading: false,
  error: null,
  initialized: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutLocal: (state) => {
      state.user = null;
      state.loading = false;
      state.sessionLoading = false;
      state.error = null;
      state.initialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMe.pending, (state) => {
        state.sessionLoading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.sessionLoading = false;
        state.user = action.payload.user;
        state.initialized = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.initialized = true;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.sessionLoading = false;
        state.error = action.payload || "Failed to restore session";
        state.initialized = true;
      })
      // pending
      .addMatcher(
        (action) =>
          action.type === loginUser.pending.type ||
          action.type === signupUser.pending.type ||
          action.type === logoutUser.pending.type,
        (state) => {
          state.loading = true;
          state.error = null;
        },
      )

      // fulfilled
      .addMatcher(
        (action) =>
          action.type === loginUser.fulfilled.type ||
          action.type === signupUser.fulfilled.type,
        (state, action) => {
          state.loading = false;
          state.user = action.payload.user;
          state.initialized = true;
        },
      )

      // rejected
      .addMatcher(
        (action) =>
          action.type === loginUser.rejected.type ||
          action.type === signupUser.rejected.type ||
          action.type === logoutUser.rejected.type,
        (state, action) => {
          state.loading = false;
          state.error = action.payload || "Authentication failed";
          state.initialized = true;
        },
      );
  },
});

export const { logoutLocal } = authSlice.actions;
export default authSlice.reducer;
