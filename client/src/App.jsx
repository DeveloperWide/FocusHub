import "./App.css";
import SidebarLayout from "./layouts/SidebarLayout";
import { Route, Routes } from "react-router-dom";
import "react-loading-skeleton/dist/skeleton.css";
import Dashboard from "./pages/Dashboard";
import Task from "./pages/Task";
import Goal from "./pages/Goal";
import Time from "./pages/Time";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from "./components/Auth/Landing";
import ProtectedRoute from "./utils/ProtectedRoute";
import Logout from "./pages/Logout";
import { ToastContainer } from "react-toastify";
import ActivityLogs from "./TimePageComponents/ActivityLogs";
import ProductivityStreak from "./TimePageComponents/ProductivityStreak";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchGoals } from "./features/goals/goalThunk";
import { fetchTasks } from "./features/tasks/taskThunk";
import FocusTimer from "./pages/FocusTimer";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchGoals());
    dispatch(fetchTasks());
  }, [dispatch]);

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />}>
          <Route index element={<Landing />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>

        {/* Sidebar Layout Routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <SidebarLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tasks" element={<Task />} />
          <Route path="goals" element={<Goal />} />
          <Route path="time" element={<Time />} />
          <Route path="focus-timer" element={<FocusTimer />} />
          <Route path="activity-logs" element={<ActivityLogs />} />
          <Route path="productivity-streak" element={<ProductivityStreak />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
