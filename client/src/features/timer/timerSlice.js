import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

export const timerSlice = createSlice({
  name: "timer",
  initialState,
  reducers: {},
  extraReducers: {},
});
