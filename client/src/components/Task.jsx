import axios from "axios";
import { useState, useEffect } from "react";
import AddIcon from '@mui/icons-material/Add';
import Header from "../layouts/Header";
import TaskSection from "./TaskSection";
import TaskTable from "./TaskTable";
import TaskModal from "./TaskModal";


const Task = () => {
  const [data, setData] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    axios.get("/api/tasks/")
      .then((res) => setData(res.data.data))
      .catch((err) => console.log(err));
  }, []);

  const onSubmit = () => {
    axios.get("/api/tasks/")
      .then((res) => setData(res.data.data))
      .catch((err) => console.log(err));
    setModalOpen(false);
  }

  console.log(data)

  const todoTasks = data.filter((task) => {
    if (task.status === "todo") {
      return task;
    }
  });

  const inProgressTasks = data.filter((task) => {
    if (task.status === "in_Progress") {
      return task;
    }
  });

  const completedTasks = data.filter((task) => {
    if (task.status === "done") {
      return task;
    }
  });

  console.log(todoTasks);
  console.log(inProgressTasks);
  console.log(completedTasks);


  return (
    <div>
      <Header />
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
        <div className="tasks">
          {todoTasks && todoTasks.length > 0 
          &&
          <TaskSection title="To Do" >
            <TaskTable tasks={todoTasks} />
          </TaskSection>
          }

          {inProgressTasks && inProgressTasks.length > 0
            &&
            <TaskSection title="In Progress" >
              <TaskTable tasks={inProgressTasks} />
            </TaskSection>
          }

          {completedTasks && completedTasks.length > 0 
          &&
            <TaskSection title="Done">
              <TaskTable tasks={completedTasks} />
            </TaskSection>
          }
        </div>
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
