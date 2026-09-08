/** Client-facing contracts derived from the existing FocusHub API responses. */

export type Identifier = string;
export type IsoDateString = string;
export type DayKey = string;

export type TaskPriority = "high" | "medium" | "low";

/** "task" identifies a daily task; any other value is the owning goal's tag. */
export type TaskType = string;

export type FocusTimerMode = "focus" | "shortBreak" | "longBreak";
export type FocusTimerStatus = "completed" | "cancelled";
export type FocusTimerLinkType = "goal" | "personal";

export type SubscriptionPlanId = "free" | "basic" | "pro" | "elite";
export type SubscriptionInterval = "monthly" | "yearly";
export type SubscriptionStatus = "free" | "active" | "expired" | "cancelled";

export interface SubscriptionSummary {
  planId: SubscriptionPlanId;
  interval: SubscriptionInterval | null;
  status: SubscriptionStatus;
  currentPeriodStart: IsoDateString | null;
  currentPeriodEnd: IsoDateString | null;
  cancelAtPeriodEnd: boolean;
  subscriptionId: string | null;
}

export interface ProfileImage {
  url: string;
  filename: string;
}

/** The serialized User model deliberately excludes password and Mongoose fields. */
export interface User {
  id: Identifier;
  name: string;
  email: string;
  username: string;
  profileImage: ProfileImage;
  subscription: SubscriptionSummary;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload extends LoginPayload {
  name: string;
  username: string;
}

export interface AuthenticatedUserResponse {
  message: string;
  user: User;
  token: string;
}

export interface CurrentUserResponse {
  user: User;
}

export interface UsernameAvailabilityResponse {
  available: boolean;
}

export interface UsernameSuggestionsResponse {
  suggestions: string[];
}

export interface Task {
  id: Identifier;
  type: TaskType;
  title: string;
  priority: TaskPriority;
  tag: string;
  dayKey: DayKey;
  goal: Identifier | null;
  isComplete: boolean;
  completedAt: IsoDateString | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface CreateTaskPayload {
  title: string;
  priority: TaskPriority;
  type: TaskType;
  tag: string;
  dayKey?: DayKey;
}

/** The current PUT controller expects the core task fields together. */
export interface UpdateTaskPayload {
  title: string;
  priority: TaskPriority;
  type: TaskType;
  tag: string;
  isComplete?: boolean;
}

/** Omitting isComplete preserves the API's toggle behavior. */
export interface SetTaskCompletionPayload {
  isComplete?: boolean;
}

export interface TaskListMeta {
  dayKey: DayKey;
}

export interface Goal {
  id: Identifier;
  title: string;
  tag: string;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface GoalPayload {
  title: string;
  tag: string;
}

export interface FocusTimerGoal {
  id: Identifier;
  title: string;
  tag: string;
}

export interface FocusTimer {
  id: Identifier;
  title: string;
  durationSeconds: number;
  mode: FocusTimerMode;
  status: FocusTimerStatus;
  startedAt: IsoDateString | null;
  endedAt: IsoDateString;
  linkType: FocusTimerLinkType;
  goal: FocusTimerGoal | Identifier | null;
  goalTag: string | null;
  createdAt: IsoDateString;
  updatedAt: IsoDateString;
}

export interface CreateFocusTimerPayload {
  title: string;
  durationSeconds: number;
  goalTag?: string;
  mode?: FocusTimerMode;
  status?: FocusTimerStatus;
  startedAt: IsoDateString;
  endedAt: IsoDateString;
}

export interface UpdateFocusTimerPayload {
  title?: string;
  durationSeconds?: number;
  goalTag?: string | null;
  mode?: FocusTimerMode;
  status?: FocusTimerStatus;
  startedAt?: IsoDateString | null;
  endedAt?: IsoDateString;
}

export interface FocusTimerFilters {
  linkType?: FocusTimerLinkType;
  mode?: FocusTimerMode;
  status?: FocusTimerStatus;
  goalTag?: string;
  from?: IsoDateString;
  to?: IsoDateString;
  limit?: number;
}

export interface FocusDayStatistic {
  date: DayKey;
  seconds: number;
  sessions: number;
}

export interface Last7DaysFocusStatistics {
  tzOffsetMinutes: number;
  days: FocusDayStatistic[];
  totalSeconds: number;
}

export interface FocusGoalStatistic {
  linkType: FocusTimerLinkType;
  goalId: Identifier | null;
  goalTag: string | null;
  label: string;
  seconds: number;
  sessions: number;
}

export interface FocusByGoalStatistics {
  tzOffsetMinutes: number;
  buckets: FocusGoalStatistic[];
  totalSeconds: number;
}

/** Used by the task, goal, and focus endpoints that return data in `data`. */
export interface ApiDataResponse<T> {
  success: true;
  message: string;
  data: T;
}

/** Shared shape emitted by the server error handler. */
export interface ApiErrorResponse {
  success: false;
  message: string;
}

export interface ApiSuccessResponse {
  success: true;
  message: string;
}
