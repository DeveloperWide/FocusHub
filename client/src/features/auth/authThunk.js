import { createAsyncThunk } from "@reduxjs/toolkit";
import { loginUserAPI, signupUserAPI } from "./authAPI";
import { saveUserData } from "../../utils/auth";

export const signupUser = createAsyncThunk(
  "auth/signupUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await signupUserAPI(data);
      const { user, token } = res.data;
      saveUserData(token, user);
      return { user, token };
    } catch (err) {
      return rejectWithValue(err.response.data.message || "Signup failed");
    }
  },
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const res = await loginUserAPI(data);
      const { user, token } = res.data;
      saveUserData(token, user);
      return { user, token };
    } catch (err) {
      return rejectWithValue(err.response.data.message || "Login Failed");
    }
  },
);
