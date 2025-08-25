import { createContext, useState } from "react";

// 1️⃣ Create Context
export const TaskContext = createContext();

// 2️⃣ Create Provider
export const TaskProvider = ({ children }) => {
  const [task, setTask] = useState("");
  return (
    <TaskContext.Provider value={{ task, setTask }}>
      {children}
    </TaskContext.Provider>
  );
};
