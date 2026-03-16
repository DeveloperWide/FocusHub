const Task = require("../models/Task");
const wrapAsync = require("../utils/asyncWrapper");
const ExpressError = require("../utils/ExpressError");
const Goal = require("../models/Goal");

const parseTzOffsetMinutes = (req) => {
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

const computeLocalDayKey = (date, tzOffsetMinutes) => {
  const shifted = new Date(date.getTime() - tzOffsetMinutes * 60 * 1000);
  return shifted.toISOString().slice(0, 10);
};

const getDayRangeUtc = (dayKey, tzOffsetMinutes) => {
  const [y, m, d] = String(dayKey).split("-").map((n) => Number(n));
  if (!y || !m || !d) return null;

  const startShiftedUtc = Date.UTC(y, m - 1, d);
  const startUtc = new Date(startShiftedUtc + tzOffsetMinutes * 60 * 1000);
  const endUtc = new Date(startUtc.getTime() + 86400000);

  return { startUtc, endUtc };
};

module.exports.getTasks = wrapAsync(async (req, res, next) => {
  const tzOffsetMinutes = parseTzOffsetMinutes(req);

  const requestedDayKey = String(req.query?.dayKey || "").trim();
  const dayKey =
    /^\d{4}-\d{2}-\d{2}$/.test(requestedDayKey)
      ? requestedDayKey
      : computeLocalDayKey(new Date(), tzOffsetMinutes);

  const range = getDayRangeUtc(dayKey, tzOffsetMinutes);

  const query = {
    user: req.user.id,
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

  res.json({
    success: true,
    message: "All Tasks Retrieved...!",
    data: allTasks,
    meta: {
      dayKey,
    },
  });
});

module.exports.createTask = wrapAsync(async (req, res, next) => {
  const { title, priority, type, tag, dayKey: dayKeyRaw } = req.body;

  if (!title || !priority || !type || !tag) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  const tzOffsetMinutes = parseTzOffsetMinutes(req);

  const dayKey =
    /^\d{4}-\d{2}-\d{2}$/.test(String(dayKeyRaw || "").trim())
      ? String(dayKeyRaw).trim()
      : computeLocalDayKey(new Date(), tzOffsetMinutes);

  const trimmedTitle = String(title).trim();
  const trimmedTag = String(tag).trim();
  const trimmedType = String(type).trim();
  const trimmedPriority = String(priority).trim();

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

  let goal = null;
  if (trimmedType !== "task") {
    const goalDoc = await Goal.findOne({ tag: trimmedType, user: req.user.id });
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
    user: req.user.id,
  });

  let svdTask;
  try {
    svdTask = await newTask.save();
  } catch (err) {
    if (err?.code === 11000) {
      throw new ExpressError(409, "Tag already used for this day");
    }
    throw err;
  }

  res.json({
    success: true,
    message: "Task Created Successfully",
    data: svdTask,
  });
});

module.exports.showTask = wrapAsync(async (req, res, next) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
  if (!task) throw new ExpressError(404, "Task not found");

  res.json({
    success: true,
    message: "Your Task",
    data: task,
  });
});

module.exports.updateTask = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { title, priority, type, tag, isComplete } = req.body;

  const task = await Task.findOne({ _id: id, user: req.user.id });
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
    const goalDoc = await Goal.findOne({ tag: nextType, user: req.user.id });
    if (!goalDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid task type",
      });
    }
    goal = goalDoc._id;
  }

  const updatePayload = {
    title: typeof title === "string" ? title.trim() : undefined,
    priority: nextPriority,
    type: nextType,
    goal,
    tag: typeof tag === "string" ? tag.trim() : undefined,
  };

  if (typeof isComplete === "boolean") {
    updatePayload.isComplete = isComplete;
    updatePayload.completedAt = isComplete ? new Date() : null;
  }

  let updatedTask;
  try {
    updatedTask = await Task.findOneAndUpdate(
      { _id: id, user: req.user.id },
      updatePayload,
      { new: true },
    );
  } catch (err) {
    if (err?.code === 11000) {
      throw new ExpressError(409, "Tag already used for this day");
    }
    throw err;
  }

  res.json({
    success: true,
    message: "Task Updated Successfully",
    data: updatedTask,
  });
});

module.exports.toggleTaskComplete = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { isComplete } = req.body;

  const task = await Task.findOne({ _id: id, user: req.user.id });
  if (!task) throw new ExpressError(404, "Task not found");

  const nextComplete =
    typeof isComplete === "boolean" ? isComplete : !task.isComplete;

  task.isComplete = nextComplete;
  task.completedAt = nextComplete ? new Date() : null;

  const savedTask = await task.save();

  res.status(200).json({
    success: true,
    message: "Task completion updated",
    data: savedTask,
  });
});

module.exports.deleteTask = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedTask = await Task.findOneAndDelete({
    _id: id,
    user: req.user.id,
  });

  if (!deletedTask) throw new ExpressError(404, "Task not found");

  res.status(200).json({
    success: true,
    message: "Task Deleted Successfully",
  });
});
