import { Play, Pause, StopCircle } from "lucide-react";
import { useContext } from "react";
import { TaskContext } from "../context/TaskContext";

const TimerControls = ({ isRunning, onStart, onReset }) => {
  const { task } = useContext(TaskContext);
  const hasTask = task.trim() !== "";

  return (
    <div className="flex flex-col justify-center items-center gap-4">
      {/* Note Message */}
      {!hasTask && (
        <div
          className="flex items-center p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-gray-800 dark:text-yellow-300 dark:border-yellow-800"
          role="alert"
        >
          <svg
            className="shrink-0 inline w-4 h-4 me-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div>
            <span className="font-medium">Note!</span> Add Task Name Before You
            Continue The Timer
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-center gap-4">
        <button
          onClick={onStart}
          disabled={!hasTask}
          className={`
            ${isRunning
              ? "bg-gray-500/80 hover:bg-gray-600/80"
              : "bg-emerald-500/80 hover:bg-emerald-600/80"}
            ${!hasTask && "cursor-not-allowed bg-gray-700 opacity-50 hover:bg-gray-700 hover:opacity-50"}
            backdrop-blur-sm text-white py-2 px-3 rounded-xl flex items-center gap-2 
            transition-all duration-300 shadow-lg border border-white/20
          `}
        >
          {isRunning ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>

        <button
          onClick={onReset}
          className="bg-rose-500/80 hover:bg-rose-600/80 backdrop-blur-sm text-white py-2 px-3 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg border border-white/20"
        >
          <StopCircle className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default TimerControls;
