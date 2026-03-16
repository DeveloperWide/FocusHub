import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TaskInput from "../components/Task/TaskInput";
import TaskList from "../components/Task/TaskList";
import { selectUser } from "../features/auth/authSelector";
import {
  selectTaskLoading,
  selectTasks,
  createTask,
  deleteTask,
  toggleTaskComplete,
  updateTask,
} from "../features/tasks/index";
import { getEffectivePlanId, getEntitlements } from "../utils/billingPlans";

const priorityOrder = {
  high: 1,
  medium: 2,
  low: 3,
};

const Task = () => {
  const [editingTask, setEditingTask] = useState(null);

  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const tasks = useSelector(selectTasks);
  const loading = useSelector(selectTaskLoading);

  const planId = getEffectivePlanId(user);
  const entitlements = getEntitlements(planId);
  const priorityLimits = entitlements?.tasks || {};

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

    const limit = priorityLimits?.[task.priority];
    if (Number.isFinite(limit) && (priorityCount?.[task.priority] || 0) >= limit) {
      toast.warning(
        `You reached the ${task.priority} task limit. Upgrade to unlock higher limits.`,
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

  const reachedAnyLimit =
    ["high", "medium", "low"].some((p) => {
      const limit = priorityLimits?.[p];
      return Number.isFinite(limit) && (priorityCount?.[p] || 0) >= limit;
    }) && planId === "free";

  return (
    <div className="flex-1 w-full max-w-5xl">
      <ToastContainer />
      {reachedAnyLimit && (
        <div className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200 p-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm font-semibold">
              You’re hitting today’s task limits.
            </p>
            <p className="text-xs opacity-90 mt-1">
              Upgrade to increase daily limits for each priority.
            </p>
          </div>
          <Link
            to="/app/pricing"
            className="shrink-0 inline-flex items-center justify-center px-3 py-2 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition"
          >
            See pricing
          </Link>
        </div>
      )}
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
