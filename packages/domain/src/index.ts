import type { DayKey, Task, TaskPriority } from "@focushub/contracts";

const MILLISECONDS_PER_DAY = 86_400_000;
export const MAX_TIMEZONE_OFFSET_MINUTES = 14 * 60;

const priorityRanks: Record<TaskPriority, number> = {
  high: 1,
  medium: 2,
  low: 3,
};

/** Returns the display/order rank used by the existing Tasks page. */
export const getTaskPriorityRank = (priority: TaskPriority): number =>
  priorityRanks[priority];

/** Returns a new, stable priority-ordered task list without mutating its input. */
export const sortTasksByPriority = <T extends Pick<Task, "priority">>(
  tasks: readonly T[],
): T[] =>
  tasks
    .map((task, index) => ({ task, index }))
    .sort(
      (a, b) =>
        getTaskPriorityRank(a.task.priority) -
          getTaskPriorityRank(b.task.priority) || a.index - b.index,
    )
    .map(({ task }) => task);

/**
 * Normalizes a JavaScript Date#getTimezoneOffset()-style value exactly as the
 * task and focus controllers do: invalid or out-of-range offsets become zero.
 */
export const normalizeTimezoneOffsetMinutes = (value: unknown): number => {
  if (value === undefined || value === null || value === "") return 0;

  const minutes = Number(value);
  if (!Number.isFinite(minutes)) return 0;
  if (
    minutes < -MAX_TIMEZONE_OFFSET_MINUTES ||
    minutes > MAX_TIMEZONE_OFFSET_MINUTES
  ) {
    return 0;
  }

  return Math.trunc(minutes);
};

/** Computes the YYYY-MM-DD key for a UTC date in the supplied local offset. */
export const getLocalDayKey = (
  date: Date,
  timezoneOffsetMinutes: number,
): DayKey => {
  const offset = normalizeTimezoneOffsetMinutes(timezoneOffsetMinutes);
  const shifted = new Date(date.getTime() - offset * 60 * 1000);
  return shifted.toISOString().slice(0, 10);
};

/** Mirrors the task controller's UTC range for a local YYYY-MM-DD key. */
export const getDayRangeUtc = (
  dayKey: DayKey,
  timezoneOffsetMinutes: number,
): { startUtc: Date; endUtc: Date } | null => {
  const [year, month, day] = String(dayKey)
    .split("-")
    .map((part) => Number(part));

  if (!year || !month || !day) return null;

  const offset = normalizeTimezoneOffsetMinutes(timezoneOffsetMinutes);
  const startShiftedUtc = Date.UTC(year, month - 1, day);
  const startUtc = new Date(startShiftedUtc + offset * 60 * 1000);
  const endUtc = new Date(startUtc.getTime() + MILLISECONDS_PER_DAY);

  return { startUtc, endUtc };
};

/** Mirrors the focus statistics controller's start-of-local-day calculation. */
export const getStartOfLocalDayUtc = (
  date: Date,
  timezoneOffsetMinutes: number,
): Date => {
  const offset = normalizeTimezoneOffsetMinutes(timezoneOffsetMinutes);
  const shifted = new Date(date.getTime() - offset * 60 * 1000);
  const startShiftedUtc = Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate(),
  );

  return new Date(startShiftedUtc + offset * 60 * 1000);
};

/** Calculates remaining whole seconds from an absolute start timestamp. */
export const getRemainingFocusSeconds = (
  startedAtMs: number,
  durationSeconds: number,
  nowMs: number,
): number => {
  const elapsedSeconds = Math.floor((nowMs - startedAtMs) / 1000);
  return Math.max(0, durationSeconds - elapsedSeconds);
};
