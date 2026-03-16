const Goal = require("../models/Goal");
const Task = require("../models/Task");
const User = require("../models/User");
const wrapAsync = require("../utils/asyncWrapper");
const ExpressError = require("../utils/ExpressError");
const { getEffectivePlanId, getEntitlements, getPlan } = require("../utils/billingPlans");

module.exports.getGoals = wrapAsync(async (req, res, next) => {
  let allGoals = await Goal.find({ user: req.user.id });

  res.status(200).json({
    success: true,
    message: "All Your Goals Here",
    data: allGoals,
  });
});

module.exports.createGoal = wrapAsync(async (req, res, next) => {
  const { title, tag } = req.body;

  const user = await User.findById(req.user.id);
  if (!user) throw new ExpressError(404, "User Not Found");

  const planId = getEffectivePlanId(user);
  const entitlements = getEntitlements(planId);
  const goalsLimit = entitlements?.goals;

  const goals = await Goal.find({ user: req.user.id });

  if (Number.isFinite(goalsLimit) && goals.length >= goalsLimit) {
    const plan = getPlan(planId);
    const planName = plan?.name || "your plan";
    throw new ExpressError(
      406,
      `Goal limit reached for ${planName}. Upgrade to add more goals.`,
    );
  }

  if (!title || !tag) {
    return res.status(400).json({
      message: "All fields are Required",
    });
  }

  // Todo: Implement trim() in frontend
  const newGoal = new Goal({
    title: String(title).trim(),
    tag: String(tag).trim(),
    user: req.user.id,
  });

  let svdGoal;
  try {
    svdGoal = await newGoal.save();
  } catch (err) {
    if (err?.code === 11000) {
      throw new ExpressError(409, "Goal tag already exists");
    }
    throw err;
  }

  if (!svdGoal) throw new ExpressError(500, "Failed To Create Goal");

  res.status(200).send({
    success: true,
    message: "Your Goal Saved",
    data: svdGoal,
  });
});

// Update Goal Controller

module.exports.updateGoal = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const { title, tag } = req.body;

  if (!title || !tag) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  let updatedGoal;
  try {
    updatedGoal = await Goal.findOneAndUpdate(
      { _id: id, user: req.user.id },
      { title: String(title).trim(), tag: String(tag).trim() },
      { new: true },
    );
  } catch (err) {
    if (err?.code === 11000) {
      throw new ExpressError(409, "Goal tag already exists");
    }
    throw err;
  }

  if (!updatedGoal) {
    return res.status(404).json({
      message: "Goal NOT Found",
    });
  }

  return res.status(200).json({
    message: "Goal Successfully Updated",
    updatedGoal,
  });
});

module.exports.deleteGoal = wrapAsync(async (req, res, next) => {
  const goalToBeDeleted = await Goal.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!goalToBeDeleted) throw new ExpressError(404, "Goal Not Found");

  await Task.deleteMany({ user: req.user.id, goal: goalToBeDeleted._id });

  res.status(200).json({
    success: true,
    message: "Goal Deleted Successfully",
  });
});
