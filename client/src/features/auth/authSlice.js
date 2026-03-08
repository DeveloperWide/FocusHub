import { createSlice } from "@reduxjs/toolkit";
import { getToken } from "../../utils/auth";

const initialState = {
  user: null,
  token: getToken() || null,
  loading: false,
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  /* extraReducers: (builder) => {
   builder.addCase(actionCreator, reducer)
  } */
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
