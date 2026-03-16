const User = require("../models/User");
const Task = require("../models/Task");
const Goal = require("../models/Goal");
const FocusTimer = require("../models/FocusTimer");
const Focus = require("../models/Focus");
const wrapAsync = require("../utils/asyncWrapper");
const ExpressError = require("../utils/ExpressError");

exports.updateProfile = wrapAsync(
  async (req, res, next) => {
    let { name, email } = req.body;

    const update = {
      name: String(name || "").trim(),
      email: String(email || "").trim(),
    };

    if (req.file) {
      update.profileImage = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    const userToBeUpdated = await User.findByIdAndUpdate(req.user.id, update, {
      new: true,
    });

    if (!userToBeUpdated) throw new ExpressError(404, "User Not Found");

    res.status(200).json({
      message: "Profile updated",
      user: {
        ...userToBeUpdated,
      },
    });
  },
)

exports.deleteMe = wrapAsync(async (req, res) => {
  const userId = req.user.id;

  await Promise.all([
    Task.deleteMany({ user: userId }),
    Goal.deleteMany({ user: userId }),
    FocusTimer.deleteMany({ user: userId }),
    Focus.deleteMany({ user: userId }),
  ]);

  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) throw new ExpressError(404, "User Not Found");

  res.status(200).json({
    success: true,
    message: "Account deleted",
  });
});
