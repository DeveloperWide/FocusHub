export type TimerLinkType = "goal" | "personal";
export type TimerMode = "focus" | "shortBreak" | "longBreak";
export type TimerStatus = "completed" | "cancelled";
export type DateRange = {
  $gte?: Date;
  $lte?: Date;
};

export interface GetFocusTimerQuery {
  user?: string;
  linkType?: "goal" | "personal";
  mode?: "focus" | "shortBreak" | "longBreak";
  status?: "completed" | "cancelled";
  goalTag?: string;
  endedAt?: DateRange;
}
