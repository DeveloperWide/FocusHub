const Goal = require("../models/Goal");
const wrapAsync = require("../utils/asyncWrapper");
const ExpressError = require("../utils/ExpressError");

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
  console.log(req.user);
  const goals = await Goal.find({ user: req.user.id });

  if (goals.length > 2) {
    throw new ExpressError(406, "Only 3 Goals Are Accepted");
  }

  if (!title || !tag) {
    return res.status(400).json({
      message: "All fields are Required",
    });
  }

  // Todo: Implement trim() in frontend
  const newGoal = new Goal({
    title,
    tag,
    user: req.user.id,
  });

  const svdGoal = await newGoal.save();

  if (!svdGoal) throw new ExpressError(500, "Failed To Create Goal");

  res.status(200).send({
    success: true,
    message: "Your Goal Saved",
    data: svdGoal,
  });
});

module.exports.deleteGoal = wrapAsync(async (req, res, next) => {
  const goalToBeDeleted = await Goal.findByIdAndDelete(req.params.id);

  if (!goalToBeDeleted) throw new ExpressError(404, "Goal Not Found");

  res.status(200).json({
    success: true,
    message: "Goal Deleted Successfully",
  });
});
