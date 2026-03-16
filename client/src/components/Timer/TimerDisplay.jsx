import { useSelector } from "react-redux";
import { formatTime } from "../../utils/timerUtils";

const TimerDisplay = () => {
  const { timeLeft, session, status, nextSession } = useSelector((s) => s.focus);

  const modeLabel = (mode) => {
    if (mode === "shortBreak") return "Short Break";
    if (mode === "longBreak") return "Long Break";
    return "Focus";
  };

  const activeMode = session?.mode || null;
  const nextMode = nextSession?.mode || null;

  const headline =
    status === "ready" && nextSession
      ? `Up Next: ${modeLabel(nextMode)}`
      : modeLabel(activeMode);

  const title =
    session?.title || nextSession?.title || (activeMode ? "Focus Session" : "Ready");

  const displayTime =
    status === "ready" && nextSession ? nextSession.duration : timeLeft;

  return (
    <div className="w-full flex flex-col items-center text-center gap-4">
      <p className="text-xs sm:text-sm uppercase tracking-widest text-gray-500 dark:text-slate-400">
        {headline}
      </p>

      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-slate-100 capitalize">
        {title}
      </h2>

      <div
        className={`mt-6 font-mono font-extrabold tracking-wider text-gray-900 dark:text-slate-100 leading-none text-[clamp(4rem,12vw,9rem)] ${
          status === "running" ? "animate-pulse" : ""
        }`}
      >
        {formatTime(displayTime)}
      </div>

      <div className="mt-1 flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-slate-300">
        <span
          className={`w-2.5 h-2.5 rounded-full ${
            status === "running"
              ? "bg-green-500"
              : status === "paused"
                ? "bg-yellow-500"
                : status === "ready"
                  ? "bg-indigo-500"
                  : "bg-gray-400"
          }`}
        />
        <span className="capitalize">{status}</span>
      </div>
    </div>
  );
};

export default TimerDisplay;
