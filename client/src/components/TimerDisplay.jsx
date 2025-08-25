import { useState } from "react";
import { checkInputValue } from "../utils/helper";
import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";

const TimerDisplay = ({ time }) => {
  const {task, setTask} = useContext(TaskContext)
  const formatTime = (seconds) => {
    const abs = Math.abs(seconds);
    const hrs = Math.floor(abs / 3600);
    const mins = Math.floor((abs % 3600) / 60);
    const secs = abs % 60;

    return hrs > 0
      ? `${seconds < 0 ? "-" : ""}${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
      : `${seconds < 0 ? "-" : ""}${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const [inputValue, setInputValue] = useState("");
  const onChangeHandler = (e) => {
    setInputValue(e.target.value);
  };

  const onKeyDownHandler = (e) => {
    if (e.key === "Enter") checkInputValue(inputValue, setTask, setInputValue);
  };

  const addTask = () => checkInputValue(inputValue, setTask, setInputValue);

  return (
    <div className="text-center">
      {/* Task Input */}
      <div className="flex items-center justify-center gap-2">
        <input
          type="text"
          name="task"
          id="task"
          value={inputValue}
          autoComplete="off"
          onKeyDown={onKeyDownHandler}
          onChange={onChangeHandler}
          placeholder="Enter your focus task..."
          className="w-64 sm:w-80 p-3 rounded-xl text-center 
                     bg-gray-50/80 text-gray-800 placeholder-gray-400 text-lg
                     border border-gray-300 
                     focus:outline-none focus:ring-2 focus:ring-indigo-400 
                     transition-all duration-300 shadow-sm"
        />
        <button
          onClick={addTask}
          className={`px-5 py-2 rounded-xl font-semibold 
                     bg-gradient-to-r from-green-500 to-emerald-600 
                     hover:from-green-600 hover:to-emerald-700 
                     text-white shadow-md hover:shadow-lg cursor-pointer
                     transition-all duration-300`}
        >
          Add
        </button>
      </div>

      {/* Task Title */}
      {task && (
        <h2 className="taskTitle text-center mt-6 mb-4 text-2xl sm:text-3xl capitalize font-semibold text-gray-500 drop-shadow">
          {task}
        </h2>
      )}

      {/* Timer */}
      <div
        className="text-6xl mb-8 mt-4 sm:text-8xl md:text-9xl font-extrabold 
                   tracking-wider 
                   text-gray-900"
      >
        {formatTime(time)}
      </div>
    </div>
  );
};

export default TimerDisplay;
