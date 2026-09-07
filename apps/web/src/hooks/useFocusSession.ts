import { useAppDispatch, useAppSelector } from "../app/hooks";
import {
  selectFocusSession,
  selectFocusStatus,
  selectFocusTimeLeft,
} from "../features/focus/focusSelector";
import { useEffect } from "react";
import { tick } from "../features/focus/focusSlice";
import { formatTime } from "../utils/timerUtils";

export const useFocusSession = () => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectFocusStatus);
  const session = useAppSelector(selectFocusSession);
  const timeLeft = useAppSelector(selectFocusTimeLeft);

  useEffect(() => {
    const modeLabel =
      session?.mode === "shortBreak"
        ? "Short Break"
        : session?.mode === "longBreak"
          ? "Long Break"
          : "Focus";

    if (status === "running" && session) {
      document.title = `${formatTime(timeLeft)} • ${modeLabel} • FocusHub`;

      const interval = setInterval(() => {
        dispatch(tick());
      }, 1000);

      return () => clearInterval(interval);
    }

    if (status === "ready") {
      document.title = `Ready • FocusHub`;
      return;
    }

    document.title = `FocusHub`;
  }, [status, session, timeLeft, dispatch]);
};
