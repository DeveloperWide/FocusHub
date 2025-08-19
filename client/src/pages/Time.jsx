import React, { useEffect, useState } from "react";
import { Clock4, Hourglass, Logs, Zap, } from "lucide-react";
import {Link} from "react-router-dom"

const Time = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="h-screen flex flex-col">

      {/* Timer */}
      <div className="flex flex-col justify-center items-center flex-1">
        <h1 className="text-6xl sm:text-8xl font-bold text-gray-900">
          {currentTime.toLocaleTimeString()}
        </h1>
        {/* Buttons */}
        <div className="icons flex py-5 gap-3">
          <button className="icon bg-blue-400 hover:bg-blue-500" title="Focus Timer">
             <Link to="/focus-timer"><Hourglass /></Link>
            </button>
          <button className="icon bg-gray-400 hover:bg-gray-500" title="Activity Logs">
            <Link to="/activity-logs"><Logs /></Link>
            </button>
          <button className="icon bg-purple-400 hover:bg-purple-500" title="Pomodoro">
            <Link to="/pomodoro-method"><Clock4 /></Link>
            </button>
          <button className="icon bg-yellow-400 hover:bg-yellow-500" title="Productivity Streak">
            <Link to="productivity-streak"><Zap /></Link>
            </button>
        </div>
      </div>
    </div>
  );
};

export default Time;
