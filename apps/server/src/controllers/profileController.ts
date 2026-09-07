import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../models/User";
import Task from "../models/Task";
import Goal from "../models/Goal";
import FocusTimer from "../models/FocusTimer";
import Focus from "../models/Focus";
import { wrapAsync } from "../utils/asyncWrapper";
import ExpressError from "../utils/ExpressError";

type UpdateUser = Pick<IUser, "name" | "email"> &
  Partial<Pick<IUser, "profileImage">>;

export const updateProfile = wrapAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let { name, email } = req.body;

    const update: UpdateUser = {
      name: String(name || "").trim(),
      email: String(email || "").trim(),
    };

    if (req.file) {
      update.profileImage = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    const userToBeUpdated = await User.findByIdAndUpdate(req.user?.id, update, {
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
);

export const deleteMe = wrapAsync(async (req, res) => {
  const userId = req.user?.id;

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
