import { useDispatch, useSelector } from "react-redux";
import {
  selectFocusSession,
  selectFocusStatus,
  selectFocusTimeLeft,
} from "../features/focus/focusSelector";
import { useEffect } from "react";
import { tick } from "../features/focus/focusSlice";
import { formatTime } from "../utils/timerUtils";

export const useFocusSession = () => {
  const dispatch = useDispatch();
  const status = useSelector(selectFocusStatus);
  const session = useSelector(selectFocusSession);
  const timeLeft = useSelector(selectFocusTimeLeft);

  useEffect(() => {
    if (!session || status !== "running") return;

    document.title = `${formatTime(timeLeft)} • FocusHub`;

    const interval = setInterval(() => {
      dispatch(tick());
    }, 1000);

    return () => clearInterval(interval);
  }, [status, session, timeLeft, dispatch]);
};
