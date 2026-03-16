import TimerControls from "./TimerControls";
import TimerDisplay from "./TimerDisplay";

const FocusSessionView = () => {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center gap-10 px-4 sm:px-8 py-8 bg-gradient-to-br from-indigo-50 via-white to-emerald-50 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <TimerDisplay />
      <TimerControls />
    </div>
  );
};

export default FocusSessionView;
