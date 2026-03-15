const Task = require("../models/Task");
const wrapAsync = require("../utils/asyncWrapper");
const ExpressError = require("../utils/ExpressError");
const Goal = require("../models/Goal");

module.exports.getTasks = wrapAsync(async (req, res, next) => {
  const allTasks = await Task.find({ user: req.user.id });

  if (!allTasks) throw new ExpressError(404, "No tasks found");

  res.json({
    success: true,
    message: "All Tasks Retrieved...!",
    data: allTasks,
  });
});

module.exports.createTask = wrapAsync(async (req, res, next) => {
  const { title, priority, type, tag } = req.body;
  console.log("req.body : ", req.body);

  if (!title || !priority || !type || !tag) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  let goal = null;
  if (type !== "task") {
    const goalDoc = await Goal.findOne({ tag: type });
    console.log("goalDoc : ", goalDoc);
    if (!goalDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid task type",
      });
    }
    goal = goalDoc._id;
  }

  const newTask = new Task({
    title,
    priority,
    type,
    goal,
    tag,
    user: req.user.id,
  });

  const svdTask = await newTask.save();
  console.log("Saved Task : ", svdTask);
  res.json({
    success: true,
    message: "Task Created Successfully",
    data: svdTask,
  });
});

module.exports.showTask = wrapAsync(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ExpressError(404, "Task not found");

  res.json({
    success: true,
    message: "Your Task",
    data: task,
  });
});

module.exports.updateTask = wrapAsync(async (req, res) => {
  const { id } = req.params;
  const { title, priority, type, tag } = req.body;

  const task = await Task.findById(id);
  if (!task) throw new ExpressError(404, "Task not found");

  let goal = null;

  if (type !== "task") {
    const goalDoc = await Goal.findOne({ tag: type });
    if (!goalDoc) {
      return res.status(400).json({
        success: false,
        message: "Invalid task type",
      });
    }
    goal = goalDoc._id;
  }

  const updatedTask = await Task.findByIdAndUpdate(
    id,
    {
      title,
      priority,
      type,
      goal,
      tag,
      user: req.user.id,
    },
    { new: true },
  );

  console.log("updated Task : ", updatedTask);

  res.json({
    success: true,
    message: "Task Updated Successfully",
    data: updatedTask,
  });
});

module.exports.deleteTask = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const deletedTask = await Task.findByIdAndDelete(id);

  if (!deletedTask) throw new ExpressError(404, "Task not found");

  res.status(200).json({
    success: true,
    message: "Task Deleted Successfully",
  });
});
