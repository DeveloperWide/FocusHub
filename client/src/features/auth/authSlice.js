import { createSlice } from "@reduxjs/toolkit";
import { loginUser, signupUser } from "./authThunk";
import { getToken, getUser, logoutUser } from "../../utils/auth";

const initialState = {
  user: getUser(),
  token: getToken(),
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutLocal: (state) => {
      state.user = null;
      state.token = null;
      logoutUser();
    },
  },
  extraReducers: (builder) => {
    builder

      // pending
      .addMatcher(
        (action) =>
          action.type === loginUser.pending.type ||
          action.type === signupUser.pending.type,
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
          state.token = action.payload.token;
        },
      )

      // rejected
      .addMatcher(
        (action) =>
          action.type === loginUser.rejected.type ||
          action.type === signupUser.rejected.type,
        (state, action) => {
          state.loading = false;
          state.error = action.payload || "Authentication failed";
        },
      );
  },
});

export const { logoutLocal } = authSlice.actions;
export default authSlice.reducer;
