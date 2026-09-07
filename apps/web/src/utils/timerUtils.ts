export const calculateRemainingTime = (session) => {
  if (!session) return 0;

  const now = Date.now();
  const elapsed = Math.floor((now - session.startedAt) / 1000);
  const remaining = session.duration - elapsed;

  return remaining > 0 ? remaining : 0;
};

export const formatTime = (seconds) => {
  const abs = Math.abs(seconds);
  const hrs = Math.floor(abs / 3600);
  const mins = Math.floor((abs % 3600) / 60);
  const secs = abs % 60;

  return hrs > 0
    ? `${String(hrs).padStart(2, "0")}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    : `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
};
