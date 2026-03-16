import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { axiosInstance } from "../utils/axiosInstance";
import {
  enqueueFocusSave,
  loadFocusSaveQueue,
  saveFocusSaveQueue,
} from "../utils/focusSaveQueue";
import { playBeep } from "../utils/sound";
import {
  selectFocusSettings,
  selectLastEndedFocusSegment,
  selectNextFocusSession,
} from "../features/focus/focusSelector";
import { clearLastEndedSegment } from "../features/focus/focusSlice";

const shouldDropOn4xx = (status) => status >= 400 && status < 500 && status !== 429;

export const useFocusAutoSave = () => {
  const dispatch = useDispatch();
  const settings = useSelector(selectFocusSettings);
  const lastEnded = useSelector(selectLastEndedFocusSegment);
  const nextSession = useSelector(selectNextFocusSession);

  const flushingRef = useRef(false);
  const lastOfflineToastAtRef = useRef(0);

  const maybeToastOffline = (msg) => {
    const now = Date.now();
    if (now - lastOfflineToastAtRef.current < 15000) return;
    lastOfflineToastAtRef.current = now;
    toast.info(msg);
  };

  const flushQueue = async () => {
    if (flushingRef.current) return false;
    if (typeof navigator !== "undefined" && navigator.onLine === false) return false;

    flushingRef.current = true;
    try {
      let queue = loadFocusSaveQueue();
      if (queue.length === 0) return true;

      for (const item of queue) {
        try {
          await axiosInstance.post("/focus/timers", item.payload);
          queue = queue.filter((q) => q.clientId !== item.clientId);
          saveFocusSaveQueue(queue);
        } catch (err) {
          const status = err?.response?.status;

          if (typeof status === "number" && shouldDropOn4xx(status)) {
            queue = queue.filter((q) => q.clientId !== item.clientId);
            saveFocusSaveQueue(queue);
            continue;
          }

          return false;
        }
      }

      return true;
    } finally {
      flushingRef.current = false;
    }
  };

  useEffect(() => {
    flushQueue().catch(() => {});

    const onOnline = () => {
      flushQueue().catch(() => {});
    };

    window.addEventListener("online", onOnline);
    return () => window.removeEventListener("online", onOnline);
  }, []);

  useEffect(() => {
    if (!lastEnded) return;

    // Notifications + sound
    const mode = lastEnded.mode;
    const status = lastEnded.status;
    const nextMode = lastEnded.nextMode || nextSession?.mode || null;

    if (settings?.soundEnabled) {
      const freq =
        status === "cancelled"
          ? 220
          : mode === "focus"
            ? 880
            : 660;
      playBeep({ frequency: freq });
    }

    if (settings?.notificationsEnabled && typeof Notification !== "undefined") {
      try {
        const canNotify = Notification.permission === "granted";
        if (canNotify) {
          const title =
            status === "cancelled"
              ? "Session cancelled"
              : mode === "focus"
                ? "Focus complete"
                : "Break complete";

          const body =
            status === "cancelled"
              ? "Your session was saved as cancelled."
              : nextMode === "shortBreak"
                ? "Up next: Short break"
                : nextMode === "longBreak"
                  ? "Up next: Long break"
                  : "Up next: Focus";

          new Notification(title, { body });
        }
      } catch {
        // ignore
      }
    }

    // Save only focus segments
    if (mode === "focus") {
      const payload = {
        title: lastEnded.title,
        durationSeconds: lastEnded.durationSeconds,
        goalTag: lastEnded.goalTag || undefined,
        mode: lastEnded.mode,
        status: lastEnded.status,
        startedAt: new Date(lastEnded.startedAt).toISOString(),
        endedAt: new Date(lastEnded.endedAt).toISOString(),
      };

      enqueueFocusSave(payload);

      flushQueue()
        .then((ok) => {
          if (!ok) {
            maybeToastOffline("Saved offline. Will retry when online.");
          }
        })
        .catch(() => {
          maybeToastOffline("Saved offline. Will retry when online.");
        });
    }

    dispatch(clearLastEndedSegment());
  }, [dispatch, lastEnded, nextSession?.mode, settings?.notificationsEnabled, settings?.soundEnabled]);
};
