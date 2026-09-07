"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMe = exports.updateProfile = void 0;
const User_1 = __importDefault(require("../models/User"));
const Task_1 = __importDefault(require("../models/Task"));
const Goal_1 = __importDefault(require("../models/Goal"));
const FocusTimer_1 = __importDefault(require("../models/FocusTimer"));
const Focus_1 = __importDefault(require("../models/Focus"));
const asyncWrapper_1 = require("../utils/asyncWrapper");
const ExpressError_1 = __importDefault(require("../utils/ExpressError"));
exports.updateProfile = (0, asyncWrapper_1.wrapAsync)(async (req, res, next) => {
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
    const userToBeUpdated = await User_1.default.findByIdAndUpdate(req.user?.id, update, {
        new: true,
    });
    if (!userToBeUpdated)
        throw new ExpressError_1.default(404, "User Not Found");
    res.status(200).json({
        message: "Profile updated",
        user: {
            ...userToBeUpdated,
        },
    });
});
exports.deleteMe = (0, asyncWrapper_1.wrapAsync)(async (req, res) => {
    const userId = req.user?.id;
    await Promise.all([
        Task_1.default.deleteMany({ user: userId }),
        Goal_1.default.deleteMany({ user: userId }),
        FocusTimer_1.default.deleteMany({ user: userId }),
        Focus_1.default.deleteMany({ user: userId }),
    ]);
    const deletedUser = await User_1.default.findByIdAndDelete(userId);
    if (!deletedUser)
        throw new ExpressError_1.default(404, "User Not Found");
    res.status(200).json({
        success: true,
        message: "Account deleted",
    });
});
