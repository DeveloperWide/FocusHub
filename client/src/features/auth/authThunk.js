import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchMeAPI, loginUserAPI, logoutAPI, signupUserAPI } from "./authAPI";

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await signupUserAPI(data);
      const { user } = res.data;
      return { user };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Signup failed");
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUserAPI(data);
      const { user } = res.data;
      return { user };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Login Failed");
    }
  },
);

export const fetchMe = createAsyncThunk(
  "auth/fetchMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetchMeAPI();
      return { user: res.data.user };
    } catch (err) {
      if (err?.response?.status === 401) {
        return { user: null };
      }

      return rejectWithValue(
        err?.response?.data?.message || "Failed to restore session",
      );
    }
  },
);

export const logoutUser = createAsyncThunk("auth/logoutUser", async () => {
  try {
    await logoutAPI();
  } catch {
    return true;
  }
  return true;
});
