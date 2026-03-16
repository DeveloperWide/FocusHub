const FocusTimer = require("../models/FocusTimer");
const Goal = require("../models/Goal");
const wrapAsync = require("../utils/asyncWrapper");
const ExpressError = require("../utils/ExpressError");
const mongoose = require("mongoose");

const parseTzOffsetMinutes = (req) => {
  const raw =
    req.query?.tzOffset ??
    req.headers["x-tz-offset"] ??
    req.headers["x-timezone-offset"];

  if (raw === undefined || raw === null || raw === "") return 0;

  const minutes = Number(raw);
  if (!Number.isFinite(minutes)) return 0;

  // Real-world offsets range from UTC-12:00 to UTC+14:00
  if (minutes < -14 * 60 || minutes > 14 * 60) return 0;

  // We expect getTimezoneOffset()-style minutes (can be negative)
  return Math.trunc(minutes);
};

const minutesToTzString = (localOffsetMinutes) => {
  const sign = localOffsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(localOffsetMinutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, "0");
  const mm = String(abs % 60).padStart(2, "0");
  return `${sign}${hh}:${mm}`;
};

const getStartOfLocalDayUtc = (date, tzOffsetMinutes) => {
  // tzOffsetMinutes follows JS getTimezoneOffset() semantics: UTC - local.
  const shifted = new Date(date.getTime() - tzOffsetMinutes * 60 * 1000);

  const startShiftedUtc = Date.UTC(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth(),
    shifted.getUTCDate(),
  );

  return new Date(startShiftedUtc + tzOffsetMinutes * 60 * 1000);
};

module.exports.getFocusTimers = wrapAsync(async (req, res) => {
  const query = { user: req.user.id };

  if (req.query?.linkType) {
    const linkType = String(req.query.linkType).trim();
    if (["goal", "personal"].includes(linkType)) query.linkType = linkType;
  }

  if (req.query?.mode) {
    const mode = String(req.query.mode).trim();
    if (["focus", "shortBreak", "longBreak"].includes(mode)) query.mode = mode;
  }

  if (req.query?.status) {
    const status = String(req.query.status).trim();
    if (["completed", "cancelled"].includes(status)) query.status = status;
  }

  if (req.query?.goalTag) {
    const goalTag = String(req.query.goalTag).trim();
    if (goalTag) query.goalTag = goalTag;
  }

  if (req.query?.from || req.query?.to) {
    const from = req.query?.from ? new Date(String(req.query.from)) : null;
    const to = req.query?.to ? new Date(String(req.query.to)) : null;

    const range = {};
    if (from && !Number.isNaN(from.getTime())) range.$gte = from;
    if (to && !Number.isNaN(to.getTime())) range.$lte = to;

    if (Object.keys(range).length > 0) query.endedAt = range;
  }

  const limitRaw = req.query?.limit;
  const limit = Math.max(
    1,
    Math.min(200, Number.isFinite(Number(limitRaw)) ? Number(limitRaw) : 100),
  );

  const focusTimers = await FocusTimer.find(query)
    .sort({ endedAt: -1, createdAt: -1 })
    .limit(limit)
    .populate("goal", "title tag");

  res.json({
    success: true,
    message: "Focus timers retrieved",
    data: focusTimers,
  });
});

module.exports.createFocusTimer = wrapAsync(async (req, res) => {
  const { title, durationSeconds, goalTag, mode, status, startedAt, endedAt } =
    req.body;

  const trimmedTitle = String(title || "").trim();
  if (!trimmedTitle) throw new ExpressError(400, "Title is required");

  const seconds = Number(durationSeconds);
  if (!Number.isFinite(seconds) || seconds < 1) {
    throw new ExpressError(400, "durationSeconds must be a positive number");
  }

  const trimmedGoalTag = String(goalTag || "").trim();

  const hasGoal = Boolean(trimmedGoalTag);

  let goal = null;
  let goalTagSnapshot = null;

  if (hasGoal) {
    const goalDoc = await Goal.findOne({
      tag: trimmedGoalTag,
      user: req.user.id,
    });
    if (!goalDoc) throw new ExpressError(404, "Goal not found");

    goal = goalDoc._id;
    goalTagSnapshot = goalDoc.tag;
  }

  const nextMode = String(mode || "focus").trim();
  if (mode && !["focus", "shortBreak", "longBreak"].includes(nextMode)) {
    throw new ExpressError(400, "Invalid mode");
  }

  const nextStatus = String(status || "completed").trim();
  if (status && !["completed", "cancelled"].includes(nextStatus)) {
    throw new ExpressError(400, "Invalid status");
  }

  const startedAtDate = startedAt ? new Date(String(startedAt)) : null;
  if (startedAt && Number.isNaN(startedAtDate.getTime())) {
    throw new ExpressError(400, "Invalid startedAt");
  }

  const endedAtDate = endedAt ? new Date(String(endedAt)) : null;
  if (endedAt && Number.isNaN(endedAtDate.getTime())) {
    throw new ExpressError(400, "Invalid endedAt");
  }

  const newFocusTimer = new FocusTimer({
    title: trimmedTitle,
    durationSeconds: Math.floor(seconds),
    goal,
    goalTag: goalTagSnapshot,
    mode: nextMode,
    status: nextStatus,
    startedAt: startedAt ? startedAtDate : null,
    endedAt: endedAt ? endedAtDate : undefined,
    user: req.user.id,
  });

  const svdFocusTimer = await newFocusTimer.save();

  const populatedTimer = await FocusTimer.findById(svdFocusTimer._id)
    .populate("goal", "title tag");

  res.status(201).json({
    success: true,
    message: "Focus timer saved",
    data: populatedTimer || svdFocusTimer,
  });
});

module.exports.updateFocusTimer = wrapAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ExpressError(400, "Invalid timer id");
  }

  const timer = await FocusTimer.findOne({ _id: id, user: req.user.id });
  if (!timer) throw new ExpressError(404, "Timer not found");

  if (typeof req.body?.title === "string") {
    const t = req.body.title.trim();
    if (!t) throw new ExpressError(400, "Title cannot be empty");
    timer.title = t;
  }

  if (req.body?.durationSeconds !== undefined) {
    const seconds = Number(req.body.durationSeconds);
    if (!Number.isFinite(seconds) || seconds < 1) {
      throw new ExpressError(400, "durationSeconds must be a positive number");
    }
    timer.durationSeconds = Math.floor(seconds);
  }

  if (req.body?.mode !== undefined) {
    const m = String(req.body.mode || "").trim();
    if (!["focus", "shortBreak", "longBreak"].includes(m)) {
      throw new ExpressError(400, "Invalid mode");
    }
    timer.mode = m;
  }

  if (req.body?.status !== undefined) {
    const s = String(req.body.status || "").trim();
    if (!["completed", "cancelled"].includes(s)) {
      throw new ExpressError(400, "Invalid status");
    }
    timer.status = s;
  }

  if (req.body?.startedAt !== undefined) {
    const d = req.body.startedAt ? new Date(String(req.body.startedAt)) : null;
    if (req.body.startedAt && Number.isNaN(d.getTime())) {
      throw new ExpressError(400, "Invalid startedAt");
    }
    timer.startedAt = d;
  }

  if (req.body?.endedAt !== undefined) {
    const d = req.body.endedAt ? new Date(String(req.body.endedAt)) : null;
    if (!d || Number.isNaN(d.getTime())) {
      throw new ExpressError(400, "Invalid endedAt");
    }
    timer.endedAt = d;
  }

  if (req.body?.goalTag !== undefined) {
    const trimmedGoalTag = String(req.body.goalTag || "").trim();

    if (!trimmedGoalTag) {
      timer.goal = null;
      timer.goalTag = null;
    } else {
      const goalDoc = await Goal.findOne({
        tag: trimmedGoalTag,
        user: req.user.id,
      });
      if (!goalDoc) throw new ExpressError(404, "Goal not found");

      timer.goal = goalDoc._id;
      timer.goalTag = goalDoc.tag;
    }
  }

  await timer.save();

  const updatedTimer = await FocusTimer.findById(timer._id).populate(
    "goal",
    "title tag",
  );

  if (!updatedTimer) throw new ExpressError(404, "Timer not found");

  res.status(200).json({
    success: true,
    message: "Focus timer updated",
    data: updatedTimer,
  });
});

module.exports.deleteFocusTimer = wrapAsync(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ExpressError(400, "Invalid timer id");
  }

  const deleted = await FocusTimer.findOneAndDelete({
    _id: id,
    user: req.user.id,
  });

  if (!deleted) throw new ExpressError(404, "Timer not found");

  res.status(200).json({
    success: true,
    message: "Focus timer deleted",
  });
});

module.exports.getLast7DaysStats = wrapAsync(async (req, res) => {
  const tzOffsetMinutes = parseTzOffsetMinutes(req);
  const localOffsetMinutes = -tzOffsetMinutes;
  const tzString = minutesToTzString(localOffsetMinutes);

  const now = new Date();
  const startOfTodayUtc = getStartOfLocalDayUtc(now, tzOffsetMinutes);
  const startOfRangeUtc = new Date(startOfTodayUtc.getTime() - 6 * 86400000);
  const endUtc = new Date(startOfTodayUtc.getTime() + 86400000);

  const userId = new mongoose.Types.ObjectId(req.user.id);

  const agg = await FocusTimer.aggregate([
    {
      $match: {
        user: userId,
        mode: "focus",
        status: "completed",
        endedAt: { $gte: startOfRangeUtc, $lt: endUtc },
      },
    },
    {
      $group: {
        _id: {
          $dateToString: {
            format: "%Y-%m-%d",
            date: "$endedAt",
            timezone: tzString,
          },
        },
        seconds: { $sum: "$durationSeconds" },
        sessions: { $sum: 1 },
      },
    },
    { $project: { _id: 0, date: "$_id", seconds: 1, sessions: 1 } },
  ]);

  const map = new Map();
  for (const row of agg) map.set(row.date, row);

  const startLocalShifted = new Date(
    startOfRangeUtc.getTime() - tzOffsetMinutes * 60 * 1000,
  );

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startLocalShifted.getTime() + i * 86400000);
    const dateKey = d.toISOString().slice(0, 10);

    const row = map.get(dateKey);
    return {
      date: dateKey,
      seconds: row?.seconds || 0,
      sessions: row?.sessions || 0,
    };
  });

  const totalSeconds = days.reduce((acc, d) => acc + d.seconds, 0);

  res.status(200).json({
    success: true,
    message: "Last 7 days focus stats",
    data: {
      tzOffsetMinutes,
      days,
      totalSeconds,
    },
  });
});

module.exports.getByGoalStats = wrapAsync(async (req, res) => {
  const tzOffsetMinutes = parseTzOffsetMinutes(req);

  const now = new Date();
  const startOfTodayUtc = getStartOfLocalDayUtc(now, tzOffsetMinutes);
  const startOfRangeUtc = new Date(startOfTodayUtc.getTime() - 6 * 86400000);
  const endUtc = new Date(startOfTodayUtc.getTime() + 86400000);

  const userId = new mongoose.Types.ObjectId(req.user.id);

  const rows = await FocusTimer.aggregate([
    {
      $match: {
        user: userId,
        mode: "focus",
        status: "completed",
        endedAt: { $gte: startOfRangeUtc, $lt: endUtc },
      },
    },
    {
      $group: {
        _id: {
          linkType: "$linkType",
          goal: "$goal",
          goalTag: "$goalTag",
        },
        seconds: { $sum: "$durationSeconds" },
        sessions: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: "goals",
        localField: "_id.goal",
        foreignField: "_id",
        as: "goalDoc",
      },
    },
    {
      $addFields: {
        resolvedGoalTag: {
          $ifNull: ["$_id.goalTag", { $arrayElemAt: ["$goalDoc.tag", 0] }],
        },
      },
    },
    {
      $project: {
        _id: 0,
        linkType: "$_id.linkType",
        goalId: "$_id.goal",
        goalTag: "$resolvedGoalTag",
        seconds: 1,
        sessions: 1,
      },
    },
    { $sort: { seconds: -1 } },
  ]);

  const buckets = rows.map((r) => {
    const isPersonal = r.linkType === "personal";

    const label = isPersonal
      ? "Personal"
      : r.goalTag
        ? `#${r.goalTag}`
        : "Goal";

    return {
      linkType: r.linkType,
      goalId: r.goalId || null,
      goalTag: r.goalTag || null,
      label,
      seconds: r.seconds,
      sessions: r.sessions,
    };
  });

  const totalSeconds = buckets.reduce((acc, b) => acc + b.seconds, 0);

  res.status(200).json({
    success: true,
    message: "Focus stats by goal",
    data: {
      tzOffsetMinutes,
      buckets,
      totalSeconds,
    },
  });
});
