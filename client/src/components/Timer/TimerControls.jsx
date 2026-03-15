import { Play, Pause, TimerReset } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  pauseSession,
  resetSession,
  resumeSession,
} from "../../features/focus/focusSlice";

const TimerControls = () => {
  const dispatch = useDispatch();
  const { status } = useSelector((s) => s.focus);

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center gap-4">
        {status === "running" && (
          <button
            onClick={() => dispatch(pauseSession())}
            className="group flex items-center gap-2 px-6 py-3 rounded-full
            bg-yellow-400 hover:bg-yellow-500 text-black font-semibold
            shadow-lg hover:shadow-xl transition-all duration-300
            hover:scale-105 active:scale-95"
          >
            <Pause className="w-5 h-5 transition-transform group-hover:scale-110" />
            Pause
          </button>
        )}

        {status === "paused" && (
          <button
            onClick={() => dispatch(resumeSession())}
            className="group flex items-center gap-2 px-6 py-3 rounded-full
            bg-green-500 hover:bg-green-600 text-white font-semibold
            shadow-lg hover:shadow-xl transition-all duration-300
            hover:scale-105 active:scale-95"
          >
            <Play className="w-5 h-5 transition-transform group-hover:scale-110" />
            Resume
          </button>
        )}

        <button
          onClick={() => {
            dispatch(resetSession());
            window.location.reload();
          }}
          className="group flex items-center gap-2 px-4 py-2 rounded-full
          bg-rose-500 hover:bg-rose-600 text-white font-medium
          shadow-md hover:shadow-lg transition-all duration-300
          hover:scale-105 active:scale-95"
        >
          <TimerReset className="w-4 h-4 transition-transform group-hover:rotate-90" />
          Reset
        </button>
      </div>
    </div>
  );
};

export default TimerControls;
