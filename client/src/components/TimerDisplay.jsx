import { useState } from "react";

const TimerDisplay = ({ time }) => {
  const formatTime = (seconds) => {
    const abs = Math.abs(seconds);
    const mins = String(Math.floor(abs / 60)).padStart(2, "0");
    const secs = String(abs % 60).padStart(2, "0");
    return `${seconds < 0 ? "-" : ""}${mins}:${secs}`;
  };
  const [task, setTask] = useState("Task Title here");
  const onChangeHandler = (e) => {
    setTask(e.target.value)
  }

  return (
      <div className="rounded-xl p-4 mb-4 text-center overflow-hidden">
        <div className="task">
          <input
            type="text"
            name="task"
            id="task"
            value={task}
            onChange={onChangeHandler}
            placeholder="Enter Task Title Here"
            className="w-70 p-3 rounded-xl text-center 
                   bg-white/10 backdrop-blur-md 
                   border border-gray-300 text-gray-700 capitalize text-xl
                   placeholder-gray-400 
                   focus:outline-none focus:ring-2 focus:ring-blue-400 
                   transition-all duration-300"
          />
          <button className="px-4 ms-1 py-2 rounded-lg font-semibold transition-all duration-300 bg-green-600 hover:bg-green-700 text-white cursor-pointer">Add</button>
        </div>
        <h2 className="taskTitle text-center py-5 px-3">{task}</h2>
        <div className="text-8xl sm:text-9xl font-bold text-gray-900 tracking-wider">
          {formatTime(time)}
        </div>
      </div>
  );
};

export default TimerDisplay;
