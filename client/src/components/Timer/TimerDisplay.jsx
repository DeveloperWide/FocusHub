import { useSelector } from "react-redux";
import { formatTime } from "../../utils/timerUtils";

const TimerDisplay = () => {
  const { timeLeft, session, status } = useSelector((s) => s.focus);

  return (
    <div className="flex flex-col items-center justify-center text-center">
      {/* Focus Title */}
      <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">
        Current Focus
      </p>

      <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 capitalize">
        {session?.title || "Focus Session"}
      </h2>

      {/* Timer Container */}
      <div
        className={`
        mt-8 px-10 py-8 rounded-3xl 
        bg-white/70 backdrop-blur-md
        shadow-[0_20px_60px_rgba(0,0,0,0.1)]
        border border-gray-200
        flex flex-col items-center
        `}
      >
        {/* Timer */}
        <div
          className={`
          text-7xl sm:text-8xl md:text-9xl 
          font-extrabold tracking-widest
          font-mono text-gray-900
          transition-all duration-500
          ${status === "running" ? "animate-pulse" : ""}
          `}
        >
          {formatTime(timeLeft)}
        </div>

        {/* Status */}
        <div className="mt-4 flex items-center gap-2 text-sm font-medium">
          <span
            className={`w-2 h-2 rounded-full ${
              status === "running"
                ? "bg-green-500"
                : status === "paused"
                  ? "bg-yellow-500"
                  : "bg-gray-400"
            }`}
          ></span>

          <span className="capitalize text-gray-500">{status}</span>
        </div>
      </div>
    </div>
  );
};

export default TimerDisplay;
