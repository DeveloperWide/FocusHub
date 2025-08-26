import { useEffect, useState } from "react";
import { Clock4, Hourglass, List, Flame } from "lucide-react"; // Logs replaced with List
import { Link, useLocation } from "react-router-dom";

const Time = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const location = useLocation();
  const isDisabled = true;

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  // helper for active button styles
  const isActive = (path) => location.pathname.endsWith(path);

  return (
    <div className="h-full flex flex-col justify-center">
      {/* Timer */}
      <div className="flex flex-col justify-center items-center py-6">
        <h1 className="text-6xl sm:text-8xl font-bold text-gray-900">
          {currentTime.toLocaleTimeString()}
          &nbsp;
          {currentTime.getHours() >= 12 ? "PM" : "AM"}
        </h1>
      </div>

      {/* Navigation Icons */}
      <div className="icons flex justify-center gap-4 py-5">
        <Link
          to="/app/focus-timer"
          title="Focus Timer"
          className={`icon p-3 rounded-xl text-white ${isActive("focus-timer") ? "bg-blue-800" : "bg-blue-400 hover:bg-blue-500"
            }`}
        >
          <Hourglass />
        </Link>

<Link
          to="/app/productivity-streak"
          title="Productivity Streak"
          className={`icon p-3 rounded-xl text-white ${isActive("productivity-streak") ? "bg-yellow-600" : "bg-yellow-400 hover:bg-yellow-500"
            } ${isDisabled ? "opacity-50 pointer-events-none" : ""}`}
        >
          <Flame />
        </Link>
        
        <Link
          to="/app/activity-logs"
          title="Activity Logs"
          className={`icon p-3 rounded-xl text-white ${isActive("activity-logs") ? "bg-gray-600" : "bg-gray-400 hover:bg-gray-500"
            }`}
        >
          <List />
        </Link>

        <Link
          to="/app/pomodoro-method"
          title="Pomodoro"
          className={`icon p-3 rounded-xl text-white ${isActive("pomodoro-method")
              ? "bg-purple-600"
              : "bg-purple-400 hover:bg-purple-500"
            } ${isDisabled ? "hidden" : ""}`}
        >
          <Clock4 />
        </Link>


        
      </div>
    </div>
  );
};

export default Time;
