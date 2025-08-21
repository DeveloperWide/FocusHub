import { Play, Pause, StopCircle } from "lucide-react";

const TimerControls = ({ isRunning, onStart, onReset }) => {
  return (
    <div className="flex justify-center gap-4">
      <button
        onClick={onStart}
        className={`${
          isRunning
            ? "bg-gray-500/80 hover:bg-gray-600/80"
            : "bg-emerald-500/80 hover:bg-emerald-600/80"
        } backdrop-blur-sm text-white py-2 px-3 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg border border-white/20`}
      >
        {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>

      <button
        onClick={onReset}
        className="bg-rose-500/80 hover:bg-rose-600/80 backdrop-blur-sm text-white py-2 px-3 rounded-xl flex items-center gap-2 transition-all duration-300 shadow-lg border border-white/20"
      >
        <StopCircle className="w-5 h-5" />
      </button>
    </div>
  );
};

export default TimerControls;
