import "./App.css"
import SidebarLayout from "./layouts/SidebarLayout";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Task from "./pages/Task";
import Goal from "./pages/Goal";
import Time from "./pages/Time";
import Calendar from "./pages/Calendar";
import ShowTask from "./pages/ShowTask";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<SidebarLayout />}>
        <Route path="dashboard" element={<Dashboard />}/>
        <Route path="tasks" element={<Task />}/>
        <Route path="tasks/:id" element={<ShowTask />} />
        <Route path="goals" element={<Goal />}/>
        <Route path="time" element={<Time />}/>
        <Route path="calendar" element={<Calendar />}/>
      </Route>
    </Routes>
  )
}

export default App