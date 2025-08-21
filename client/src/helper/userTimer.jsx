import { useState, useRef, useEffect } from "react";

export const useTimer = (initialMinutes = 25) => {
  const [time, setTime] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  useEffect(() => {
    if (time === 0) {
      const audio = new Audio("/alarm-sound.mp3");
      audio.play().catch((err) => console.log("Sound error:", err));
    }
  }, [time]);


  const stop = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = () => isRunning ? stop() : setIsRunning(true);

  const reset = () => {
    stop();
    setTime(initialMinutes * 60);
  };
  
  const setMinutes = (mins) => {
    stop();
    setTime(mins * 60);
  };

  return { time, isRunning, start, stop, reset, setMinutes };
};
