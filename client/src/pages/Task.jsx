import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import TaskInput from "../components/Task/TaskInput";
import TaskList from "../components/Task/TaskList";
import {
  selectTaskError,
  selectTaskLoading,
  selectTasks,
  createTask,
  deleteTask,
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
  const error = useSelector(selectTaskError);

  const priorityCount = {
    high: tasks.filter((t) => t.priority == "high").length,
    medium: tasks.filter((t) => t.priority == "medium").length,
    low: tasks.filter((t) => t.priority == "low").length,
  };
  //  Todo : Write the priorityCount Obj in Optimized way
  /* const priorityCount = tasks.reduce((acc, task) => acc[task.priority]++, {
    high: 0,
    medium: 0,
    low: 0,
  }); */

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

  const sortedTasks = [...tasks].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority],
  );

  if (loading) return <p>Loading Tasks...</p>;

  if (error) return <p>{error}</p>;

  return (
    <div>
      <ToastContainer />
      <TaskInput
        priorityCount={priorityCount}
        addTaskHandler={addTaskHandler}
        editingTask={editingTask}
        setEditingTask={setEditingTask}
        updateTaskHandler={updateTaskHandler}
      />
      <p className="text-center text-sm text-gray-500 mt-6">
        How to have a productive day?{" "}
        <Link
          to="/productivity-tips"
          className="text-black font-semibold hover:underline"
        >
          Read tips
        </Link>
      </p>
      <TaskList
        sortedTasks={sortedTasks}
        deleteTaskHandler={deleteTaskHandler}
        setEditingTask={setEditingTask}
      />
    </div>
  );
};

export default Task;
