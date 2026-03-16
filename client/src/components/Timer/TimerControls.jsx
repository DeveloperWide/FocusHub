import { Play, Pause, TimerReset, Forward, XCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  cancelSession,
  pauseSession,
  resetSession,
  resumeSession,
  skipToFocus,
  startNextSession,
} from "../../features/focus/focusSlice";

const TimerControls = () => {
  const dispatch = useDispatch();
  const { status, session, nextSession } = useSelector((s) => s.focus);
  const isBreak = session?.mode && session.mode !== "focus";
  const nextIsBreak = nextSession?.mode && nextSession.mode !== "focus";

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

        {status === "ready" && nextSession && (
          <button
            onClick={() => dispatch(startNextSession())}
            className="group flex items-center gap-2 px-6 py-3 rounded-full
            bg-indigo-600 hover:bg-indigo-700 text-white font-semibold
            shadow-lg hover:shadow-xl transition-all duration-300
            hover:scale-105 active:scale-95"
          >
            <Forward className="w-5 h-5 transition-transform group-hover:scale-110" />
            Start Next
          </button>
        )}

        {(status === "running" || status === "paused") && (
          <button
            onClick={() => dispatch(cancelSession())}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full
            bg-rose-500 hover:bg-rose-600 text-white font-semibold
            shadow-md hover:shadow-lg transition-all duration-300
            hover:scale-105 active:scale-95"
          >
            <XCircle className="w-5 h-5 transition-transform group-hover:scale-110" />
            Cancel
          </button>
        )}

        {(isBreak || (status === "ready" && nextIsBreak)) && (
          <button
            onClick={() => dispatch(skipToFocus())}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full
            bg-emerald-600 hover:bg-emerald-700 text-white font-semibold
            shadow-md hover:shadow-lg transition-all duration-300
            hover:scale-105 active:scale-95"
          >
            <Forward className="w-5 h-5 transition-transform group-hover:scale-110" />
            Skip Break
          </button>
        )}

        {(status === "ready" || status === "idle") && (
          <button
            onClick={() => dispatch(resetSession())}
            className="group flex items-center gap-2 px-4 py-2 rounded-full
            bg-slate-700 hover:bg-slate-800 text-white font-medium
            shadow-md hover:shadow-lg transition-all duration-300
            hover:scale-105 active:scale-95"
          >
            <TimerReset className="w-4 h-4 transition-transform group-hover:rotate-90" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
};

export default TimerControls;
