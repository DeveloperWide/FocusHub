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
import ProtectedRoute from "./utils/ProtectedRoute";
import Logout from "./pages/Logout";
import { ToastContainer } from "react-toastify";
import ActivityLogs from "./TimePageComponents/ActivityLogs";
import ProductivityStreak from "./TimePageComponents/ProductivityStreak";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { fetchGoals } from "./features/goals/goalThunk";
import { fetchTasks } from "./features/tasks/taskThunk";
import FocusTimer from "./pages/FocusTimer";
import { fetchMe } from "./features/auth/authThunk";
import { selectUser } from "./features/auth/authSelector";
import Pricing from "./pages/Pricing";
import PublicLayout from "./components/public/PublicLayout";
import AuthLayout from "./layouts/AuthLayout";
import About from "./pages/About";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Contact from "./pages/Contact";

const App = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  console.log(user)

  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    dispatch(fetchMe());
  }, [dispatch]);

  useEffect(() => {
    if (!user) return;

    dispatch(fetchGoals());
    dispatch(fetchTasks());

    // Refresh daily tasks automatically at local midnight
    let timeoutId;

    const scheduleMidnightRefresh = () => {
      const now = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 200);

      const delay = Math.max(0, midnight.getTime() - now.getTime());
      timeoutId = setTimeout(() => {
        dispatch(fetchTasks());
        scheduleMidnightRefresh();
      }, delay);
    };

    scheduleMidnightRefresh();

    return () => clearTimeout(timeoutId);
  }, [dispatch, user]);

  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Route>
        <Route path="/pricing" element={<Pricing />} />

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
          <Route path="pricing" element={<Pricing embedded />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
