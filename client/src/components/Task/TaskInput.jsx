import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectTasks } from "../../features/tasks/taskSelector";
import { selectGoals } from "../../features/goals";
import TextField from "@mui/material/TextField";

const TaskInput = ({
  priorityCount,
  editingTask,
  setEditingTask,
  updateTaskHandler,
  addTaskHandler,
}) => {
  const tasks = useSelector(selectTasks);
  const goals = useSelector(selectGoals);

  const [task, setTask] = useState({
    title: "",
    priority: "high",
    type: "task",
    tag: "",
  });

  useEffect(() => {
    if (editingTask) {
      setTask({
        title: editingTask.title,
        priority: editingTask.priority,
        type: editingTask.type,
        tag: editingTask.tag || "",
      });
    }
  }, [editingTask]);

  const onChangeHandler = (e) => {
    setTask((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <>
      {(tasks.length < 5 || editingTask) && (
        <div
          className="
        w-[95%] max-w-4xl
        mx-auto mt-6
        bg-white/80 dark:bg-slate-900/70 backdrop-blur-md
        border border-gray-200 dark:border-slate-700
        rounded-xl
        shadow-[0_8px_25px_rgba(0,0,0,0.08)]
        flex flex-col md:flex-row
        items-stretch md:items-center
        gap-3
        px-4 py-3
        transition"
        >
          {/* TYPE */}
          <select
            name="type"
            value={task.type}
            onChange={onChangeHandler}
            className="
          text-sm font-medium
          text-gray-600 dark:text-slate-200
          bg-gray-50 dark:bg-slate-950
          border border-gray-200 dark:border-slate-700
          rounded-lg
          px-3 py-2
          outline-none
          md:w-auto w-full"
          >
            <option value="task">Task</option>

            {goals.length > 0 &&
              goals.map((g) => (
                <option key={g.id} value={g.tag}>
                  {g.tag}
                </option>
              ))}
          </select>

          {/* TITLE */}
          <TextField
            variant="standard"
            placeholder="Add a new task..."
            value={task.title}
            name="title"
            onChange={onChangeHandler}
            sx={{
              flex: 1,
              minWidth: 120,
            }}
            InputProps={{
              disableUnderline: true,
              style: {
                fontSize: 14,
                padding: "6px 8px",
              },
            }}
          />

          {/* TAG */}
          <TextField
            variant="standard"
            placeholder="Tag"
            value={task.tag}
            name="tag"
            onChange={onChangeHandler}
            sx={{
              width: { xs: "100%", md: 120 },
            }}
            InputProps={{
              disableUnderline: true,
              style: {
                fontSize: 14,
                padding: "6px 8px",
              },
            }}
          />

          {/* PRIORITY */}
          <select
            name="priority"
            value={task.priority}
            onChange={onChangeHandler}
            className="
          text-sm
          border border-gray-200 dark:border-slate-700
          bg-gray-50 dark:bg-slate-950
          rounded-lg
          px-3 py-2
          text-gray-600 dark:text-slate-200
          outline-none
          md:w-auto w-full"
          >
            <option value="high" disabled={priorityCount.high >= 1}>
              High
            </option>

            <option value="medium" disabled={priorityCount.medium >= 2}>
              Medium
            </option>

            <option value="low" disabled={priorityCount.low >= 3}>
              Low
            </option>
          </select>

          {/* BUTTON */}
          <button
            onClick={() => {
              if (editingTask) {
                updateTaskHandler(editingTask.id, task);
                setEditingTask(null);
              } else {
                addTaskHandler(task, setTask);
              }

              setTask({
                title: "",
                priority: "high",
                type: "task",
                tag: "",
              });
            }}
            className={`
          ${editingTask ? "bg-indigo-600" : "bg-gray-900 dark:bg-indigo-600"}
          text-white
          text-sm
          font-semibold
          px-5 py-2
          rounded-lg
          hover:opacity-90
          transition
          shadow-md
          md:w-auto w-full`}
          >
            {editingTask ? "Update" : "Add"}
          </button>
        </div>
      )}
    </>
  );
};

export default TaskInput;
