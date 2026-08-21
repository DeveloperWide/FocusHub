import { NextFunction, Request, Response } from "express";
import Task from "../models/Task";
import { wrapAsync } from "../utils/asyncWrapper";
import ExpressError from "../utils/ExpressError";
import Goal from "../models/Goal";
import User from "../models/User";
import {
  getEffectivePlanId,
  getEntitlements,
  getPlan,
} from "../utils/billingPlans";
import { Types } from "mongoose";

type Priority = "high" | "medium" | "low";
interface UpdatePayload {
  title: string;
  priority: Priority;
  type: string;
  tag: string;
  goal: Types.ObjectId | null;
  isComplete?: boolean;
  completedAt?: Date | null;
}

const parseTzOffsetMinutes = (req: Request) => {
  const raw =
    req.query?.tzOffset ??
    req.headers["x-tz-offset"] ??
    req.headers["x-timezone-offset"];

  if (raw === undefined || raw === null || raw === "") return 0;

  const minutes = Number(raw);
  if (!Number.isFinite(minutes)) return 0;

  if (minutes < -14 * 60 || minutes > 14 * 60) return 0;

  return Math.trunc(minutes);
};

const computeLocalDayKey = (date: Date, tzOffsetMinutes: number) => {
  const shifted = new Date(date.getTime() - tzOffsetMinutes * 60 * 1000);
  return shifted.toISOString().slice(0, 10);
};

const getDayRangeUtc = (dayKey: unknown, tzOffsetMinutes: number) => {
  const [y, m, d] = String(dayKey)
    .split("-")
    .map((n) => Number(n));
  if (!y || !m || !d) return null;

  const startShiftedUtc = Date.UTC(y, m - 1, d);
  const startUtc = new Date(startShiftedUtc + tzOffsetMinutes * 60 * 1000);
  const endUtc = new Date(startUtc.getTime() + 86400000);

  return { startUtc, endUtc };
};

export const getTasks = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tzOffsetMinutes = parseTzOffsetMinutes(req);

    const requestedDayKey = String(req.query?.dayKey || "").trim();
    const dayKey = /^\d{4}-\d{2}-\d{2}$/.test(requestedDayKey)
      ? requestedDayKey
      : computeLocalDayKey(new Date(), tzOffsetMinutes);

    const range = getDayRangeUtc(dayKey, tzOffsetMinutes);

    const query = {
      user: req.user?.id,
      ...(range
        ? {
            $or: [
              { dayKey },
              {
                dayKey: { $exists: false },
                createdAt: { $gte: range.startUtc, $lt: range.endUtc },
              },
              {
                dayKey: null,
                createdAt: { $gte: range.startUtc, $lt: range.endUtc },
              },
            ],
          }
        : { dayKey }),
    };

    const allTasks = await Task.find(query).sort({
      isComplete: 1,
      priority: 1,
      createdAt: 1,
    });

    if (!allTasks) throw new ExpressError(404, "No tasks found");

    return res.json({
      success: true,
      message: "All Tasks Retrieved...!",
      data: allTasks,
      meta: {
        dayKey,
      },
    });
  },
);

export const createTask = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { title, priority, type, tag, dayKey: dayKeyRaw } = req.body;

    if (!title || !priority || !type || !tag) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const tzOffsetMinutes = parseTzOffsetMinutes(req);

    const dayKey = /^\d{4}-\d{2}-\d{2}$/.test(String(dayKeyRaw || "").trim())
      ? String(dayKeyRaw).trim()
      : computeLocalDayKey(new Date(), tzOffsetMinutes);

    const trimmedTitle = String(title).trim();
    const trimmedTag = String(tag).trim();
    const trimmedType = String(type).trim();
    const trimmedPriority: Priority = String(priority).trim() as Priority;

    if (!trimmedTitle || !trimmedTag || !trimmedType || !trimmedPriority) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (!["high", "medium", "low"].includes(trimmedPriority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority",
      });
    }

    const user = await User.findById(req.user?.id);
    if (!user) throw new ExpressError(404, "User Not Found");

    const planId = getEffectivePlanId(user);
    const entitlements = getEntitlements(planId);
    const perPriorityLimit = entitlements?.tasks?.[trimmedPriority];

    if (Number.isFinite(perPriorityLimit)) {
      const range = getDayRangeUtc(dayKey, tzOffsetMinutes);
      const countQuery = {
        user: req.user?.id,
        priority: trimmedPriority,
        ...(range
          ? {
              $or: [
                { dayKey },
                {
                  dayKey: { $exists: false },
                  createdAt: { $gte: range.startUtc, $lt: range.endUtc },
                },
                {
                  dayKey: null,
                  createdAt: { $gte: range.startUtc, $lt: range.endUtc },
                },
              ],
            }
          : { dayKey }),
      };

      const existingCount = await Task.countDocuments(countQuery);
      if (existingCount >= perPriorityLimit) {
        const plan = getPlan(planId);
        const planName = plan?.name || "your plan";
        throw new ExpressError(
          403,
          `You reached the ${trimmedPriority} task limit for ${planName}. Upgrade to add more.`,
        );
      }
    }

    let goal = null;
    if (trimmedType !== "task") {
      const goalDoc = await Goal.findOne({
        tag: trimmedType,
        user: req.user?.id,
      });
      if (!goalDoc) {
        return res.status(400).json({
          success: false,
          message: "Invalid task type",
        });
      }
      goal = goalDoc._id;
    }

    const newTask = new Task({
      title: trimmedTitle,
      priority: trimmedPriority,
      type: trimmedType,
      goal,
      tag: trimmedTag,
      dayKey,
      user: req.user?.id,
    });

    let svdTask = await newTask.save();

    return res.json({
      success: true,
      message: "Task Created Successfully",
      data: svdTask,
    });
  },
);

export const showTask = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const task = await Task.findOne({ _id: req.params.id, user: req.user?.id });
    if (!task) throw new ExpressError(404, "Task not found");

    return res.json({
      success: true,
      message: "Your Task",
      data: task,
    });
  },
);

export const updateTask = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { title, priority, type, tag, isComplete } = req.body;

    const task = await Task.findOne({ _id: id, user: req.user?.id });
    if (!task) throw new ExpressError(404, "Task not found");

    const nextType = typeof type === "string" ? type.trim() : task.type;
    const nextPriority =
      typeof priority === "string" ? priority.trim() : task.priority;

    if (nextPriority && !["high", "medium", "low"].includes(nextPriority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority",
      });
    }

    let goal = null;

    if (nextType !== "task") {
      const goalDoc = await Goal.findOne({ tag: nextType, user: req.user?.id });
      if (!goalDoc) {
        return res.status(400).json({
          success: false,
          message: "Invalid task type",
        });
      }
      goal = goalDoc._id;
    }

    const updatePayload: UpdatePayload = {
      title: typeof title === "string" ? title.trim() : "",
      priority: nextPriority as Priority,
      type: nextType,
      goal,
      tag: typeof tag === "string" ? tag.trim() : "",
    };

    if (typeof isComplete === "boolean") {
      updatePayload.isComplete = isComplete;
      updatePayload.completedAt = isComplete ? new Date() : null;
    }

    let updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.user?.id },
      updatePayload,
      { new: true },
    );

    return res.json({
      success: true,
      message: "Task Updated Successfully",
      data: updatedTask,
    });
  },
);

export const toggleTaskComplete = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { isComplete } = req.body;

    const task = await Task.findOne({ _id: id, user: req.user?.id });
    if (!task) throw new ExpressError(404, "Task not found");

    const nextComplete =
      typeof isComplete === "boolean" ? isComplete : !task.isComplete;

    task.isComplete = nextComplete;
    task.completedAt = nextComplete ? new Date() : null;

    const savedTask = await task.save();

    return res.status(200).json({
      success: true,
      message: "Task completion updated",
      data: savedTask,
    });
  },
);

export const deleteTask = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const deletedTask = await Task.findOneAndDelete({
      _id: id,
      user: req.user?.id,
    });

    if (!deletedTask) throw new ExpressError(404, "Task not found");

    return res.status(200).json({
      success: true,
      message: "Task Deleted Successfully",
    });
  },
);
