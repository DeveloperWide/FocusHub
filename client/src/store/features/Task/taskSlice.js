import { createSlice, nanoid } from "@reduxjs/toolkit";

const initialState = {
  tasks: [{ id: nanoid(), text: "Hello World" }],
};

export const taskSlice = createSlice({
  name: "task",
  initialState,
  reducers: {
    addTask: (state, action) => {
      const task = {
        text: action.payload,
      };
      state.tasks = state.tasks.push(task);
    },
    updateTask: () => {},
    removeTask: () => {},
  },
});

export const { addTask, updateTask, removeTask } = taskSlice.actions;
export default taskSlice.reducer;
