import { useState, useRef, useEffect } from "react";
import ringtone from "../assets/ringtone.mp3";
// import { axiosInstance } from "../utils/axiosInstance";

export const useTimer = (initialMinutes = 25) => {
  const [time, setTime] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);

  const timerRef = useRef(null);
  const audioRef = useRef(null);

  const initialTimeRef = useRef(initialMinutes * 60); // remember session length

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            // Play Ringtone
            playAudio();

            // sendFocusData(initialTimeRef.current);

            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const playAudio = () => {
    stopAudio();
    audioRef.current = new Audio(ringtone);
    console.log(audioRef);
    audioRef.current.loop = true;
    audioRef.current.play().catch((err) => console.log("Sound error:", err));
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause(); // stop playback
      audioRef.current.currentTime = 0; // reset position
      audioRef.current = null;
    }
  };

  const stop = () => {
    setIsRunning(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    stopAudio();
  };

  // const sendFocusData = (minutes) => {
  //   console.log(minutes / 60);
  //   axiosInstance
  //     .post("/api/focus/", { task: task, })
  //     .then((res) => {
  //       console.log(res);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // };

  const start = () => (isRunning ? stop() : setIsRunning(true));

  const reset = () => {
    stop();
    setTime(initialMinutes * 60);
    initialTimeRef.current = initialMinutes * 60;
  };

  const setMinutes = (mins) => {
    stop();
    setTime(mins * 60);
    initialTimeRef.current = mins * 60;
  };

  return { time, isRunning, start, stop, reset, setMinutes };
};
