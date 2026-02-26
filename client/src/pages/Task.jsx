import { useState } from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { toast, ToastContainer } from "react-toastify";
import { Link } from "react-router-dom";

const Task = () => {
  // simple state holding tasks as strings
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      toast.info("Please enter a task");
      return;
    }
    setTasks((prev) => [...prev, trimmed]);
    setInput("");
  };

  return (
    <div>
      <ToastContainer />
      {tasks.length < 5 && (
        <div className="header flex gap-2 w-[97%] justify-center items-center">
          <TextField
            id="task-input"
            sx={{ m: 1 }}
            autoFocus={true}
            className="outline-none flex-1"
            placeholder="New task..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">Task :</InputAdornment>
                ),
              },
            }}
            onKeyPress={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
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
        {tasks.length > 0 ? (
          <ul className="space-y-2">
            {tasks.map((t, idx) => (
              <li
                key={idx}
                className="border p-2 rounded bg-gray-50 flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  name={`task-${idx}`}
                  id={`task-${idx}`}
                />
                <label htmlFor={`task-${idx}`}>{t}</label>
                <select
                  name="task"
                  className="ml-auto border-none outline-none rounded px-1"
                >
                  <option value="Priority" name="task" selected>
                    Priority
                  </option>
                  <option value="Very Important" name="task">
                    Very Important
                  </option>
                  <option value="Important" name="task">
                    Important
                  </option>
                  <option value="Not Important" name="task">
                    Not Important
                  </option>
                </select>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500 italic">
            No tasks added yet.
          </p>
        )}
      </div>

      {/* <div className="px-5">
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
          <p className="flex justify-center items-center h-full w-full text-2xl font-semibold italic">
            No Task Added
          </p>
        )}
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={() => onSubmit()}
      />*/}
    </div>
  );
};

export default Task;
