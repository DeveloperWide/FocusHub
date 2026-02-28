const Task = require("../models/Task");
const wrapAsync = require("../utils/asyncWrapper");
const ExpressError = require("../utils/ExpressError");

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
  const { title, priority } = req.body;

  if (!title || !priority) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  console.log(" Task Request Body : ", req.body);

  const newTask = new Task({
    ...req.body,
    user: req.user.id,
  });

  const svdTask = await newTask.save();
  if (!svdTask) throw new ExpressError(500, "Failed to create task");

  res.status(201).json({
    success: true,
    message: "Task created successfully",
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

/* module.exports.updateTask = wrapAsync(async (req, res, next) => {
  const { id } = req.params;

  const updatedTask = await Task.findByIdAndUpdate(
    id,
    { ...req.body },
    { new: true },
  );

  if (!updatedTask) throw new ExpressError(404, "Task not found");

  res.json({
    success: true,
    message: "Task updated successfully",
    data: updatedTask,
  });
});

module.exports.updateTaskInProgress = wrapAsync(async (req, res, next) => {
  if (req.body.status === "todo") {
    req.body.inProgress = 0;
  } else if (req.body.status === "in_Progress") {
    req.body.inProgress = 50;
  } else {
    req.body.inProgress = 100;
  }

  const updated = await Task.findByIdAndUpdate(req.params.id, { ...req.body });
  if (!updated) throw new ExpressError(404, "Task not found");

  res.status(200).json({
    success: true,
    message: "Task Updated Successfully",
  });
});

module.exports.deleteTask = wrapAsync(async (req, res, next) => {
  const { id } = req.params;
  const deleted = await Task.findByIdAndDelete(id);

  if (!deleted) throw new ExpressError(404, "Task not found");

  res.status(200).json({
    success: true,
    message: "Task Deleted Successfully",
  });
});
 */
