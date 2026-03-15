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
        <div className="w-[95%] mx-auto mt-6 bg-white border border-gray-200 rounded-xl shadow-sm flex items-center gap-3 px-3 py-2">
          {/* TYPE */}
          <select
            name="type"
            value={task.type}
            onChange={onChangeHandler}
            className="border-none outline-none text-sm font-medium text-gray-600 bg-transparent"
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
            sx={{ flex: 1 }}
            InputProps={{ disableUnderline: true }}
          />

          {/* TAG */}
          <TextField
            variant="standard"
            placeholder="Tag"
            value={task.tag}
            name="tag"
            onChange={onChangeHandler}
            sx={{ width: 100 }}
            InputProps={{ disableUnderline: true }}
          />

          {/* PRIORITY */}
          <select
            name="priority"
            value={task.priority}
            onChange={onChangeHandler}
            className="text-sm border border-gray-200 rounded-lg px-2 py-1 text-gray-600 outline-none"
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
            className={`${editingTask ? "bg-blue-600" : "bg-black"} text-white text-sm font-semibold px-4 py-1.5 rounded-lg hover:opacity-90 transition`}
          >
            {editingTask ? "Update" : "Add"}
          </button>
        </div>
      )}
    </>
  );
};

export default TaskInput;
