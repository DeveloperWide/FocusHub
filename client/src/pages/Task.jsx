import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TaskInput from "../components/Task/TaskInput";
import TaskList from "../components/Task/TaskList";
import {
  selectTaskLoading,
  selectTasks,
  createTask,
  deleteTask,
  toggleTaskComplete,
  updateTask,
} from "../features/tasks/index";

const priorityOrder = {
  high: 1,
  medium: 2,
  low: 3,
};

const Task = () => {
  const [editingTask, setEditingTask] = useState(null);

  const dispatch = useDispatch();

  const tasks = useSelector(selectTasks);
  const loading = useSelector(selectTaskLoading);

  const priorityCount = tasks.reduce(
    (acc, task) => {
      acc[task.priority]++;
      return acc;
    },
    { high: 0, medium: 0, low: 0 },
  );

  const addTaskHandler = (task, setTask) => {
    console.log(task);
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
      type: task.type,
      tag: task.tag,
    };

    console.log(newTask);

    dispatch(createTask(newTask))
      .unwrap()
      .then(() => {
        toast.success("Task Created Successfully");
        setTask({
          title: "",
          priority: "high",
          type: "task",
          tag: "",
        });
      })
      .catch(() => {
        toast.error("Failed to Create Task");
        setTask(newTask);
      });
  };

  const updateTaskHandler = (taskId, data) => {
    dispatch(updateTask({ taskId, data }))
      .then(() => {
        toast.success("Task Updated Successfully");
      })
      .catch(() => {
        toast.error("Task Updation Failed");
      });
  };

  const deleteTaskHandler = (taskId) => {
    dispatch(deleteTask(taskId))
      .unwrap()
      .then(() => {
        toast.success("Task Deleted Successfully");
      })
      .catch(() => {
        toast.error("Failed to Delete");
      });
  };

  const toggleCompleteHandler = (taskId, isComplete) => {
    dispatch(toggleTaskComplete({ taskId, isComplete }))
      .unwrap()
      .then((updated) => {
        toast.success(updated.isComplete ? "Task completed" : "Task restored");
      })
      .catch(() => {
        toast.error("Failed to update task");
      });
  };

  const sortedTasks = [...tasks].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
  );

  return (
    <div className="flex-1 w-full max-w-5xl">
      <ToastContainer />
      <TaskInput
        priorityCount={priorityCount}
        addTaskHandler={addTaskHandler}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        updateTaskHandler={updateTaskHandler}
      />
      <p className="text-center text-sm text-gray-500 dark:text-slate-400 mt-6">
        How to have a productive day?{" "}
        <Link
          to="/productivity-tips"
          className="text-gray-900 dark:text-slate-100 font-semibold hover:underline"
        >
          Read tips
        </Link>
      </p>
      <TaskList
        loading={loading}
        sortedTasks={sortedTasks}
        deleteTaskHandler={deleteTaskHandler}
        setEditingTask={setEditingTask}
        toggleCompleteHandler={toggleCompleteHandler}
      />
    </div>
  );
};

export default Task;
