import TimerControls from "./TimerControls";
import TimerDisplay from "./TimerDisplay";
import { useSelector } from "react-redux";

const FocusSessionView = () => {
  const { session, status } = useSelector((s) => s.focus);
  const showCancelNote =
    (status === "running" || status === "paused") && session?.mode === "focus";

  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-10 px-4 sm:px-8 py-8 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <TimerDisplay />
      <TimerControls />

      {showCancelNote && (
        <div className="max-w-md text-center px-4 py-3 rounded-2xl border border-gray-200 dark:border-slate-800 bg-white/70 dark:bg-slate-950/40">
          <p className="text-xs sm:text-sm text-gray-600 dark:text-slate-300">
            Note: If you cancel, we still save the time you’ve focused so far
            (no cheating).
          </p>
        </div>
      )}
    </div>
  );
};

export default FocusSessionView;
