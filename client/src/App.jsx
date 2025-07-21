import "./App.css"
import SidebarLayout from "./layouts/SidebarLayout";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Task from "./components/Task";
import Goal from "./components/Goal";
import Time from "./components/Time";
import Calendar from "./components/Calendar";
import ShowTask from "./components/ShowTask";
import Home from "./components/Home";


const App = () => {
  return (
    <>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="siderbar" element={<SidebarLayout />}>
        <Route path="dashboard" element={<Dashboard />}/>
        <Route path="tasks" element={<Task />}/>
        <Route path="tasks/:id" element={<ShowTask />}/>
        <Route path="goals" element={<Goal />}/>
        <Route path="time" element={<Time />}/>
        <Route path="calendar" element={<Calendar />}/>
      </Route>
    </Routes>
    </>
  )
}

export default App