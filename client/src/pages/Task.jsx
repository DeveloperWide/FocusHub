import { useState } from "react";
import TextField from "@mui/material/TextField";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { createTask, getTasks } from "../services/tasks";
import { getGoals } from "../services/goals";

const Task = () => {
  const [goals, setGoals] = useState([]);
  const [task, setTask] = useState({
    title: "",
    priority: "high",
    tag: "task",
  });

  const [tasks, setTasks] = useState([]);

  const fetchGoals = () => {
    getGoals()
      .then((res) => {
        console.log(res.data);
        setGoals(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getTasks().then((res) => {
      setTasks(res.data);
    });
    fetchGoals();
  }, []);

  console.log(tasks);

  const priorityCount = {
    high: tasks.filter((t) => t.priority == "high").length,
    medium: tasks.filter((t) => t.priority == "medium").length,
    low: tasks.filter((t) => t.priority == "low").length,
  };

  const onChangeHandler = (e) => {
    setTask((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  const handleAdd = () => {
    console.log(task.title);
    const trimmed = task.title.trim();

    if (!trimmed) {
      toast.info("Please enter a task");
      return;
    }

    if (
      (task.priority == "high" && priorityCount.high >= 1) ||
      (task.priority == "medium" && priorityCount.medium >= 2) ||
      (task.priority == "low" && priorityCount.low >= 3)
    ) {
      toast.warning(
        `You reached the task limit for priority ${task.priority}.`,
      );
      return;
    }

    const newTask = {
      title: trimmed,
      priority: task.priority,
      tag: task.tag,
    };

    // setTasks((prev) => [...prev, newTask]);

    createTask(newTask).then((res) => {
      console.log(res);
    });

    setTask({
      title: "",
      priority: "high",
      tag: "task",
    });
  };

  const priorityOrder = {
    high: 1,
    medium: 2,
    low: 3,
  };

  const sortedTasks = [...tasks].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
  );
  return (
    <div>
      <ToastContainer />
      {tasks.length < 5 && (
        <div className="header flex gap-2 w-[97%] justify-center items-center">
          <div className="flex w-full mx-2 my-2 rounded px-2">
            <select
              name="tag"
              className="ml-auto border border-gray-300 text-gray-500 font-semibold my-2 mx-1 outline-none rounded px-2 capitalize"
              value={task.tag}
              onChange={onChangeHandler}
            >
              <option value="task" name="tag">
                Task
              </option>

              {goals.length > 0 &&
                goals.map((g) => <option key={g._id}>{g.tag}</option>)}
            </select>
            <TextField
              id="task-input"
              sx={{ m: 1 }}
              autoFocus={true}
              className="outline-none flex-1"
              placeholder="New task..."
              value={task.title}
              name="title"
              onChange={onChangeHandler}
            />
          </div>
          <select
            name="priority"
            className="ml-auto border-none outline-none rounded px-1"
            value={task.priority}
            onChange={onChangeHandler}
          >
            <option
              value="high"
              disabled={priorityCount.high >= 1}
              name="priority"
            >
              High
            </option>
            <option
              value="medium"
              disabled={priorityCount.medium >= 2}
              name="priority"
            >
              Medium
            </option>
            <option
              value="low"
              disabled={priorityCount.low >= 2}
              name="priority"
            >
              Low
            </option>
          </select>
          <button
            onClick={handleAdd}
            className="border rounded bg-[#2474d5] hover:bg-[#3f7ec7] text-white font-semibold cursor-pointer px-3 py-1.5"
          >
            Add
          </button>
        </div>
      )}

      <p className="text-center text-gray-600 font-bold pt-2">
        How to Have a Productive Day?{" "}
        <Link
          to="/productivity-tips"
          className="text-[#0000eea9] underline tracking-tight cursor-pointer"
        >
          Read Tips
        </Link>
      </p>

      <div className="px-5 mt-4">
        {sortedTasks.length > 0 ? (
          <ul className="space-y-2">
            {sortedTasks.map((t) => (
              <li
                key={t.id}
                className={`border p-2 rounded bg-gray-50 flex items-center gap-2 ${t.priority === "high" ? "border-red-500" : ""} ${t.priority === "medium" ? "border-green-500" : ""} ${t.priority === "low" ? "border-blue-500" : ""}`}
              >
                <input
                  type="checkbox"
                  name={`task-${t.id}`}
                  id={`task-${t.id}`}
                />
                <label htmlFor={`task-${t.id}`}>{t.title}</label>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 italic">
            No tasks added yet.
          </p>
        )}
      </div>
    </div>
  );
};

export default Task;
