import axios from "axios";
import { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import Header from "../layouts/Header";
import TaskSection from "../components/TaskSection";
import TaskTable from "../components/TaskTable";
import TaskModal from "../components/TaskModal";
import { useLocation } from "react-router-dom";
import { getToken } from "../utils/auth";
import { toast, ToastContainer } from "react-toastify";


const Task = () => {
  const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const location = useLocation();

  const fetchTasks = () => {
    axios.get(`${BASE_URL}/api/tasks/`, {
      headers: {
        Authorization: `Bearer ${getToken()}`
      }
    })
      .then((res) => {
        setData(res.data.data);
        console.log(res.data.data)
        if (res.data.data.length === 0) {
          setModalOpen(true);
          toast.info(`Create Any Task to See Tasks`)
        }
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message || "Something Went Wrong")
        } else {
          toast.error(err.message);
        }
      });
  }

  useEffect(() => {
    if (location.state?.refresh) {
      fetchTasks();
      // Clean the refresh state after using it to prevent infinite re-fetches
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const onSubmit = () => {
    fetchTasks();
    setModalOpen(false);
  };

  const todoTasks = data.filter(task => task.status === "todo");
  const inProgressTasks = data.filter(task => task.status === "in_Progress");
  const completedTasks = data.filter(task => task.status === "done");

  return (
    <div>
      <Header />
      <ToastContainer />
      <div className="flex justify-between px-5 py-3">
        <h2 className="text-2xl font-semibold">My Tasks</h2>
        <div className="btns flex justify-center items-center gap-3">
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 text-white font-semibold w-9 h-9  rounded-full cursor-pointer text-center"
          >
            <AddIcon sx={{ fontSize: "20px" }} />
          </button>
        </div>
      </div>

      <div className="px-5">
        {data && data.length > 0 ? (
          <div className="tasks">
            {todoTasks?.length > 0 && (
              <TaskSection title="To Do">
                <TaskTable tasks={todoTasks} />
              </TaskSection>
            )}

            {inProgressTasks?.length > 0 && (
              <TaskSection title="In Progress">
                <TaskTable tasks={inProgressTasks} />
              </TaskSection>
            )}

            {completedTasks?.length > 0 && (
              <TaskSection title="Done">
                <TaskTable tasks={completedTasks} />
              </TaskSection>
            )}
          </div>
        ) : (
          <p className="flex justify-center items-center h-full w-full text-2xl font-semibold italic">No Task Added</p>
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={() => onSubmit()}
      />
    </div>

  );
};

export default Task;
