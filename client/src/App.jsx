import "./App.css"
import SidebarLayout from "./layouts/SidebarLayout";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Task from "./pages/Task";
import Goal from "./pages/Goal";
import Time from "./pages/Time";
import Calendar from "./pages/Calendar";
import ShowTask from "./pages/ShowTask";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Landing from "./components/Landing";
import ProtectedRoute from "./utils/ProtectedRoute";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Logout from "./pages/Logout";
import { ToastContainer } from "react-toastify";

const App = () => {
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
          <Route path="tasks/:id" element={<ShowTask />} />
          <Route path="goals" element={<Goal />} />
          <Route path="time" element={<Time />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="logout" element={<Logout />} />
        </Route>
      </Routes>
    </>
  )
}

export default App;
