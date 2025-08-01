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

const App = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />}>
      <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* Sidebar Layout Routes */}
      <Route path="/app" element={<SidebarLayout />}>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="tasks" element={<Task />} />
        <Route path="tasks/:id" element={<ShowTask />} />
        <Route path="goals" element={<Goal />} />
        <Route path="time" element={<Time />} />
        <Route path="calendar" element={<Calendar />} />
      </Route>
    </Routes>
  )
}

export default App;
